import React from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../contexts/AuthContext.js";
import { Pagina, Botao, Aviso, Carregamento, cores } from "../components/ui.js";
import Login from "../screens/Login.js";
import CadastroUsuario from "../screens/CadastroUsuario.js";
import Home from "../screens/Home.js";
import DetalhesAlimento from "../screens/DetalhesAlimento.js";
import CadastrarAlimento from "../screens/CadastrarAlimento.js";
import EditarAlimento from "../screens/EditarAlimento.js";
import MinhasDoacoes from "../screens/MinhasDoacoes.js";
import SolicitacoesRecebidas from "../screens/SolicitacoesRecebidas.js";
import MinhasSolicitacoes from "../screens/MinhasSolicitacoes.js";
import Perfil from "../screens/Perfil.js";
const Stack = createNativeStackNavigator(),
  Tab = createBottomTabNavigator();
function Abas() {
  const { usuario } = useAuth(),
    doador = usuario.tipo_usuario === "DOADOR";
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: cores.verde,
        tabBarStyle: { height: 68, paddingBottom: 10, paddingTop: 8 },
        tabBarIcon: ({ color }) => (
          <Text style={{ color, fontSize: 22 }}>
            {
              { Catálogo: "♧", Doações: "♡", Solicitações: "☷", Perfil: "○" }[
                route.name
              ]
            }
          </Text>
        ),
      })}
    >
      <Tab.Screen name="Catálogo" component={Home} />
      {doador && <Tab.Screen name="Doações" component={MinhasDoacoes} />}
      <Tab.Screen
        name="Solicitações"
        component={doador ? SolicitacoesRecebidas : MinhasSolicitacoes}
      />
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
}
export default function AppNavigator() {
  const { usuario, carregando, erro, restaurar, sair } = useAuth();
  if (carregando) return <Carregamento />;
  if (erro)
    return (
      <Pagina>
        <Aviso mensagem={erro} />
        <Botao titulo="Tentar novamente" onPress={restaurar} />
        <Botao titulo="Voltar ao login" secundario onPress={sair} />
      </Pagina>
    );
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: cores.verde,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: cores.fundo },
        }}
      >
        {usuario ? (
          <>
            <Stack.Screen
              name="Inicio"
              component={Abas}
              options={{ title: "Alimenta+" }}
            />
            <Stack.Screen
              name="DetalhesAlimento"
              component={DetalhesAlimento}
              options={{ title: "Sobre a doação" }}
            />
            {usuario.tipo_usuario === "DOADOR" && (
              <>
                <Stack.Screen
                  name="CadastrarAlimento"
                  component={CadastrarAlimento}
                  options={{ title: "Nova doação" }}
                />
                <Stack.Screen
                  name="EditarAlimento"
                  component={EditarAlimento}
                  options={{ title: "Editar doação" }}
                />
              </>
            )}
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CadastroUsuario"
              component={CadastroUsuario}
              options={{ title: "Criar conta" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
