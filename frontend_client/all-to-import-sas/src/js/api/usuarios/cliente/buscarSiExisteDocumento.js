import { API_URL, getToken } from "../../../config";

export const buscarSiExisteDocumento = async (
  documentoIdentidad,
  idCliente
) => {

  try {
    const respuesta = await fetch(
      `${API_URL}Usuario/BuscarSiExisteDocumento/${documentoIdentidad}/${idCliente}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-type": "application/json",
        },
      }
    );

    if (respuesta.ok) {
      const resultado = await respuesta.json();
      return resultado; 
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error obteniendo al usuario por su documento:", error);
    return false;
  }
};
