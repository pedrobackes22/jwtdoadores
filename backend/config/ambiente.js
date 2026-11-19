import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
dotenv.config({
  path: fileURLToPath(new URL("../.env", import.meta.url)),
  quiet: true,
});
export function validarAmbiente() {
  if (process.env.TRUST_PROXY_HOPS !== undefined &&
      !/^[1-9]\d*$/.test(process.env.TRUST_PROXY_HOPS))
    throw new Error("TRUST_PROXY_HOPS deve ser um número inteiro positivo de proxies confiáveis, ou ficar ausente.");
  for (const chave of ["DB_HOST", "DB_USER", "DB_NAME", "JWT_SECRET"]) {
    if (!process.env[chave]?.trim())
      throw new Error("Configure " + chave + " em backend/.env.");
  }
  if (process.env.DB_PASSWORD === undefined)
    throw new Error("Configure DB_PASSWORD.");
  if (
    process.env.JWT_SECRET.trim().length < 32 ||
    process.env.JWT_SECRET.startsWith("substitua_") ||
    process.env.JWT_SECRET.includes("altere_para_uma_aleatoria")
  )
    throw new Error(
      "JWT_SECRET deve ser aleatório, com 32 caracteres ou mais.",
    );
  for (const chave of ["DB_PORT", "PORT"]) {
    const porta = Number(
      process.env[chave] || (chave === "PORT" ? 3000 : 3306),
    );
    if (!Number.isInteger(porta) || porta < 1 || porta > 65535)
      throw new Error(chave + " deve ser uma porta válida.");
  }
}
