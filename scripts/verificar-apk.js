import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { validarApiDispositivo } from "../shared/configBuild.js";

try {
  // O .env da raiz continua exclusivo do Expo local (localhost no navegador).
  const eas = JSON.parse(
    readFileSync(
      fileURLToPath(new URL("../eas.json", import.meta.url)),
      "utf8",
    ),
  );
  const url = validarApiDispositivo(
    process.env.EXPO_PUBLIC_API_URL ||
      eas.build.preview.env.EXPO_PUBLIC_API_URL,
    {
      publica: eas.build.preview.env.ALIMENTA_API_PUBLICA === "1",
    },
  );
  const r = await fetch(url + "/health", {
    signal: AbortSignal.timeout(10000),
  });
  if (!r.ok || typeof (await r.json()).mensagem !== "string")
    throw new Error("O endpoint /api/health não retornou a resposta esperada.");
  console.log("URL válida para build e API acessível neste computador: " + url);
  console.log(
    "Abra também " +
      url +
      "/health no navegador do celular: este teste não comprova acesso pelo aparelho.",
  );
} catch (erro) {
  console.error(
    "APK não está pronto: " +
      (erro.cause ? "API inacessível pelo computador." : erro.message),
  );
  process.exitCode = 1;
}
