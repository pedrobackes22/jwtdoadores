import { tokenStorage } from "./tokenStorage";
export const API_URL = (
  process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:3000/api"
).replace(/\/$/, "");
let sessaoExpirada = null;
export function configurarSessaoExpirada(callback) {
  sessaoExpirada = callback;
  return function () {
    sessaoExpirada = null;
  };
}
export async function api(
  caminho,
  { method = "GET", body, publica = false } = {},
) {
  const token = publica ? null : await tokenStorage.ler();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const resposta = await fetch(API_URL + caminho, {
      method,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: "Bearer " + token } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const dados = await resposta
      .json()
      .catch(() => ({ mensagem: "Resposta inválida. Confira a URL da API." }));
    if (resposta.status === 401 && !publica) {
      await tokenStorage.remover();
      if (sessaoExpirada) sessaoExpirada();
    }
    if (!resposta.ok)
      throw Object.assign(
        new Error(dados.mensagem || "Não foi possível concluir."),
        { status: resposta.status },
      );
    return dados;
  } catch (erro) {
    if (erro.status) throw erro;
    throw new Error(
      "Não foi possível conectar. Confira a API, o IP e a rede Wi-Fi.",
    );
  } finally {
    clearTimeout(timeout);
  }
}
