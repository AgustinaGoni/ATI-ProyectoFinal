import { API_URL, getToken } from '../../config';
export const obtenerCategoriaPorId = async (id) => {
  try {
    const response = await fetch(`${API_URL}Producto/CategoriaPorId/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`, 
        'Content-Type': 'application/json'
      }
    });
    const datos = await response.json();
    return datos;

  } catch (error) {
    console.error("Error obteniendo los productos:", error);
    return []; // En caso de error, devuelve un array vacío o maneja el error de otra manera
  }
};