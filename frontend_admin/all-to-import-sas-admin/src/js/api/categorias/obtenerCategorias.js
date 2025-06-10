import { API_URL } from '../../config';
export const obtenerCategorias = async () => {
  try {
    const response = await fetch(`${API_URL}Producto/Categorias`);
    const datos = await response.json();
    return datos;

  } catch (error) {
    console.error("Error obteniendo los productos:", error);
    return []; // En caso de error, devuelve un array vacío o maneja el error de otra manera
  }
};