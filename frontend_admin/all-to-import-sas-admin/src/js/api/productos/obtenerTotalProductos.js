
import { API_URL, TOKEN } from '../../config';

export const obtenerTotalProductos = async (token) => {
  const bearerToken = `Bearer ${TOKEN}`
  console.log("token: " + bearerToken)
  try {
    const response = await fetch(`${API_URL}Producto/TotalDeProductos`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${TOKEN}`, // Incluye el token en el encabezado
        'Content-Type': 'application/json' // Añade el tipo de contenido si es necesario
      }
    });
    if (!response.ok) {
      throw new Error('Error al obtener el total de los productos');
    }
    const datos = await response.json();
    return datos;
  } catch (error) {
    console.error("Error obteniendo el total de los productos:", error);
    throw error;
  }
};