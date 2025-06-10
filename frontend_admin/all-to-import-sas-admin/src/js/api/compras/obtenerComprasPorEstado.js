import { API_URL, getToken } from '../../config';

export const obtenerComprasPorEstado = async (estadoCompra) => {
  try {
    const response = await fetch(`${API_URL}Compra/Estado/${estadoCompra}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new TypeError("Expected JSON response");
    }
    const datos = await response.json();
    return datos;

  } catch (error) {
    console.error("Error compras:", error);
    return []; // En caso de error, devuelve un array vacío o maneja el error de otra manera
  }

};