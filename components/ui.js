import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
export const cores = {
  verde: "#2E7D32",
  claro: "#E8F5E9",
  fundo: "#F5F5F5",
  texto: "#263238",
  cinza: "#617166",
  laranja: "#FF9800",
};
export const estilos = StyleSheet.create({
  pagina: { flex: 1, backgroundColor: cores.fundo },
  conteudo: {
    padding: 22,
    gap: 16,
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "800",
    color: cores.texto,
    letterSpacing: -0.8,
  },
  subtitulo: { fontSize: 17, fontWeight: "700", color: cores.texto },
  texto: { fontSize: 15, lineHeight: 23, color: cores.texto },
  suave: { fontSize: 14, lineHeight: 21, color: cores.cinza },
  painel: {
    backgroundColor: "white",
    borderRadius: 22,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: "#E4EBE5",
  },
  linha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  botao: {
    backgroundColor: cores.verde,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  botaoTexto: { color: "white", fontWeight: "700", fontSize: 15 },
  campo: {
    borderWidth: 1,
    borderColor: "#D5DFD6",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: cores.texto,
    backgroundColor: "white",
    minHeight: 50,
  },
  rotulo: {
    fontSize: 13,
    fontWeight: "700",
    color: cores.texto,
    marginBottom: 7,
  },
  aviso: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#FFF3E0",
    color: "#7A4300",
    lineHeight: 22,
  },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: "white",
    borderColor: "#DDE7DE",
    borderWidth: 1,
  },
  badge: {
    color: cores.verde,
    backgroundColor: cores.claro,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: "700",
    alignSelf: "flex-start",
  },
});
export function Pagina({ children, refreshControl }) {
  return (
    <KeyboardAvoidingView
      style={estilos.pagina}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        refreshControl={refreshControl}
        contentContainerStyle={estilos.conteudo}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
export function Painel({ children }) {
  return <View style={estilos.painel}>{children}</View>;
}
export function Botao({
  titulo,
  onPress,
  loading = false,
  secundario = false,
  perigo = false,
  disabled = false,
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        estilos.botao,
        secundario && { backgroundColor: cores.claro },
        perigo && { backgroundColor: "#B3261E" },
        { opacity: disabled || loading ? 0.5 : pressed ? 0.75 : 1 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={secundario ? cores.verde : "white"} />
      ) : (
        <Text
          style={[estilos.botaoTexto, secundario && { color: cores.verde }]}
        >
          {titulo}
        </Text>
      )}
    </Pressable>
  );
}
export function CampoInput({ rotulo, senha = false, ...props }) {
  const [mostrar, setMostrar] = useState(false);
  return (
    <View>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <TextInput
        accessibilityLabel={rotulo}
        placeholderTextColor="#87948B"
        style={estilos.campo}
        secureTextEntry={senha && !mostrar}
        autoCapitalize={senha ? "none" : "sentences"}
        {...props}
      />
      {senha && (
        <Pressable
          accessibilityRole="button"
          onPress={() => setMostrar(!mostrar)}
          style={{ paddingVertical: 10 }}
        >
          <Text style={{ color: cores.verde, fontWeight: "600" }}>
            {mostrar ? "Ocultar senha" : "Mostrar senha"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
export function Aviso({ mensagem }) {
  return mensagem ? (
    <Text accessibilityRole="alert" style={estilos.aviso}>
      {mensagem}
    </Text>
  ) : null;
}
export function Carregamento() {
  return (
    <ActivityIndicator
      accessibilityLabel="Carregando"
      size="large"
      color={cores.verde}
      style={{ padding: 35 }}
    />
  );
}
export function Marca() {
  return (
    <View style={estilos.linha}>
      <View
        style={{
          backgroundColor: cores.verde,
          width: 46,
          height: 46,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 28 }}>✳</Text>
      </View>
      <Text
        style={{
          color: cores.verde,
          fontSize: 26,
          fontWeight: "800",
          letterSpacing: -1,
        }}
      >
        Alimenta+
      </Text>
    </View>
  );
}
export function Escolhas({ valores, valor, onChange }) {
  return (
    <View style={estilos.linha}>
      {valores.map((item) => (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: valor === item }}
          key={item}
          onPress={() => onChange(item)}
          style={[
            estilos.chip,
            valor === item && {
              backgroundColor: cores.claro,
              borderColor: cores.verde,
            },
          ]}
        >
          <Text
            style={{
              color: valor === item ? cores.verde : cores.cinza,
              fontWeight: "600",
            }}
          >
            {item}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
export function Confirmacao({ texto, onConfirm, onCancel, loading }) {
  return (
    <Painel>
      <Text style={estilos.texto}>{texto}</Text>
      <Botao titulo="Confirmar" loading={loading} onPress={onConfirm} />
      <Botao titulo="Voltar" secundario disabled={loading} onPress={onCancel} />
    </Painel>
  );
}
export function dataBR(data) {
  return data ? data.slice(0, 10).split("-").reverse().join("/") : "—";
}
