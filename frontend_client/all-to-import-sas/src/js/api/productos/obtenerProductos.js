import { API_URL } from '../../config';

export const obtenerProductos = async () => {
  try {
    const response = await fetch(`${API_URL}Producto/ProductosHabilitados`);
    if (!response.ok) {
      throw new Error('Error al obtener los productos');
    }
    const datos = await response.json();
    return datos;

  } catch (error) {
    console.error("Error obteniendo los productos:", error);
    throw error; 
  }
};
