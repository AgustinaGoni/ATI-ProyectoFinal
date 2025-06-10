import { API_URL, getToken } from '../../config';

export const obtenerCompraPorId = async (idCompra) => {

  try {
    const response = await fetch(`${API_URL}Compra/CompraPorId/${idCompra}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-type": "application/json",
      },
    });
    const datos = await response.json();
    return datos;

  } catch (error) {
    console.error("Error compras por id:", error);
    return []; 
  }

};