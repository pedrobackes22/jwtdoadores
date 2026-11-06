import { Router } from "express";
import * as controller from "../controllers/solicitacoesController.js";
import autenticarToken from "../middlewares/autenticarToken.js";
import autorizarTipo from "../middlewares/autorizarTipo.js";
const router = Router();
router.use(autenticarToken);
router.post("/", autorizarTipo("RECEPTOR"), controller.criar);
router.get("/minhas", autorizarTipo("RECEPTOR"), controller.listar);
router.get("/recebidas", autorizarTipo("DOADOR"), controller.listar);
for (const acao of ["aprovar", "recusar", "entregar", "cancelar"])
  router.patch(
    "/:id/" + acao,
    autorizarTipo(acao === "cancelar" ? "RECEPTOR" : "DOADOR"),
    controller.mudar(acao),
  );
export default router;
