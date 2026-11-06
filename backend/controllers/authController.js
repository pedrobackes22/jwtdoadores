import bcrypt from "bcryptjs";
import { Buffer } from "node:buffer";
import jwt from "jsonwebtoken";
import pool from "../database/conexao.js";
import { texto, falhar } from "../utils/regras.js";
function emailValido(valor) {
  const email = texto(valor, "E-mail", 190).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    falhar(400, "E-mail inválido.");
  return email;
}
export async function cadastro(req, res) {
  const nome = texto(req.body.nome, "Nome", 120);
  const email = emailValido(req.body.email);
  const telefone = texto(req.body.telefone, "Telefone", 25);
  if (telefone.replace(/\D/g, "").length < 10)
    falhar(400, "Informe telefone com DDD.");
  const senha = texto(req.body.senha, "Senha", 72);
  if (senha.length < 8 || Buffer.byteLength(senha, "utf8") > 72)
    falhar(400, "Senha deve ter pelo menos 8 caracteres e até 72 bytes.");
  const tipo = req.body.tipo_usuario;
  if (!["DOADOR", "RECEPTOR"].includes(tipo))
    falhar(400, "Escolha DOADOR ou RECEPTOR.");
  const hash = await bcrypt.hash(senha, 12);
  const [resultado] = await pool.execute(
    "INSERT INTO usuarios(nome,email,telefone,senha_hash,tipo_usuario) VALUES (?,?,?,?,?)",
    [nome, email, telefone, hash, tipo],
  );
  res
    .status(201)
    .json({
      mensagem: "Conta criada! Entre com seu e-mail e senha.",
      id: resultado.insertId,
    });
}
export async function login(req, res) {
  const email = emailValido(req.body.email);
  const senha = texto(req.body.senha, "Senha", 72);
  const [usuarios] = await pool.execute(
    "SELECT * FROM usuarios WHERE email=?",
    [email],
  );
  const usuario = usuarios[0];
  if (!usuario || !(await bcrypt.compare(senha, usuario.senha_hash)))
    falhar(401, "E-mail ou senha incorretos.");
  const token = jwt.sign({}, process.env.JWT_SECRET, {
    algorithm: "HS256",
    subject: String(usuario.id),
    expiresIn: "8h",
    issuer: "alimenta-plus",
    audience: "alimenta-mobile",
  });
  delete usuario.senha_hash;
  res.json({ mensagem: "Login realizado.", token, usuario });
}
export function me(req, res) {
  res.json({ dados: req.usuario });
}
