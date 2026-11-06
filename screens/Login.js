import React, { useState } from "react";
import { Text, View } from "react-native";
import { useAuth } from "../contexts/AuthContext.js";
import {
  Pagina,
  Painel,
  Marca,
  CampoInput,
  Botao,
  Aviso,
  estilos,
  cores,
} from "../components/ui.js";
export default function Login({ navigation }) {
  const { entrar } = useAuth();
  const [email, setEmail] = useState(""),
    [senha, setSenha] = useState(""),
    [erro, setErro] = useState(""),
    [loading, setLoading] = useState(false);
  async function enviar() {
    setErro("");
    if (!email.trim() || !senha) return setErro("Preencha e-mail e senha.");
    setLoading(true);
    try {
      await entrar(email.trim(), senha);
    } catch (e) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Pagina>
      <View style={{ paddingVertical: 20 }}>
        <Marca />
      </View>
      <View
        style={{
          backgroundColor: cores.claro,
          padding: 26,
          borderRadius: 26,
          gap: 14,
        }}
      >
        <Text style={{ fontSize: 45 }}>♧</Text>
        <Text style={estilos.titulo}>Um alimento.{"\n"}Um novo começo.</Text>
        <Text style={estilos.texto}>
          Compartilhe alimentos, transforme vidas.
        </Text>
        <Text style={estilos.badge}>MENOS DESPERDÍCIO · MAIS CUIDADO</Text>
      </View>
      <Painel>
        <Text style={estilos.subtitulo}>Que bom ter você aqui</Text>
        <Text style={estilos.suave}>
          Entre para fazer parte dessa rede de solidariedade.
        </Text>
        <CampoInput
          rotulo="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <CampoInput
          rotulo="Senha"
          senha
          value={senha}
          onChangeText={setSenha}
          autoComplete="current-password"
        />
        <Aviso mensagem={erro} />
        <Botao titulo="Entrar" loading={loading} onPress={enviar} />
        <Botao
          titulo="Não tem conta? Cadastre-se"
          secundario
          onPress={() => navigation.navigate("CadastroUsuario")}
        />
      </Painel>
      <Text style={[estilos.suave, { textAlign: "center" }]}>
        Juntos, fazemos o alimento chegar mais longe.
      </Text>
    </Pagina>
  );
}
