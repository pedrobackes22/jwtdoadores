import * as SecureStore from "expo-secure-store";
const CHAVE = "alimenta-token";
export const tokenStorage = {
  ler: function () {
    return SecureStore.getItemAsync(CHAVE);
  },
  salvar: function (token) {
    return SecureStore.setItemAsync(CHAVE, token);
  },
  remover: function () {
    return SecureStore.deleteItemAsync(CHAVE);
  },
};
