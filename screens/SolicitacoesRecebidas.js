import React from "react";
import ListaSolicitacoes from "../components/ListaSolicitacoes.js";
export default function SolicitacoesRecebidas({ route, navigation }) {
  const r = {
    ...route,
    params: {
      ...route.params,
      limparFiltro: () => navigation.setParams({ alimentoId: undefined }),
    },
  };
  return <ListaSolicitacoes doador route={r} />;
}
