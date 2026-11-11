import React, { useState } from "react";
import { Modal, View, Text, Pressable } from "react-native";
import { Botao, estilos, cores } from "./ui.js";
import { hojeLocal, dataReal, dataBrasileira } from "../shared/datas.js";

const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
// Componentes React Native em ambas as plataformas: calendário sem módulo nativo.
export default function SeletorData({ valor, onChange }) {
  const [aberto, setAberto] = useState(false);
  const [mes, setMes] = useState(() => hojeLocal().slice(0, 7));
  const hoje = hojeLocal();
  const [ano, numeroMes] = mes.split("-").map(Number);
  const inicio = new Date(ano, numeroMes - 1, 1, 12).getDay();
  const total = new Date(ano, numeroMes, 0, 12).getDate();
  function mover(delta) {
    const data = new Date(ano, numeroMes - 1 + delta, 1, 12);
    setMes(
      `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`,
    );
  }
  function escolher(iso) {
    onChange(iso);
    setAberto(false);
  }
  return (
    <View>
      <Text style={estilos.rotulo}>Validade *</Text>
      <Botao
        secundario
        titulo={
          valor ? `Validade: ${dataBrasileira(valor)}` : "Selecionar validade"
        }
        onPress={() => {
          setMes((dataReal(valor) ? valor : hojeLocal()).slice(0, 7));
          setAberto(true);
        }}
      />
      <Text style={estilos.suave}>
        DD/MM/AAAA · Pode vencer hoje. Horário de Brasília.
      </Text>
      <Modal
        visible={aberto}
        transparent
        animationType="fade"
        onRequestClose={() => setAberto(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.4)",
            padding: 20,
          }}
        >
          <View
            accessibilityViewIsModal
            style={[estilos.painel, { width: "100%", maxWidth: 380 }]}
          >
            <Text style={estilos.subtitulo}>Escolher validade</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Botao
                titulo="‹"
                onPress={() => mover(-1)}
                disabled={mes <= hoje.slice(0, 7)}
              />
              <Text accessibilityLiveRegion="polite" style={estilos.texto}>
                {meses[numeroMes - 1]} de {ano}
              </Text>
              <Botao titulo="›" onPress={() => mover(1)} />
            </View>
            <View style={{ flexDirection: "row" }}>
              {["D", "S", "T", "Q", "Q", "S", "S"].map((dia, i) => (
                <Text
                  key={i}
                  style={{ width: `${100 / 7}%`, textAlign: "center" }}
                >
                  {dia}
                </Text>
              ))}
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {Array.from({ length: inicio + total }, (_, i) => {
                const dia = i - inicio + 1;
                if (dia < 1)
                  return <View key={i} style={{ width: `${100 / 7}%` }} />;
                const iso = `${mes}-${String(dia).padStart(2, "0")}`;
                const vencida = iso < hoje;
                return (
                  <Pressable
                    key={i}
                    accessibilityRole="button"
                    accessibilityLabel={dataBrasileira(iso)}
                    accessibilityState={{
                      disabled: vencida,
                      selected: iso === valor,
                    }}
                    disabled={vencida}
                    onPress={() => escolher(iso)}
                    style={{
                      width: `${100 / 7}%`,
                      minHeight: 44,
                      justifyContent: "center",
                      borderRadius: 8,
                      backgroundColor: iso === valor ? cores.claro : "white",
                      opacity: vencida ? 0.3 : 1,
                    }}
                  >
                    <Text style={{ textAlign: "center", color: cores.texto }}>
                      {dia}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Botao titulo="Hoje" onPress={() => escolher(hojeLocal())} />
            <Botao
              titulo="Fechar calendário"
              secundario
              onPress={() => setAberto(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
