import { API_URL } from "../config";

export const obtenerDatosNegocio = async () => {
  try {
    const response = await fetch(
      `${API_URL}DatosNegocio/ObtenerDatosNegocio`
    );
    const datos = await response.json();
    return datos;
  } catch (error) {
    console.error("Error obteniendo al usuario:", error);
  }
};
