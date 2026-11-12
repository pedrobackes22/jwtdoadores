import React from "react";
import FormularioAlimento from "../components/FormularioAlimento.js";
export default function EditarAlimento({ route, navigation }) {
  return (
    <FormularioAlimento
      key={route.params.id}
      id={route.params.id}
      navigation={navigation}
    />
  );
}
