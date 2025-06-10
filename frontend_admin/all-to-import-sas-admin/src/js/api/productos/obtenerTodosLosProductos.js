import { API_URL, getToken } from '../../config';

export const obtenerTodosLosProductos = async (token) => {
  const bearerToken = `Bearer ${getToken()}`
  console.log("token: " + bearerToken)
  try {
    const response = await fetch(`${API_URL}Producto/TodosLosProductos`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`, 
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error("Error al obtener los productos");
    }
    const datos = await response.json();
    return datos;
  } catch (error) {
    console.error("Error obteniendo el total de los productos:", error);
    throw error;
  }
};