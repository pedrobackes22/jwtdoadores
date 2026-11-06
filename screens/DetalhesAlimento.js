import React, { useCallback, useState } from "react";
import { Text, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../services/api.js";
import { useAuth } from "../contexts/AuthContext.js";
import {
  Pagina,
  Painel,
  CampoInput,
  Botao,
  Aviso,
  Confirmacao,
  Carregamento,
  estilos,
  dataBR,
} from "../components/ui.js";
export default function DetalhesAlimento({ route, navigation }) {
  const { usuario } = useAuth(),
    id = route.params.id;
  const [a, setA] = useState(null),
    [erro, setErro] = useState(""),
    [pedido, setPedido] = useState("1"),
    [confirmar, setConfirmar] = useState(false),
    [loading, setLoading] = useState(false),
    [sucesso, setSucesso] = useState("");
  const carregar = useCallback(
    async function () {
      try {
        setA((await api("/alimentos/" + id)).dados);
      } catch (e) {
        setErro(e.message);
      }
    },
    [id],
  );
  useFocusEffect(
    useCallback(
      function () {
        carregar();
      },
      [carregar],
    ),
  );
  async function solicitar() {
    setLoading(true);
    setErro("");
    try {
      await api("/solicitacoes", {
        method: "POST",
        body: {
          alimento_id: id,
          quantidade_solicitada: pedido.replace(",", "."),
        },
      });
      setConfirmar(false);
      setSucesso(
        "Solicitação enviada! Acompanhe o pedido na aba Solicitações.",
      );
    } catch (e) {
      setErro(e.message);
      setConfirmar(false);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Pagina>
      <Botao
        titulo="Voltar ao catálogo"
        secundario
        onPress={() => navigation.goBack()}
      />
      <Aviso mensagem={erro} />
      {!a ? (
        <>
          <Carregamento />
          <Botao titulo="Tentar novamente" onPress={carregar} />
        </>
      ) : (
        <>
          {a.imagem_url && (
            <Image
              source={{ uri: a.imagem_url }}
              style={{ width: "100%", height: 210, borderRadius: 20 }}
            />
          )}
          <Text style={estilos.badge}>{a.categoria}</Text>
          <Text style={estilos.titulo}>{a.nome}</Text>
          <Text style={estilos.texto}>
            {a.descricao || "Sem descrição adicional."}
          </Text>
          <Painel>
            <Text style={estilos.subtitulo}>Informações da doação</Text>
            {[
              ["Disponível", a.disponivel + " " + a.unidade],
              ["Total publicado", a.quantidade + " " + a.unidade],
              ["Reservado", a.reservada + " " + a.unidade],
              ["Entregue", a.entregue + " " + a.unidade],
              ["Validade", dataBR(a.data_validade)],
              ["Publicado em", dataBR(a.created_at)],
              ["Doador", a.doador_nome],
              ["Retirada", a.bairro + ", " + a.cidade],
              [
                "Endereço",
                a.endereco_retirada ||
                  "Liberado após a aprovação da solicitação.",
              ],
              ["Observações", a.informacoes_adicionais || "Nenhuma."],
              [
                "Status",
                a.status === "EXCLUIDO"
                  ? "Excluído"
                  : Number(a.disponivel) <= 0
                    ? "Sem disponibilidade"
                    : "Validade até " + dataBR(a.data_validade),
              ],
            ].map(([r, v]) => (
              <Text key={r} style={estilos.texto}>
                <Text style={{ fontWeight: "700" }}>{r}: </Text>
                {v}
              </Text>
            ))}
          </Painel>
          {usuario.tipo_usuario === "DOADOR" && usuario.id === a.doador_id && (
            <Botao
              titulo="Editar alimento"
              onPress={() => navigation.navigate("EditarAlimento", { id })}
            />
          )}
          <Aviso mensagem={sucesso} />
          {usuario.tipo_usuario === "RECEPTOR" &&
            !sucesso &&
            Number(a.disponivel) > 0 && (
              <Painel>
                <CampoInput
                  rotulo={"Quantidade solicitada (" + a.unidade + ")"}
                  keyboardType="decimal-pad"
                  value={pedido}
                  onChangeText={setPedido}
                />
                {confirmar ? (
                  <Confirmacao
                    texto={
                      "Enviar pedido de " +
                      pedido +
                      " " +
                      a.unidade +
                      " ao doador?"
                    }
                    loading={loading}
                    onConfirm={solicitar}
                    onCancel={() => setConfirmar(false)}
                  />
                ) : (
                  <Botao
                    titulo="Solicitar doação"
                    onPress={() => setConfirmar(true)}
                  />
                )}
              </Painel>
            )}
        </>
      )}
    </Pagina>
  );
}
