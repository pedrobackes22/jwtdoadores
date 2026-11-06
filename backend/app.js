import "./config/ambiente.js";
import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import alimentosRoutes from "./routes/alimentosRoutes.js";
import solicitacoesRoutes from "./routes/solicitacoesRoutes.js";
const app = express();
app.disable("x-powered-by");
app.use(cors());
app.use(express.json({ limit: "32kb" }));
app.use(function (req, res, next) {
  res.setHeader("Cache-Control", "no-store");
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body))
    req.body = {};
  next();
});
app.get("/api/health", async function (req, res) {
  res.json({ mensagem: "API Alimenta+ disponível." });
});
app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      mensagem: "Muitas tentativas. Aguarde antes de tentar novamente.",
    },
  }),
  authRoutes,
);
app.use("/api/alimentos", alimentosRoutes);
app.use("/api/solicitacoes", solicitacoesRoutes);
app.use(function (req, res) {
  res.status(404).json({ mensagem: "Rota não encontrada." });
});
app.use(function (erro, req, res, next) {
  if (erro.type === "entity.parse.failed")
    return res.status(400).json({ mensagem: "JSON inválido." });
  if (erro.type === "entity.too.large")
    return res.status(413).json({ mensagem: "Requisição muito grande." });
  if (erro.code === "ER_DUP_ENTRY")
    return res
      .status(409)
      .json({
        mensagem: "E-mail já cadastrado ou solicitação ativa duplicada.",
      });
  if (erro.code === "ER_LOCK_DEADLOCK" || erro.code === "ER_LOCK_WAIT_TIMEOUT")
    return res
      .status(409)
      .json({ mensagem: "Operação concorrente. Atualize e tente novamente." });
  if (erro.status)
    return res.status(erro.status).json({ mensagem: erro.message });
  console.error("Erro interno:", erro.code || erro.name);
  res
    .status(500)
    .json({
      mensagem: "Não foi possível concluir a operação. Tente novamente.",
    });
});
export default app;
