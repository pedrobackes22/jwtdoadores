// Smoke test do ambiente local: somente consultas e entradas inválidas, sem criar registros.
import { chromium, expect } from "@playwright/test";
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  const page = await browser.newPage();
  const destinos = [];
  const erros = [];
  page.on("pageerror", (e) => erros.push(e.message));
  page.on("request", (r) => {
    if (r.url().includes("/api/auth/")) destinos.push(new URL(r.url()).origin);
  });
  await page.goto("http://localhost:8081", { timeout: 120000 });
  await page
    .getByLabel("E-mail", { exact: true })
    .fill("auditoria-inexistente@example.invalid");
  await page.getByLabel("Senha", { exact: true }).fill("senha-incorreta");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page.getByText("E-mail ou senha incorretos.")).toBeVisible({
    timeout: 20000,
  });
  await page
    .getByRole("button", { name: "Não tem conta? Cadastre-se", exact: true })
    .click();
  for (const [rotulo, valor] of [
    ["Nome ou estabelecimento", "Auditoria sem gravação"],
    ["E-mail", "email-invalido"],
    ["Telefone com DDD", "11999999999"],
    ["Senha", "senha-de-teste"],
    ["Confirmar senha", "senha-de-teste"],
  ])
    await page
      .getByLabel(rotulo, { exact: true })
      .filter({ visible: true })
      .fill(valor);
  await page.getByRole("button", { name: "Criar conta", exact: true }).click();
  await expect(
    page.getByText("E-mail inválido.", { exact: true }),
  ).toBeVisible();
  expect(destinos).toEqual(["http://localhost:3000", "http://localhost:3000"]);
  expect(erros).toEqual([]);
  console.log(
    "Expo Web localhost:8081 → localhost:3000/api: login 401 e cadastro 400 exibidos corretamente; sem gravação e sem erros de página.",
  );
} finally {
  await browser.close();
}
