import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
dotenv.config({
  path: fileURLToPath(new URL("../.env", import.meta.url)),
  quiet: true,
});
export function validarAmbiente() {
  for (const chave of ["DB_HOST", "DB_USER", "DB_NAME", "JWT_SECRET"]) {
    if (!process.env[chave])
      throw new Error("Configure " + chave + " em backend/.env.");
  }
  if (process.env.DB_PASSWORD === undefined)
    throw new Error("Configure DB_PASSWORD.");
  if (
    process.env.JWT_SECRET.length < 32 ||
    process.env.JWT_SECRET.startsWith("substitua_")
  )
    throw new Error(
      "JWT_SECRET deve ser aleatório, com 32 caracteres ou mais.",
    );
}
