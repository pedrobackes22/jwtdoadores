import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
const caminho =
  process.env.MYSQLD_PATH ||
  "C:/Program Files/MySQL/MySQL Server 8.0/bin/mysqld.exe";
if (!existsSync(caminho)) {
  console.error(
    "Configure MYSQLD_PATH para executar uma instância MySQL isolada.",
  );
  process.exitCode = 1;
} else {
  const filho = spawn(
    process.execPath,
    ["--test", "backend/tests/mysql.integration.test.js"],
    {
      stdio: "inherit",
      windowsHide: true,
      env: { ...process.env, MYSQLD_PATH: caminho, MYSQL_INTEGRATION: "1" },
    },
  );
  filho.on("exit", (code) => {
    process.exitCode = code ?? 1;
  });
  filho.on("error", (erro) => {
    console.error(erro.message);
    process.exitCode = 1;
  });
}
