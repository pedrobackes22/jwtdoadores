import React, { useState } from "react";
import { Text, RefreshControl } from "react-native";
import { useLista } from "../hooks/useLista.js";
import { api } from "../services/api.js";
import AlimentoCard from "../components/AlimentoCard.js";
import {
  Pagina,
  Botao,
  Aviso,
  Carregamento,
  Confirmacao,
  estilos,
} from "../components/ui.js";
export default function MinhasDoacoes({ navigation }) {
  const lista = useLista("/alimentos/meus"),
    [excluir, setExcluir] = useState(null),
    [mensagem, setMensagem] = useState(""),
    [loading, setLoading] = useState(false);
  async function confirmar() {
    setLoading(true);
    try {
      const r = await api("/alimentos/" + excluir, { method: "DELETE" });
      setMensagem(r.mensagem);
      setExcluir(null);
      await lista.carregar();
    } catch (e) {
      setMensagem(e.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Pagina
      refreshControl={
        <RefreshControl refreshing={lista.loading} onRefresh={lista.carregar} />
      }
    >
      <Text style={estilos.titulo}>Minhas doações</Text>
      <Text style={estilos.suave}>
        Cada oferta é uma oportunidade de ajudar.
      </Text>
      <Botao
        titulo="Cadastrar alimento"
        onPress={() => navigation.navigate("CadastrarAlimento")}
      />
      <Aviso mensagem={mensagem || lista.erro} />
      {excluir && (
        <Confirmacao
          texto="Excluir esta oferta? Pedidos pendentes serão recusados e o histórico será mantido."
          loading={loading}
          onConfirm={confirmar}
          onCancel={() => setExcluir(null)}
        />
      )}
      {lista.loading && <Carregamento />}
      {lista.dados.map((a) => (
        <AlimentoCard
          key={a.id}
          alimento={a}
          onDetalhes={() =>
            navigation.navigate("DetalhesAlimento", { id: a.id })
          }
        >
          <Text style={estilos.suave}>
            Total: {a.quantidade} · Reservado: {a.reservada} · Entregue:{" "}
            {a.entregue}
          </Text>
          <Botao
            titulo="Editar"
            onPress={() => navigation.navigate("EditarAlimento", { id: a.id })}
          />
          <Botao
            titulo="Ver solicitações"
            secundario
            onPress={() =>
              navigation.navigate("Solicitações", { alimentoId: a.id })
            }
          />
          <Botao titulo="Excluir" perigo onPress={() => setExcluir(a.id)} />
        </AlimentoCard>
      ))}
      {!lista.loading && !lista.dados.length && (
        <Text style={estilos.suave}>
          Você ainda não publicou doações. Comece pelo botão acima.
        </Text>
      )}
    </Pagina>
  );
}
