import { API_URL } from '../../config';

export const obtenerProductoPorId = async (id) => {
  try {
    const response = await fetch(`${API_URL}Producto/${id}`);
    const datos = await response.json();
    return datos;

  } catch (error) {
    console.error("Error obteniendo el producto por id:", error);
    return []; 
  }
};