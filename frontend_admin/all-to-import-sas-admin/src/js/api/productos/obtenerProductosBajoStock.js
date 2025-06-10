import { API_URL, getToken } from '../../config';

export const obtenerProductosBajoStock = async () => {
  try {
    const response = await fetch(`${API_URL}Producto/ProductosConStockBajo`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`, 
        'Content-Type': 'application/json' 
      }
    });
    if (!response.ok) {
      throw new Error('Error al obtener los productos con bajo stock');
    }
    const datos = await response.json();
    return datos;

  } catch (error) {
    console.error("Error obteniendo los productos con bajo stock:", error);
    throw error; 
  }
};
