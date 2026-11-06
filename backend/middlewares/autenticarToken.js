import jwt from "jsonwebtoken";
import pool from "../database/conexao.js";
export default async function autenticarToken(req, res, next) {
  const partes = (req.headers.authorization || "").split(" ");
  if (partes.length !== 2 || partes[0] !== "Bearer")
    return res.status(401).json({ mensagem: "Informe um Bearer Token." });
  let payload;
  try {
    payload = jwt.verify(partes[1], process.env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: "alimenta-plus",
      audience: "alimenta-mobile",
    });
    if (!Number.isSafeInteger(Number(payload.sub)) || Number(payload.sub) < 1)
      throw new Error();
  } catch {
    return res
      .status(401)
      .json({ mensagem: "Sessão inválida ou expirada. Entre novamente." });
  }
  try {
    const [usuarios] = await pool.execute(
      "SELECT id,nome,email,telefone,tipo_usuario,created_at FROM usuarios WHERE id=?",
      [Number(payload.sub)],
    );
    if (!usuarios[0])
      return res.status(401).json({ mensagem: "Usuário não encontrado." });
    req.usuario = usuarios[0]; // O papel atual vem do banco, nunca do corpo ou de claims antigas.
    next();
  } catch (erro) {
    next(erro);
  }
}
