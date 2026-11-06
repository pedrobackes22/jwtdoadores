import React, { useState } from "react";
import { Text } from "react-native";
import { api } from "../services/api.js";
import {
  Pagina,
  Painel,
  CampoInput,
  Botao,
  Aviso,
  Escolhas,
  estilos,
} from "../components/ui.js";
export default function CadastroUsuario({ navigation }) {
  const [form, setForm] = useState({
      nome: "",
      email: "",
      telefone: "",
      senha: "",
      confirmar: "",
      tipo_usuario: "RECEPTOR",
    }),
    [erro, setErro] = useState(""),
    [loading, setLoading] = useState(false),
    [sucesso, setSucesso] = useState(false);
  function mudar(campo, valor) {
    setForm({ ...form, [campo]: valor });
  }
  async function enviar() {
    setErro("");
    if (Object.values(form).some((v) => !v.trim()))
      return setErro("Preencha todos os campos.");
    if (form.senha.length < 8)
      return setErro("A senha deve ter pelo menos 8 caracteres.");
    if (form.senha !== form.confirmar)
      return setErro("As senhas não são iguais.");
    setLoading(true);
    try {
      const { confirmar, ...body } = form;
      await api("/auth/cadastro", { method: "POST", body, publica: true });
      setSucesso(true);
    } catch (e) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Pagina>
      <Text style={estilos.titulo}>Faça parte da mudança</Text>
      <Text style={estilos.suave}>Escolha como você quer participar.</Text>
      <Painel>
        {sucesso ? (
          <>
            <Text style={estilos.texto}>Conta criada! Entre para começar.</Text>
            <Botao titulo="Ir para login" onPress={() => navigation.goBack()} />
          </>
        ) : (
          <>
            <Escolhas
              valores={["DOADOR", "RECEPTOR"]}
              valor={form.tipo_usuario}
              onChange={(v) => mudar("tipo_usuario", v)}
            />
            {[
              ["nome", "Nome ou estabelecimento"],
              ["email", "E-mail"],
              ["telefone", "Telefone com DDD"],
              ["senha", "Senha"],
              ["confirmar", "Confirmar senha"],
            ].map(([campo, rotulo]) => (
              <CampoInput
                key={campo}
                rotulo={rotulo}
                value={form[campo]}
                onChangeText={(v) => mudar(campo, v)}
                senha={campo === "senha" || campo === "confirmar"}
                autoCapitalize={campo === "email" ? "none" : "sentences"}
                keyboardType={
                  campo === "email"
                    ? "email-address"
                    : campo === "telefone"
                      ? "phone-pad"
                      : "default"
                }
              />
            ))}
            <Aviso mensagem={erro} />
            <Botao titulo="Criar conta" onPress={enviar} loading={loading} />
          </>
        )}
      </Painel>
    </Pagina>
  );
}
