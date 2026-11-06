import { spawn } from "node:child_process";
// Exporta com a URL local usada somente pela instância de teste.
const env = {
  ...process.env,
  EXPO_PUBLIC_API_URL: "http://127.0.0.1:3011/api",
  TEST_WEB: "1",
};
function executar(args) {
  return new Promise((r, j) => {
    const p = spawn(process.execPath, args, {
      stdio: "inherit",
      env,
      windowsHide: true,
    });
    p.on("error", j);
    p.on("exit", (c) =>
      c === 0 ? r() : j(new Error("Etapa falhou: " + args.join(" "))),
    );
  });
}
try {
  await executar(["node_modules/expo/bin/cli", "export", "--platform", "web"]);
  await executar(["scripts/testar-mysql.js"]);
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
}
