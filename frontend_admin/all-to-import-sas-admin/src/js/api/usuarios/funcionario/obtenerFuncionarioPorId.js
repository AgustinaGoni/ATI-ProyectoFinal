import { API_URL, getToken } from "../../../config";

export const obtenerFuncionarioPorId = async (idFuncionario) => {
  try {
    const response = await fetch(
      `${API_URL}Usuario/${idFuncionario}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-type": "application/json",
        },
      }
    );
    const datos = await response.json();
    return datos;
  } catch (error) {
    console.error("Error obteniendo al usuario:", error);
  }
};
