import { test } from "node:test";
import assert from "node:assert/strict";
import { criarCliente, resolverUrl } from "../services/clienteApi.js";

test("URL por plataforma: Web usa localhost; Markdown, credenciais e caminho incorreto são rejeitados", () => {
  assert.equal(resolverUrl(undefined, "web"), "http://localhost:3000/api");
  assert.equal(resolverUrl(undefined, "android"), "http://10.0.2.2:3000/api");
  assert.equal(
    resolverUrl(" http://localhost:3000/api/ ", "web"),
    "http://localhost:3000/api",
  );
  for (const valor of [
    "[http://localhost:3000/api](http://localhost:3000/api)",
    "http://localhost:3000",
    "http://user:secret@localhost:3000/api",
    "ftp://localhost/api",
  ])
    assert.equal(resolverUrl(valor, "web"), "");
});

function cliente(fetchImpl, opcoes = {}) {
  let removido = false;
  const storage = {
    ler: async () => "token-de-teste",
    remover: async () => {
      removido = true;
    },
  };
  return {
    ...criarCliente({
      url: "http://localhost:3000/api",
      storage,
      fetchImpl,
      ...opcoes,
    }),
    removido: () => removido,
  };
}
const resposta = (status, dados) =>
  new Response(JSON.stringify(dados), { status });

test("cadastro/login públicos enviam JSON sem Bearer; consultas protegidas enviam token", async () => {
  const c = cliente(async (url, opcoes) => {
    assert.equal(url, "http://localhost:3000/api/auth/login");
    assert.equal(opcoes.headers.Authorization, undefined);
    assert.equal(opcoes.headers["Content-Type"], "application/json");
    assert.equal(JSON.parse(opcoes.body).email, "teste@example.com");
    return resposta(200, { token: "novo" });
  });
  assert.equal(
    (
      await c.api("/auth/login", {
        publica: true,
        method: "POST",
        body: { email: "teste@example.com" },
      })
    ).token,
    "novo",
  );
  await cliente(async (url, opcoes) => {
    assert.equal(opcoes.headers.Authorization, "Bearer token-de-teste");
    return resposta(200, { dados: [] });
  }).api("/alimentos");
});

test("HTTP preserva validação, credenciais e conflito; erro interno não vaza detalhes", async () => {
  for (const [status, mensagem] of [
    [400, "Dados inválidos."],
    [401, "E-mail ou senha incorretos."],
    [409, "E-mail já cadastrado."],
  ]) {
    const c = cliente(async () => resposta(status, { mensagem }));
    await assert.rejects(c.api("/auth/login", { publica: true }), {
      status,
      message: mensagem,
    });
    assert.equal(c.removido(), false);
  }
  await assert.rejects(
    cliente(async () => resposta(500, { mensagem: "SQL segredo" })).api(
      "/alimentos",
    ),
    {
      status: 500,
      message: "Falha interna do servidor. Tente novamente mais tarde.",
    },
  );
});

test("401 protegido encerra sessão; falha de rede preserva sessão", async () => {
  const c = cliente(async () =>
    resposta(401, { mensagem: "Sessão expirada." }),
  );
  let avisou = false;
  c.configurarSessaoExpirada(() => {
    avisou = true;
  });
  await assert.rejects(c.api("/auth/me"), { status: 401 });
  assert.ok(c.removido() && avisou);
  const offline = cliente(async () => {
    throw new TypeError("Failed to fetch");
  });
  await assert.rejects(offline.api("/alimentos"), { codigo: "REDE_OU_CORS" });
  assert.equal(offline.removido(), false);
});

test("timeout, resposta inválida e URL inválida têm diagnósticos próprios", async () => {
  const lento = cliente(
    (url, { signal }) =>
      new Promise((resolve, reject) => {
        signal.addEventListener("abort", () => reject(new Error("abort")), {
          once: true,
        });
      }),
    { timeoutMs: 5 },
  );
  await assert.rejects(lento.api("/alimentos"), { codigo: "TIMEOUT" });
  await assert.rejects(
    cliente(async () => new Response("<html>404</html>")).api("/alimentos"),
    { codigo: "RESPOSTA_INVALIDA" },
  );
  await assert.rejects(
    cliente(() => assert.fail("não deveria chamar fetch"), { url: "" }).api(
      "/auth/login",
    ),
    { codigo: "CONFIGURACAO" },
  );
});
