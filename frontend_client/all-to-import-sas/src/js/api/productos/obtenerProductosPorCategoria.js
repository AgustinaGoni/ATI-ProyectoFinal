import { API_URL } from '../../config';

export const obtenerProductoPorCategoria = async (id) => {
  try {
    const response = await fetch(`${API_URL}Producto/PorductosPorCategoria/${id}`);
    const datos = await response.json();
    return datos;

  } catch (error) {
    console.error("Error obteniendo los productos por categoria:", error);
    return []; 
  }
};
