import { API_URL, getToken } from "../config";


export const actualizarStock = async () => {
  try {
    const response = await fetch(
      `${API_URL}Stock/ObtenerStockActualizado`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getToken()}`, // Incluye el token en el encabezado
          'Content-Type': 'application/json'
        }
      }
    );

    // Verifica si la respuesta fue exitosa
    if (response.ok) {
      return true; // O cualquier otra lógica que necesites
    } else {
      console.error("Error al actualizar el stock:", response.statusText);
      return false; // O manejar el error de alguna otra forma
    }
  } catch (error) {
    console.error("Error al actualizar el stock:", error);
  }
};
