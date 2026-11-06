import React, { useState } from "react";
import { View, Text, Image } from "react-native";
import { Painel, Botao, estilos, cores, dataBR } from "./ui.js";
export default function AlimentoCard({ alimento, onDetalhes, children }) {
  const [falhou, setFalhou] = useState(false);
  const disponivel =
    Number(alimento.disponivel) > 0 &&
    alimento.status === "ATIVO" &&
    alimento.data_validade >= new Date().toLocaleDateString("en-CA");
  return (
    <Painel>
      {alimento.imagem_url && !falhou ? (
        <Image
          source={{ uri: alimento.imagem_url }}
          onError={() => setFalhou(true)}
          accessibilityLabel={alimento.nome}
          style={{ height: 160, borderRadius: 14, width: "100%" }}
        />
      ) : (
        <View
          style={{
            backgroundColor: cores.claro,
            height: 110,
            borderRadius: 14,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 40 }}>♧</Text>
          <Text style={{ color: cores.verde }}>{alimento.categoria}</Text>
        </View>
      )}
      <View style={estilos.linha}>
        <Text style={estilos.badge}>
          {disponivel ? "Disponível" : "Indisponível"}
        </Text>
        <Text style={estilos.suave}>{alimento.categoria}</Text>
      </View>
      <Text style={estilos.subtitulo}>{alimento.nome}</Text>
      <Text style={estilos.texto}>
        {Number(alimento.disponivel)} {alimento.unidade} disponíveis
      </Text>
      <Text style={estilos.suave}>
        Validade: {dataBR(alimento.data_validade)} · {alimento.bairro},{" "}
        {alimento.cidade}
      </Text>
      <Botao titulo="Ver detalhes" secundario onPress={onDetalhes} />
      {children}
    </Painel>
  );
}
