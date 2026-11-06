import pool from "../database/conexao.js";
import {
  validarAlimento,
  idValido,
  hoje,
  falhar,
  transacao,
  bloquearAlimento,
  estoque,
} from "../utils/regras.js";
const selecao = `SELECT a.*, u.nome AS doador_nome,
 COALESCE(s.reservada,0) reservada, COALESCE(s.entregue,0) entregue,
 a.quantidade-COALESCE(s.reservada,0)-COALESCE(s.entregue,0) disponivel
 FROM alimentos a JOIN usuarios u ON u.id=a.doador_id
 LEFT JOIN (SELECT alimento_id,
 SUM(CASE WHEN status='APROVADA' THEN quantidade_solicitada ELSE 0 END) reservada,
 SUM(CASE WHEN status='ENTREGUE' THEN quantidade_solicitada ELSE 0 END) entregue
 FROM solicitacoes GROUP BY alimento_id) s ON s.alimento_id=a.id`;
function ocultarEndereco(a, usuario) {
  if (a.doador_id !== usuario.id) delete a.endereco_retirada;
  return a;
}
export async function listar(req, res) {
  const filtros = ["a.status = ?", "a.data_validade >= ?"],
    valores = ["ATIVO", hoje()];
  if (req.query.busca) {
    filtros.push("(a.nome LIKE ? OR a.cidade LIKE ?)");
    const busca = String(req.query.busca).slice(0, 120);
    valores.push("%" + busca + "%", "%" + busca + "%");
  }
  if (req.query.categoria) {
    filtros.push("a.categoria = ?");
    valores.push(String(req.query.categoria));
  }
  const [dados] = await pool.execute(
    selecao +
      " WHERE " +
      filtros.join(" AND ") +
      " HAVING disponivel > 0 ORDER BY a.created_at DESC LIMIT 200",
    valores,
  );
  res.json({ dados: dados.map((a) => ocultarEndereco(a, req.usuario)) });
}
export async function meus(req, res) {
  const [dados] = await pool.execute(
    selecao + " WHERE a.doador_id=? AND a.status <> ? ORDER BY a.id DESC",
    [req.usuario.id, "EXCLUIDO"],
  );
  res.json({ dados });
}
export async function detalhes(req, res) {
  const id = idValido(req.params.id);
  const [dados] = await pool.execute(selecao + " WHERE a.id=?", [id]);
  const a = dados[0];
  if (!a || (a.status === "EXCLUIDO" && a.doador_id !== req.usuario.id))
    falhar(404, "Alimento não encontrado.");
  if (a.doador_id !== req.usuario.id) {
    const [acesso] = await pool.execute(
      "SELECT id FROM solicitacoes WHERE alimento_id=? AND receptor_id=? AND status IN ('APROVADA','ENTREGUE') LIMIT 1",
      [id, req.usuario.id],
    );
    if (!acesso.length) delete a.endereco_retirada;
  }
  res.json({ dados: a });
}
export async function criar(req, res) {
  const a = validarAlimento(req.body),
    campos = Object.keys(a);
  const [resultado] = await pool.execute(
    "INSERT INTO alimentos(doador_id," +
      campos.join(",") +
      ") VALUES (?," +
      campos.map(() => "?").join(",") +
      ")",
    [req.usuario.id, ...Object.values(a)],
  );
  res
    .status(201)
    .json({ mensagem: "Doação publicada.", id: resultado.insertId });
}
export async function editar(req, res) {
  const id = idValido(req.params.id),
    novo = validarAlimento(req.body);
  await transacao(pool, async function (db) {
    const a = await bloquearAlimento(db, id);
    if (a.doador_id !== req.usuario.id)
      falhar(403, "Somente o dono pode editar esta oferta.");
    if (a.status !== "ATIVO") falhar(409, "Oferta excluída.");
    const saldo = await estoque(db, a);
    if (novo.quantidade < saldo.reservada + saldo.entregue)
      falhar(
        409,
        "Total não pode ser menor que a quantidade reservada e entregue.",
      );
    const [historico] = await db.execute(
      "SELECT id FROM solicitacoes WHERE alimento_id=? LIMIT 1",
      [id],
    );
    if (historico.length && novo.unidade !== a.unidade)
      falhar(409, "Não altere a unidade de uma oferta com solicitações.");
    await db.execute(
      "UPDATE alimentos SET " +
        Object.keys(novo)
          .map((c) => c + "=?")
          .join(",") +
        " WHERE id=?",
      [...Object.values(novo), id],
    );
  });
  res.json({ mensagem: "Doação atualizada." });
}
export async function excluir(req, res) {
  const id = idValido(req.params.id);
  await transacao(pool, async function (db) {
    const a = await bloquearAlimento(db, id);
    if (a.doador_id !== req.usuario.id)
      falhar(403, "Somente o dono pode excluir esta oferta.");
    const saldo = await estoque(db, a);
    if (saldo.reservada > 0)
      falhar(409, "Conclua ou recuse as reservas aprovadas antes de excluir.");
    await db.execute("UPDATE alimentos SET status='EXCLUIDO' WHERE id=?", [id]);
    await db.execute(
      "UPDATE solicitacoes SET status='RECUSADA' WHERE alimento_id=? AND status='PENDENTE'",
      [id],
    );
  });
  res.json({ mensagem: "Oferta excluída. O histórico foi preservado." });
}
