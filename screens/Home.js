import React, { useEffect, useState } from "react";
import { Text, RefreshControl, View } from "react-native";
import { useAuth } from "../contexts/AuthContext.js";
import { useLista } from "../hooks/useLista.js";
import { CATEGORIAS } from "../shared/constants.js";
import AlimentoCard from "../components/AlimentoCard.js";
import {
  Pagina,
  Marca,
  CampoInput,
  Escolhas,
  Aviso,
  Carregamento,
  Botao,
  estilos,
  cores,
} from "../components/ui.js";
export default function Home({ navigation }) {
  const { usuario } = useAuth();
  const [busca, setBusca] = useState(""),
    [termo, setTermo] = useState(""),
    [categoria, setCategoria] = useState("Todas");
  useEffect(
    function () {
      const t = setTimeout(() => setTermo(busca), 350);
      return () => clearTimeout(t);
    },
    [busca],
  );
  const lista = useLista(
    "/alimentos?busca=" +
      encodeURIComponent(termo) +
      (categoria === "Todas"
        ? ""
        : "&categoria=" + encodeURIComponent(categoria)),
  );
  return (
    <Pagina
      refreshControl={
        <RefreshControl refreshing={lista.loading} onRefresh={lista.carregar} />
      }
    >
      <Marca />
      <Text style={estilos.suave}>Olá, {usuario.nome.split(" ")[0]} ☀</Text>
      <View
        style={{
          backgroundColor: cores.claro,
          padding: 22,
          borderRadius: 22,
          gap: 9,
        }}
      >
        <Text style={estilos.titulo}>
          Alimento bom é{"\n"}alimento compartilhado.
        </Text>
        <Text style={estilos.texto}>
          Encontre doações e ajude a construir uma comunidade com menos
          desperdício.
        </Text>
      </View>
      <CampoInput
        rotulo="O que você procura?"
        placeholder="Busque alimento ou cidade"
        value={busca}
        onChangeText={setBusca}
      />
      <Escolhas
        valores={["Todas", ...CATEGORIAS]}
        valor={categoria}
        onChange={setCategoria}
      />
      <Text style={estilos.subtitulo}>Disponíveis para doar</Text>
      <Aviso mensagem={lista.erro} />
      {lista.erro && (
        <Botao titulo="Tentar novamente" onPress={lista.carregar} />
      )}
      {lista.loading && lista.dados.length === 0 ? (
        <Carregamento />
      ) : (
        lista.dados.map((a) => (
          <AlimentoCard
            key={a.id}
            alimento={a}
            onDetalhes={() =>
              navigation.navigate("DetalhesAlimento", { id: a.id })
            }
          />
        ))
      )}
      {!lista.loading && !lista.erro && lista.dados.length === 0 && (
        <Text style={estilos.suave}>
          Nenhuma oferta por aqui ainda. Tente outra busca ou volte em breve.
        </Text>
      )}
      <Text style={estilos.suave}>
        Atualização automática a cada 30 segundos. Puxe para atualizar.
      </Text>
    </Pagina>
  );
}
