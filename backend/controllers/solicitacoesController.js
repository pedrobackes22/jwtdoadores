import pool from "../database/conexao.js";
import {
  idValido,
  quantidade,
  falhar,
  transacao,
  bloquearAlimento,
  estoque,
  verificarDisponivel,
} from "../utils/regras.js";
export async function criar(req, res) {
  const alimentoId = idValido(req.body.alimento_id),
    pedido = quantidade(req.body.quantidade_solicitada);
  const id = await transacao(pool, async function (db) {
    const a = await bloquearAlimento(db, alimentoId);
    verificarDisponivel(a, await estoque(db, a), pedido);
    const [ativas] = await db.execute(
      "SELECT id FROM solicitacoes WHERE alimento_id=? AND receptor_id=? AND status IN ('PENDENTE','APROVADA')",
      [alimentoId, req.usuario.id],
    );
    if (ativas.length)
      falhar(409, "Você já tem uma solicitação ativa para esta oferta.");
    const [r] = await db.execute(
      "INSERT INTO solicitacoes(alimento_id,receptor_id,quantidade_solicitada) VALUES (?,?,?)",
      [alimentoId, req.usuario.id, pedido],
    );
    return r.insertId;
  });
  res.status(201).json({ mensagem: "Solicitação enviada ao doador.", id });
}
export async function listar(req, res) {
  const doador = req.usuario.tipo_usuario === "DOADOR";
  const filtro = doador ? "a.doador_id=?" : "s.receptor_id=?";
  const [dados] = await pool.execute(
    `SELECT s.id,s.alimento_id,s.quantidade_solicitada,s.status,s.created_at,s.updated_at,
    a.nome AS alimento_nome,a.unidade,a.cidade,a.bairro,a.data_validade,
    d.nome AS doador_nome,r.nome AS receptor_nome,
    CASE WHEN s.status IN ('APROVADA','ENTREGUE') OR a.doador_id=? THEN a.endereco_retirada ELSE NULL END endereco_retirada
    FROM solicitacoes s JOIN alimentos a ON a.id=s.alimento_id
    JOIN usuarios d ON d.id=a.doador_id JOIN usuarios r ON r.id=s.receptor_id
    WHERE ${filtro} ORDER BY s.id DESC`,
    [req.usuario.id, req.usuario.id],
  );
  res.json({ dados });
}
export function mudar(acao) {
  return async function (req, res) {
    const id = idValido(req.params.id);
    await transacao(pool, async function (db) {
      // Todas as operações travam alimento antes da solicitação, na mesma ordem.
      const [refs] = await db.execute(
        "SELECT alimento_id FROM solicitacoes WHERE id=?",
        [id],
      );
      if (!refs.length) falhar(404, "Solicitação não encontrada.");
      const a = await bloquearAlimento(db, refs[0].alimento_id);
      const [linhas] = await db.execute(
        "SELECT * FROM solicitacoes WHERE id=? FOR UPDATE",
        [id],
      );
      const s = linhas[0];
      if (acao === "cancelar") {
        if (s.receptor_id !== req.usuario.id)
          falhar(403, "Esta solicitação pertence a outro receptor.");
        if (s.status !== "PENDENTE")
          falhar(409, "Somente solicitações pendentes podem ser canceladas.");
      } else {
        if (a.doador_id !== req.usuario.id)
          falhar(
            403,
            "Somente o dono da oferta pode administrar esta solicitação.",
          );
        const permitidos =
          acao === "entregar"
            ? ["APROVADA"]
            : acao === "recusar"
              ? ["PENDENTE", "APROVADA"]
              : ["PENDENTE"];
        if (!permitidos.includes(s.status))
          falhar(409, "Transição de status não permitida.");
      }
      if (acao === "aprovar")
        verificarDisponivel(
          a,
          await estoque(db, a),
          Number(s.quantidade_solicitada),
        );
      const destino = {
        aprovar: "APROVADA",
        recusar: "RECUSADA",
        cancelar: "CANCELADA",
        entregar: "ENTREGUE",
      }[acao];
      await db.execute("UPDATE solicitacoes SET status=? WHERE id=?", [
        destino,
        id,
      ]);
    });
    res.json({ mensagem: "Solicitação atualizada." });
  };
}
