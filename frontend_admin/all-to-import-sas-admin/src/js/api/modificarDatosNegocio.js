import { API_URL, getToken } from "../config";

export const modificarDatosNegocio = async (id,datos) => {
  const response = await fetch(`${API_URL}DatosNegocio/DatosNegocio/${id}`, {
    method: "PUT",
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
    throw new Error(data || "Error en el modificar datos del negocio");
  }
};
