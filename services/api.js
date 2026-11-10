import { Platform } from "react-native";
import { tokenStorage } from "./tokenStorage";
import { criarCliente, resolverUrl } from "./clienteApi.js";

export const API_URL = resolverUrl(
  process.env.EXPO_PUBLIC_API_URL,
  Platform.OS,
);
const cliente = criarCliente({
  url: API_URL,
  storage: tokenStorage,
  desenvolvimento: typeof __DEV__ !== "undefined" && __DEV__,
});
export const api = cliente.api;
export const configurarSessaoExpirada = cliente.configurarSessaoExpirada;
