export function validarApiDispositivo(valor, { publica = false } = {}) {
  let url;
  try {
    url = new URL(valor);
  } catch {
    throw new Error(
      "Defina EXPO_PUBLIC_API_URL com a URL real da API, terminando em /api.",
    );
  }
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (
    !/^https?:$/.test(url.protocol) ||
    url.pathname.replace(/\/$/, "") !== "/api" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  )
    throw new Error(
      "A URL da API deve usar HTTP/HTTPS e /api, sem credenciais, query ou fragmento.",
    );
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host === "localhost.localdomain" ||
    /^127\./.test(host) ||
    ["0.0.0.0", "::", "::1", "10.0.2.2", "10.0.2.3", "10.0.3.2"].includes(
      host,
    ) ||
    /(^|\.)(example\.(com|org|net)|invalid|test)$/.test(host)
  )
    throw new Error(
      "APK para celular físico exige API acessível pelo aparelho. Não use localhost, loopback, IP de emulador ou domínio de exemplo.",
    );
  if (
    publica &&
    (url.protocol !== "https:" ||
      /^(10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host) ||
      /^(?:(?:fc|fd)[0-9a-f]{2}:|fe80:)/i.test(host))
  )
    throw new Error(
      "O APK final exige uma API pública HTTPS; endereços privados não funcionam entre redes diferentes.",
    );
  return url.href.replace(/\/$/, "");
}
