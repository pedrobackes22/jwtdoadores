// SecureStore é nativo. No navegador a sessão fica apenas na memória desta aba.
let tokenMemoria = null;
export const tokenStorage = {
  ler: async function () {
    return tokenMemoria;
  },
  salvar: async function (token) {
    tokenMemoria = token;
  },
  remover: async function () {
    tokenMemoria = null;
  },
};
