import { API_URL } from '../../config';

export const obtenerProductosMenoresQueMil = async () => {
  try {
    const response = await fetch(`${API_URL}Producto/ProductosMenoresMil`);
    if (!response.ok) {
      throw new Error('Error obteniendo los productos menores de mil');
    }
    const datos = await response.json();
    return datos;

  } catch (error) {
    console.error("Error:", error);
    throw error; 
  }
};
