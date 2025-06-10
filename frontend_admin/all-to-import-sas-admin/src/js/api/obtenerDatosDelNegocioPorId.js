import { API_URL } from '../config';

export const obtenerDatosDelNegocioPorId = async (id) => {
  try {
    const response = await fetch(`${API_URL}DatosNegocio/${id}`);
    const datos = await response.json();
    return datos;

  } catch (error) {
    console.error("Error obteniendo los datos del negocio:", error);
    return []; // En caso de error, devuelve un array vacío o maneja el error de otra manera
  }
};