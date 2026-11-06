import React, { useState } from "react";
import { Text } from "react-native";
import { useAuth } from "../contexts/AuthContext.js";
import {
  Pagina,
  Painel,
  Marca,
  Botao,
  Aviso,
  estilos,
} from "../components/ui.js";
export default function Perfil() {
  const { usuario, sair } = useAuth(),
    [erro, setErro] = useState("");
  return (
    <Pagina>
      <Marca />
      <Text style={estilos.titulo}>Meu perfil</Text>
      <Painel>
        <Text style={estilos.badge}>
          {usuario.tipo_usuario === "DOADOR"
            ? "Doador / Estabelecimento"
            : "Receptor / Instituição"}
        </Text>
        <Text style={estilos.subtitulo}>{usuario.nome}</Text>
        <Text style={estilos.texto}>{usuario.email}</Text>
        <Text style={estilos.texto}>{usuario.telefone}</Text>
        <Aviso mensagem={erro} />
        <Botao
          titulo="Sair da conta"
          secundario
          onPress={async () => {
            try {
              await sair();
            } catch {
              setErro("Não foi possível remover a sessão. Tente novamente.");
            }
          }}
        />
      </Painel>
      <Text style={estilos.suave}>
        Alimenta+ · Compartilhe alimentos, transforme vidas.
      </Text>
    </Pagina>
  );
}
