import { CATEGORIAS } from "../../shared/constants.js";
export function falhar(status, mensagem) {
  throw Object.assign(new Error(mensagem), { status });
}
export function idValido(valor) {
  if (
    !/^\d+$/.test(String(valor)) ||
    !Number.isSafeInteger(Number(valor)) ||
    Number(valor) < 1
  )
    falhar(400, "ID inválido.");
  return Number(valor);
}
export function texto(valor, nome, max, obrigatorio = true) {
  if (valor === undefined && !obrigatorio) return "";
  if (
    typeof valor !== "string" ||
    valor.trim().length > max ||
    (obrigatorio && !valor.trim())
  )
    falhar(400, nome + " inválido.");
  return valor.trim();
}
// Trabalhamos com milésimos: a API recusa precisão superior à coluna DECIMAL(10,3).
export function quantidade(valor) {
  if (
    !["string", "number"].includes(typeof valor) ||
    !/^\d+(\.\d{1,3})?$/.test(String(valor)) ||
    Number(valor) <= 0 ||
    Number(valor) > 9999999.999
  )
    falhar(400, "Quantidade deve ser positiva e ter até 3 casas decimais.");
  return Number(valor);
}
export function hoje() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
export function validarAlimento(body) {
  const a = {};
  for (const [campo, max] of Object.entries({
    nome: 120,
    categoria: 50,
    unidade: 25,
    cidade: 100,
    bairro: 100,
    endereco_retirada: 255,
  }))
    a[campo] = texto(body[campo], campo, max);
  for (const campo of ["descricao", "informacoes_adicionais"])
    a[campo] = texto(body[campo], campo, 4000, false);
  if (!CATEGORIAS.includes(a.categoria)) falhar(400, "Categoria inválida.");
  a.quantidade = quantidade(body.quantidade);
  a.data_validade = texto(body.data_validade, "Data de validade", 10);
  const data = new Date(a.data_validade + "T12:00:00Z");
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(a.data_validade) ||
    Number.isNaN(data.getTime()) ||
    data.toISOString().slice(0, 10) !== a.data_validade ||
    a.data_validade < hoje()
  )
    falhar(
      400,
      "Validade deve ser uma data real, hoje ou futura (AAAA-MM-DD).",
    );
  a.imagem_url =
    texto(body.imagem_url || "", "URL da imagem", 2048, false) || null;
  if (a.imagem_url) {
    try {
      if (new URL(a.imagem_url).protocol !== "https:") throw new Error();
    } catch {
      falhar(400, "A imagem deve usar uma URL HTTPS pública.");
    }
  }
  return a;
}
export async function transacao(pool, executar) {
  const conexao = await pool.getConnection();
  try {
    // Evita snapshot antigo criado pela consulta de referência antes do FOR UPDATE.
    // O bloqueio do alimento serializa toda alteração de estoque; a soma deve ler
    // os commits anteriores depois de conseguir esse bloqueio.
    await conexao.query("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
    await conexao.beginTransaction();
    const resultado = await executar(conexao);
    await conexao.commit();
    return resultado;
  } catch (erro) {
    await conexao.rollback();
    throw erro;
  } finally {
    conexao.release();
  }
}
export async function bloquearAlimento(db, id) {
  const [linhas] = await db.execute(
    "SELECT * FROM alimentos WHERE id = ? FOR UPDATE",
    [id],
  );
  if (!linhas[0]) falhar(404, "Alimento não encontrado.");
  return linhas[0];
}
export async function estoque(db, alimento) {
  const [linhas] = await db.execute(
    `SELECT COALESCE(SUM(CASE WHEN status='APROVADA' THEN quantidade_solicitada ELSE 0 END),0) reservada,
    COALESCE(SUM(CASE WHEN status='ENTREGUE' THEN quantidade_solicitada ELSE 0 END),0) entregue FROM solicitacoes WHERE alimento_id=?`,
    [alimento.id],
  );
  const reservada = Number(linhas[0].reservada),
    entregue = Number(linhas[0].entregue);
  return {
    reservada,
    entregue,
    disponivel:
      Math.round((Number(alimento.quantidade) - reservada - entregue) * 1000) /
      1000,
  };
}
export function verificarDisponivel(a, saldo, pedido) {
  if (a.status !== "ATIVO" || a.data_validade < hoje())
    falhar(409, "Oferta indisponível ou vencida.");
  if (pedido > saldo.disponivel)
    falhar(409, "Quantidade superior à disponibilidade atual.");
}
