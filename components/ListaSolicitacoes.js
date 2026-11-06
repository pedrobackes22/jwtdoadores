import React, { useState } from "react";
import { Text, RefreshControl } from "react-native";
import { useLista } from "../hooks/useLista.js";
import { api } from "../services/api.js";
import {
  Pagina,
  Painel,
  Botao,
  Aviso,
  Carregamento,
  Confirmacao,
  estilos,
  dataBR,
} from "./ui.js";
const rotulos = {
  PENDENTE: "Pendente",
  APROVADA: "Aprovada",
  RECUSADA: "Recusada",
  CANCELADA: "Cancelada",
  ENTREGUE: "Entregue",
};
export default function ListaSolicitacoes({ doador = false, route }) {
  const lista = useLista("/solicitacoes/" + (doador ? "recebidas" : "minhas")),
    [acao, setAcao] = useState(null),
    [mensagem, setMensagem] = useState(""),
    [loading, setLoading] = useState(false);
  async function executar() {
    setLoading(true);
    try {
      const r = await api("/solicitacoes/" + acao.id + "/" + acao.nome, {
        method: "PATCH",
      });
      setMensagem(r.mensagem);
      setAcao(null);
      await lista.carregar();
    } catch (e) {
      setMensagem(e.message);
      setAcao(null);
    } finally {
      setLoading(false);
    }
  }
  const filtro = route?.params?.alimentoId;
  const dados = lista.dados.filter((s) => !filtro || s.alimento_id === filtro);
  return (
    <Pagina
      refreshControl={
        <RefreshControl refreshing={lista.loading} onRefresh={lista.carregar} />
      }
    >
      <Text style={estilos.titulo}>
        {doador ? "Pedidos que fazem a diferença" : "Minhas solicitações"}
      </Text>
      <Text style={estilos.suave}>
        {doador
          ? "Organize as retiradas e acompanhe cada entrega."
          : "Acompanhe a resposta do doador e combine sua retirada."}
      </Text>
      {filtro && (
        <Botao
          titulo="Mostrar todos os pedidos"
          secundario
          onPress={() => route.params.limparFiltro?.()}
        />
      )}
      <Aviso mensagem={mensagem || lista.erro} />
      {acao && (
        <Confirmacao
          texto={"Deseja " + acao.nome + " esta solicitação?"}
          loading={loading}
          onConfirm={executar}
          onCancel={() => setAcao(null)}
        />
      )}
      {lista.loading && <Carregamento />}
      {dados.map((s) => (
        <Painel key={s.id}>
          <Text style={estilos.badge}>{rotulos[s.status]}</Text>
          <Text style={estilos.subtitulo}>{s.alimento_nome}</Text>
          <Text style={estilos.texto}>
            {s.quantidade_solicitada} {s.unidade} ·{" "}
            {doador ? s.receptor_nome : s.doador_nome}
          </Text>
          <Text style={estilos.suave}>
            Solicitado em {dataBR(s.created_at)} · Validade{" "}
            {dataBR(s.data_validade)}
          </Text>
          <Text style={estilos.suave}>
            {s.bairro}, {s.cidade}
          </Text>
          {s.endereco_retirada && (
            <Text style={estilos.texto}>Retirada: {s.endereco_retirada}</Text>
          )}
          {doador && s.status === "PENDENTE" && (
            <Botao
              titulo="Aprovar"
              onPress={() => setAcao({ id: s.id, nome: "aprovar" })}
            />
          )}
          {doador && ["PENDENTE", "APROVADA"].includes(s.status) && (
            <Botao
              titulo="Recusar"
              secundario
              onPress={() => setAcao({ id: s.id, nome: "recusar" })}
            />
          )}
          {doador && s.status === "APROVADA" && (
            <Botao
              titulo="Marcar como entregue"
              onPress={() => setAcao({ id: s.id, nome: "entregar" })}
            />
          )}
          {!doador && s.status === "PENDENTE" && (
            <Botao
              titulo="Cancelar solicitação"
              secundario
              onPress={() => setAcao({ id: s.id, nome: "cancelar" })}
            />
          )}
        </Painel>
      ))}
      {!lista.loading && !dados.length && (
        <Text style={estilos.suave}>Nenhuma solicitação por enquanto.</Text>
      )}
    </Pagina>
  );
}
