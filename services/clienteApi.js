// O cliente independe de módulos nativos para permitir testes de regressão.
export function resolverUrl(configurada, plataforma) {
  const valor = (
    configurada ||
    (plataforma === "android"
      ? "http://10.0.2.2:3000/api"
      : "http://localhost:3000/api")
  )
    .trim()
    .replace(/\/+$/, "");
  try {
    const url = new URL(valor);
    if (
      !/^https?:$/.test(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname !== "/api"
    )
      throw new Error();
    return url.href.replace(/\/$/, "");
  } catch {
    // Não registra valores inválidos, que podem conter credenciais.
    return "";
  }
}
function falha(mensagem, codigo, status) {
  return Object.assign(new Error(mensagem), {
    codigo,
    ...(status ? { status } : {}),
  });
}
export function criarCliente({
  url,
  storage,
  fetchImpl = (...args) => fetch(...args),
  timeoutMs = 15000,
  desenvolvimento = false,
}) {
  let sessaoExpirada;
  return {
    configurarSessaoExpirada(callback) {
      sessaoExpirada = callback;
      return function () {
        if (sessaoExpirada === callback) sessaoExpirada = null;
      };
    },
    async api(caminho, { method = "GET", body, publica = false } = {}) {
      if (!url)
        throw falha(
          "Endereço da API inválido. Corrija EXPO_PUBLIC_API_URL e reinicie o Expo.",
          "CONFIGURACAO",
        );
      let token;
      try {
        token = publica ? null : await storage.ler();
      } catch {
        throw falha(
          "Não foi possível acessar a sessão neste dispositivo.",
          "ARMAZENAMENTO",
        );
      }
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      let resposta;
      try {
        resposta = await fetchImpl(url + caminho, {
          method,
          signal: controller.signal,
          headers: {
            ...(body !== undefined
              ? { "Content-Type": "application/json" }
              : {}),
            ...(token ? { Authorization: "Bearer " + token } : {}),
          },
          ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
        });
        if (resposta.status === 401 && !publica) {
          try {
            await storage.remover();
          } catch {
            throw falha(
              "Não foi possível remover a sessão expirada. Tente sair novamente.",
              "ARMAZENAMENTO",
              401,
            );
          }
          sessaoExpirada?.();
        }
        let dados;
        try {
          dados = await resposta.json();
        } catch (erro) {
          if (controller.signal.aborted) throw erro;
          throw falha(
            "Resposta inválida da API. Confira o endereço configurado.",
            "RESPOSTA_INVALIDA",
            resposta.status,
          );
        }
        if (!dados || typeof dados !== "object" || Array.isArray(dados))
          throw falha(
            "Resposta inválida da API.",
            "RESPOSTA_INVALIDA",
            resposta.status,
          );
        if (!resposta.ok) {
          const mensagem =
            resposta.status >= 500
              ? "Falha interna do servidor. Tente novamente mais tarde."
              : dados.mensagem || "Não foi possível concluir a operação.";
          throw falha(mensagem, "HTTP", resposta.status);
        }
        return dados;
      } catch (erro) {
        if (desenvolvimento)
          console.warn("Requisição da API falhou", {
            origem: new URL(url).origin,
            method,
            status: resposta?.status,
            codigo:
              erro.codigo ||
              (controller.signal.aborted ? "TIMEOUT" : "REDE_OU_CORS"),
          });
        if (erro.codigo) throw erro;
        if (controller.signal.aborted)
          throw falha(
            "A API demorou para responder. Tente novamente.",
            "TIMEOUT",
          );
        // Fetch não distingue falha de rede de bloqueio CORS para o JavaScript.
        throw falha(
          "API inacessível ou conexão bloqueada pelo navegador (CORS/HTTPS). Confira se o backend está ligado e se o endereço e a rede estão corretos.",
          "REDE_OU_CORS",
        );
      } finally {
        clearTimeout(timer);
      }
    },
  };
}
