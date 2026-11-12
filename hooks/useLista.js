import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../services/api.js";
export function useLista(caminho) {
  const ativa = useRef(false),
    sequencia = useRef(0);
  const [dados, setDados] = useState([]),
    [loading, setLoading] = useState(true),
    [erro, setErro] = useState("");
  const carregar = useCallback(
    async function () {
      if (!ativa.current) return;
      const requisicao = ++sequencia.current;
      const atual = () => ativa.current && requisicao === sequencia.current;
      setLoading(true);
      setErro("");
      try {
        const resposta = await api(caminho);
        if (atual()) setDados(resposta.dados);
      } catch (e) {
        if (atual()) setErro(e.message);
      } finally {
        if (atual()) setLoading(false);
      }
    },
    [caminho],
  );
  useFocusEffect(
    useCallback(
      function () {
        ativa.current = true;
        carregar();
        const timer = setInterval(carregar, 30000);
        return () => {
          ativa.current = false;
          sequencia.current++;
          clearInterval(timer);
        };
      },
      [carregar],
    ),
  );
  return { dados, loading, erro, carregar };
}
