import React from "react";
import FormularioAlimento from "../components/FormularioAlimento.js";
export default function EditarAlimento({ route, navigation }) {
  return <FormularioAlimento id={route.params.id} navigation={navigation} />;
}
