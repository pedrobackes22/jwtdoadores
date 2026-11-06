import { Router } from "express";
import { cadastro, login, me } from "../controllers/authController.js";
import autenticarToken from "../middlewares/autenticarToken.js";
const router = Router();
router.post("/cadastro", cadastro);
router.post("/login", login);
router.get("/me", autenticarToken, me);
export default router;
