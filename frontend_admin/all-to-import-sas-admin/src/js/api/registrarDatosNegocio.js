import { API_URL, getToken } from "../config";

export const registrarDatosNegocio = async (datos) => {
  const response = await fetch(`${API_URL}DatosNegocio/DatosNegocio`, {
    method: "POST",
    body: JSON.stringify(datos),
    headers: {
      "Authorization": `Bearer ${getToken()}`,
      "Content-type": "application/json",
    },
  });

  const data = await response.json();
  if (response.status === 200) {
    return data;
  } else {
    throw new Error(data || "Error en el registro datos del negocio");
  }
};
