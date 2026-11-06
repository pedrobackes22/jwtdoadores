import { validarAmbiente } from "./config/ambiente.js";
import pool from "./database/conexao.js";
import app from "./app.js";
validarAmbiente();
await pool.query("SELECT 1");
const servidor = app.listen(
  Number(process.env.PORT || 3000),
  "0.0.0.0",
  function () {
    console.log("API Alimenta+ na porta " + (process.env.PORT || 3000));
  },
);
for (const sinal of ["SIGINT", "SIGTERM"])
  process.on(sinal, function () {
    servidor.close(async function () {
      await pool.end();
      process.exit(0);
    });
  });
