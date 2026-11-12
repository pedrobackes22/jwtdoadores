import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { api } from "../services/api.js";
import { CATEGORIAS, UNIDADES } from "../shared/constants.js";
import { dataReal, hojeLocal } from "../shared/datas.js";
import SeletorData from "./SeletorData.js";
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
    [carregado, setCarregado] = useState(!id),
    [tentativa, setTentativa] = useState(0),
    [sucesso, setSucesso] = useState(false);
  useEffect(
    function () {
      let ativo = true;
      if (id) {
        api("/alimentos/" + id)
          .then((r) => {
            if (!ativo) return;
            setForm(
              Object.fromEntries(
                Object.keys(vazio).map((k) => [k, String(r.dados[k] ?? "")]),
              ),
            );
            setCarregado(true);
          })
          .catch((e) => {
            if (ativo) setErro(e.message);
          })
          .finally(() => {
            if (ativo) setCarregando(false);
          });
      }
      return () => {
        ativo = false;
      };
    },
    [id, tentativa],
  );
  function mudar(k, v) {
    setForm({ ...form, [k]: v });
  }
  function tentarNovamente() {
    setCarregando(true);
    setCarregado(false);
    setErro("");
    setTentativa((valor) => valor + 1);
  }
  async function salvar() {
    if (id && !carregado) return;
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
    const quantidade = form.quantidade.replace(",", ".");
    if (
      !/^\d+(\.\d{1,3})?$/.test(quantidade) ||
      Number(quantidade) <= 0 ||
      Number(quantidade) > 9999999.999
    )
      return setErro(
        "Informe uma quantidade maior que zero, com até 3 casas decimais.",
      );
    if (!UNIDADES.includes(form.unidade))
      return setErro("Selecione uma unidade válida.");
    if (!dataReal(form.data_validade) || form.data_validade < hojeLocal())
      return setErro(
        "Selecione uma validade real, hoje ou futura, no calendário.",
      );
    setLoading(true);
    try {
      await api("/alimentos" + (id ? "/" + id : ""), {
        method: id ? "PUT" : "POST",
        body: { ...form, quantidade },
      });
      setSucesso(true);
    } catch (e) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }
  if (carregando) return <Carregamento />;
  if (id && !carregado)
    return (
      <Pagina>
        <Aviso
          mensagem={erro || "Não foi possível carregar a oferta para edição."}
        />
        <Botao titulo="Tentar carregar novamente" onPress={tentarNovamente} />
        <Botao titulo="Voltar" secundario onPress={() => navigation.goBack()} />
      </Pagina>
    );
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
          <Text style={estilos.rotulo}>Unidade *</Text>
          <Escolhas
            valores={UNIDADES}
            valor={form.unidade}
            onChange={(v) => mudar("unidade", v)}
          />
          {form.unidade && !UNIDADES.includes(form.unidade) && (
            <Text style={estilos.suave}>
              Unidade anterior: {form.unidade}. Selecione uma das opções para
              salvar.
            </Text>
          )}
          <SeletorData
            valor={form.data_validade}
            onChange={(v) => mudar("data_validade", v)}
          />
          {[
            ["quantidade", "Quantidade total *"],
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
