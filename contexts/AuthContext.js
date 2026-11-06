import React, { createContext, useContext, useEffect, useState } from "react";
import { api, configurarSessaoExpirada } from "../services/api.js";
import { tokenStorage } from "../services/tokenStorage";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null),
    [carregando, setCarregando] = useState(true),
    [erro, setErro] = useState("");
  async function restaurar() {
    setCarregando(true);
    setErro("");
    try {
      if (await tokenStorage.ler()) setUsuario((await api("/auth/me")).dados);
    } catch (e) {
      if (e.status !== 401) setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }
  useEffect(function () {
    const limpar = configurarSessaoExpirada(function () {
      setUsuario(null);
    });
    // Adia o início para o ciclo assíncrono de leitura do armazenamento.
    Promise.resolve().then(restaurar);
    return limpar;
  }, []);
  async function entrar(email, senha) {
    const dados = await api("/auth/login", {
      method: "POST",
      body: { email, senha },
      publica: true,
    });
    await tokenStorage.salvar(dados.token);
    setUsuario(dados.usuario);
  }
  async function sair() {
    await tokenStorage.remover();
    setUsuario(null);
    setErro("");
  }
  return (
    <AuthContext.Provider
      value={{ usuario, carregando, erro, entrar, sair, restaurar }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}
