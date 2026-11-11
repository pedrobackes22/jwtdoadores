import { chromium, expect } from "@playwright/test";
import express from "express";
import { resolve } from "node:path";
import { hojeLocal, dataBrasileira } from "../shared/datas.js";
export async function validarInterface({ app, senha, verificarPublicacao }) {
  const web = express();
  web.use(express.static(resolve("dist")));
  const http = web.listen(3012, "127.0.0.1");
  const apiHttp = app.listen(3011, "127.0.0.1");
  await Promise.all(
    [http, apiHttp].map(
      (s) =>
        new Promise((r, j) => {
          s.once("listening", r);
          s.once("error", j);
        }),
    ),
  );
  let browser;
  try {
    browser = await chromium.launch({ channel: "msedge", headless: true });
    const page = await browser.newPage({
      viewport: { width: 412, height: 915 },
    });
    const erros = [];
    page.on("pageerror", (e) => erros.push(e.message));
    const respostasApi = [];
    page.on("response", (r) => {
      if (r.url().startsWith("http://127.0.0.1:3011/api/"))
        respostasApi.push(r.status());
    });
    await page.goto("http://127.0.0.1:3012");
    function campo(rotulo) {
      return page.getByLabel(rotulo, { exact: true }).filter({ visible: true });
    }
    async function botao(nome) {
      await page
        .getByRole("button", { name: nome, exact: true })
        .filter({ visible: true })
        .click();
    }
    async function entrar(nome) {
      await campo("E-mail").fill(nome + "@example.com");
      await campo("Senha").fill(senha);
      await botao("Entrar");
      await expect(
        page.getByText("Disponíveis para doar", { exact: true }),
      ).toBeVisible();
    }
    async function sair() {
      await page.getByRole("tab", { name: /Perfil/ }).click();
      await botao("Sair da conta");
      await expect(
        page.getByRole("button", { name: "Entrar", exact: true }),
      ).toBeVisible();
    }
    // Cadastro pela interface, sem mock de fetch: valida JSON, rota pública e CORS.
    await botao("Não tem conta? Cadastre-se");
    await botao("DOADOR");
    for (const [rotulo, valor] of [
      ["Nome ou estabelecimento", "Doador visual"],
      ["E-mail", "doadorvisual@example.com"],
      ["Telefone com DDD", "11999999999"],
      ["Senha", senha],
      ["Confirmar senha", senha],
    ])
      await campo(rotulo).fill(valor);
    await botao("Criar conta");
    await expect(
      page.getByText("Conta criada! Entre para começar."),
    ).toBeVisible();
    await botao("Ir para login");
    await campo("E-mail").fill("doadorvisual@example.com");
    await campo("Senha").fill("senha-incorreta");
    await botao("Entrar");
    await expect(page.getByText("E-mail ou senha incorretos.")).toBeVisible();
    await entrar("doadorvisual");
    await page.getByRole("tab", { name: /Doações/ }).click();
    await botao("Cadastrar alimento");
    for (const [r, v] of [
      ["Nome do alimento *", "Maçãs do fluxo visual"],
      ["Quantidade total *", "4"],
      ["Cidade *", "São Paulo"],
      ["Bairro *", "Centro"],
      ["Endereço completo de retirada *", "Rua visual, 42"],
    ])
      await campo(r).fill(v);
    await botao("Selecionar validade");
    await page.screenshot({
      path: "docs/calendario.png",
      fullPage: true,
      animations: "disabled",
    });
    await botao("Hoje");
    await expect(
      page.getByRole("button", {
        name: "Validade: " + dataBrasileira(hojeLocal()),
        exact: true,
      }),
    ).toBeVisible();
    await campo("Quantidade total *").fill("0");
    await botao("Publicar doação");
    await expect(
      page.getByText(
        "Informe uma quantidade maior que zero, com até 3 casas decimais.",
      ),
    ).toBeVisible();
    await campo("Quantidade total *").fill("4");
    await botao("pacotes");
    await botao("kg");
    await botao("Publicar doação");
    await expect(
      page.getByText("Doação publicada!", { exact: true }),
    ).toBeVisible();
    await verificarPublicacao();
    await botao("Concluir");
    // Edição reutiliza a data ISO recebida da API, mostrando o formato brasileiro.
    await botao("Editar");
    await botao("Validade: " + dataBrasileira(hojeLocal()));
    await botao("›");
    const [ano, mes] = hojeLocal().split("-").map(Number);
    const proximo = new Date(ano, mes, 15, 12);
    const validadeEditada = `${proximo.getFullYear()}-${String(proximo.getMonth() + 1).padStart(2, "0")}-15`;
    await botao(dataBrasileira(validadeEditada));
    await campo("Descrição").fill("Validade e unidade verificadas na edição");
    await botao("Salvar alterações");
    await expect(
      page.getByText("Alterações salvas!", { exact: true }),
    ).toBeVisible();
    await botao("Concluir");
    await page.screenshot({ path: "docs/doacoes.png", fullPage: true });
    await sair();
    await entrar("receptor");
    await expect(
      page.getByText("Maçãs do fluxo visual", { exact: true }),
    ).toBeVisible();
    await botao("Ver detalhes");
    await expect(
      page.getByText("Validade: " + dataBrasileira(validadeEditada), {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByText("Liberado após a aprovação da solicitação.", {
        exact: false,
      }),
    ).toBeVisible();
    await campo("Quantidade solicitada (kg)").fill("2");
    await botao("Solicitar doação");
    await botao("Confirmar");
    await expect(
      page.getByText(/Solicitação enviada! Acompanhe/),
    ).toBeVisible();
    await botao("Voltar ao catálogo");
    await page.getByRole("tab", { name: /Perfil/ }).click();
    await botao("Sair da conta");
    await entrar("doadorvisual");
    await page.getByRole("tab", { name: /Solicitações/ }).click();
    const card = page
      .getByText("Maçãs do fluxo visual", { exact: true })
      .locator("..");
    await card.getByRole("button", { name: "Aprovar", exact: true }).click();
    await botao("Confirmar");
    await expect(card.getByText("Aprovada", { exact: true })).toBeVisible();
    await page.screenshot({ path: "docs/aprovacao.png", fullPage: true });
    await page.getByRole("tab", { name: /Perfil/ }).click();
    await botao("Sair da conta");
    await entrar("receptor");
    await page.getByRole("tab", { name: /Solicitações/ }).click();
    await expect(
      page.getByText("Retirada: Rua visual, 42", { exact: true }),
    ).toBeVisible();
    await page.screenshot({ path: "docs/retirada.png", fullPage: true });
    await sair();
    await entrar("doadorvisual");
    await page.getByRole("tab", { name: /Solicitações/ }).click();
    const entrega = page
      .getByText("Maçãs do fluxo visual", { exact: true })
      .locator("..");
    await entrega
      .getByRole("button", { name: "Marcar como entregue", exact: true })
      .click();
    await botao("Confirmar");
    await expect(entrega.getByText("Entregue", { exact: true })).toBeVisible();
    await sair();
    // Navegação completa: cancelar, solicitar novamente, recusar e excluir pela UI.
    async function pedirNovamente() {
      await page.getByRole("tab", { name: /Catálogo/ }).click();
      await campo("O que você procura?").fill("Maçãs do fluxo visual");
      await botao("Ver detalhes");
      await campo("Quantidade solicitada (kg)").fill("0,5");
      await botao("Solicitar doação");
      await botao("Confirmar");
      await expect(
        page.getByText(/Solicitação enviada! Acompanhe/),
      ).toBeVisible();
      await botao("Voltar ao catálogo");
      await page.getByRole("tab", { name: /Solicitações/ }).click();
    }
    function pedidoPendente() {
      return page
        .getByText("Maçãs do fluxo visual", { exact: true })
        .locator("..")
        .filter({ has: page.getByText("Pendente", { exact: true }) });
    }
    await entrar("receptor");
    await pedirNovamente();
    await pedidoPendente()
      .getByRole("button", { name: "Cancelar solicitação", exact: true })
      .click();
    await botao("Confirmar");
    await expect(page.getByText("Cancelada", { exact: true })).toBeVisible();
    await pedirNovamente();
    await sair();
    await entrar("doadorvisual");
    await page.getByRole("tab", { name: /Solicitações/ }).click();
    await pedidoPendente()
      .getByRole("button", { name: "Recusar", exact: true })
      .click();
    await botao("Confirmar");
    await expect(page.getByText("Recusada", { exact: true })).toBeVisible();
    await page.getByRole("tab", { name: /Doações/ }).click();
    await botao("Ver solicitações");
    await expect(
      page.getByRole("button", {
        name: "Mostrar todos os pedidos",
        exact: true,
      }),
    ).toBeVisible();
    await botao("Mostrar todos os pedidos");
    await page.getByRole("tab", { name: /Doações/ }).click();
    await botao("Excluir");
    await botao("Confirmar");
    await expect(
      page.getByText(
        "Você ainda não publicou doações. Comece pelo botão acima.",
      ),
    ).toBeVisible();
    await sair();
    // O Playwright não expõe preflights automáticos como respostas de página.
    // OPTIONS é validado na suíte HTTP; aqui validamos o acesso entre origens.
    expect(respostasApi).toContain(201);
    expect(respostasApi).toContain(401);
    expect(new URL(page.url()).port).toBe("3012");
    expect(erros).toEqual([]);
    return { validadeEditada };
  } finally {
    if (browser) await browser.close();
    await new Promise((r) => http.close(r));
    await new Promise((r) => apiHttp.close(r));
  }
}
