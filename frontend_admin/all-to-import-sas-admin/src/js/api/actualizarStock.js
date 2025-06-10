import { API_URL, getToken } from "../config";

export const actualizarStock = async () => {
  try {
    const response = await fetch(
      `${API_URL}Stock/ObtenerStockActualizado`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getToken()}`, 
          'Content-Type': 'application/json'
        }
      }
    );

    // Verifica si la respuesta fue exitosa
    if (response.ok) {
      return true; 
    } else {
      console.error("Error al actualizar el stock:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error al actualizar el stock:", error);
  }
};