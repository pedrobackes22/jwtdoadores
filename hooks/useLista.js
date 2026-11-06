import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../services/api.js";
export function useLista(caminho) {
  const [dados, setDados] = useState([]),
    [loading, setLoading] = useState(true),
    [erro, setErro] = useState("");
  const carregar = useCallback(
    async function () {
      setLoading(true);
      setErro("");
      try {
        setDados((await api(caminho)).dados);
      } catch (e) {
        setErro(e.message);
      } finally {
        setLoading(false);
      }
    },
    [caminho],
  );
  useFocusEffect(
    useCallback(
      function () {
        carregar();
        const timer = setInterval(carregar, 30000);
        return () => clearInterval(timer);
      },
      [carregar],
    ),
  );
  return { dados, loading, erro, carregar };
}
