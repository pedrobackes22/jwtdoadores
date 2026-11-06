import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { api } from "../services/api.js";
import { CATEGORIAS } from "../shared/constants.js";
import {
  Pagina,
  Painel,
  CampoInput,
  Botao,
  Aviso,
  Escolhas,
  Carregamento,
  estilos,
} from "./ui.js";
const vazio = {
  nome: "",
  descricao: "",
  categoria: "Frutas",
  quantidade: "",
  unidade: "kg",
  data_validade: "",
  cidade: "",
  bairro: "",
  endereco_retirada: "",
  informacoes_adicionais: "",
  imagem_url: "",
};
export default function FormularioAlimento({ id, navigation }) {
  const [form, setForm] = useState(vazio),
    [erro, setErro] = useState(""),
    [loading, setLoading] = useState(false),
    [carregando, setCarregando] = useState(Boolean(id)),
    [sucesso, setSucesso] = useState(false);
  useEffect(
    function () {
      if (id)
        api("/alimentos/" + id)
          .then((r) =>
            setForm(
              Object.fromEntries(
                Object.keys(vazio).map((k) => [k, String(r.dados[k] ?? "")]),
              ),
            ),
          )
          .catch((e) => setErro(e.message))
          .finally(() => setCarregando(false));
    },
    [id],
  );
  function mudar(k, v) {
    setForm({ ...form, [k]: v });
  }
  async function salvar() {
    setErro("");
    for (const campo of [
      "nome",
      "quantidade",
      "unidade",
      "data_validade",
      "cidade",
      "bairro",
      "endereco_retirada",
    ])
      if (!form[campo].trim())
        return setErro("Preencha todos os campos obrigatórios.");
    setLoading(true);
    try {
      await api("/alimentos" + (id ? "/" + id : ""), {
        method: id ? "PUT" : "POST",
        body: { ...form, quantidade: form.quantidade.replace(",", ".") },
      });
      setSucesso(true);
    } catch (e) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }
  if (carregando) return <Carregamento />;
  return (
    <Pagina>
      <Text style={estilos.titulo}>
        {id ? "Atualize sua doação" : "Compartilhe o que faz bem"}
      </Text>
      <Text style={estilos.suave}>
        Publique apenas alimentos próprios para consumo. Campos com * são
        obrigatórios.
      </Text>
      <Aviso mensagem={erro} />
      {sucesso ? (
        <Painel>
          <Text style={estilos.subtitulo}>
            {id ? "Alterações salvas!" : "Doação publicada!"}
          </Text>
          <Text style={estilos.texto}>
            O catálogo já pode consultar as informações atualizadas.
          </Text>
          <Botao titulo="Concluir" onPress={() => navigation.goBack()} />
        </Painel>
      ) : (
        <Painel>
          <CampoInput
            rotulo="Nome do alimento *"
            value={form.nome}
            onChangeText={(v) => mudar("nome", v)}
          />
          <CampoInput
            rotulo="Descrição"
            multiline
            value={form.descricao}
            onChangeText={(v) => mudar("descricao", v)}
          />
          <Text style={estilos.rotulo}>Categoria *</Text>
          <Escolhas
            valores={CATEGORIAS}
            valor={form.categoria}
            onChange={(v) => mudar("categoria", v)}
          />
          {[
            ["quantidade", "Quantidade total *"],
            ["unidade", "Unidade (kg, unidades, litros...) *"],
            ["data_validade", "Validade (AAAA-MM-DD) *"],
            ["cidade", "Cidade *"],
            ["bairro", "Bairro *"],
            ["endereco_retirada", "Endereço completo de retirada *"],
            ["informacoes_adicionais", "Informações adicionais"],
            ["imagem_url", "URL HTTPS da foto (opcional)"],
          ].map(([k, r]) => (
            <CampoInput
              key={k}
              rotulo={r}
              value={form[k]}
              onChangeText={(v) => mudar(k, v)}
              keyboardType={k === "quantidade" ? "decimal-pad" : "default"}
              autoCapitalize={k === "imagem_url" ? "none" : "sentences"}
            />
          ))}
          <Text style={estilos.suave}>
            Foto opcional por link público HTTPS, salvo no banco. Não é feito
            upload do celular. O endereço será liberado ao receptor após
            aprovação.
          </Text>
          <Botao
            titulo={id ? "Salvar alterações" : "Publicar doação"}
            loading={loading}
            onPress={salvar}
          />
        </Painel>
      )}
    </Pagina>
  );
}
