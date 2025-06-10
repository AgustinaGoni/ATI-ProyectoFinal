import { API_URL, getToken } from "../../config";

export const obtenerComprasDelCliente = async (documentoIdentidad) => {
  try {
    const response = await fetch(
      `${API_URL}Compra/ComprasCliente/${documentoIdentidad}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      }
    );
    const datos = await response.json();
    return datos;
  } catch (error) {
    console.error("Error compras cliente:", error);
    return [];
  }
};
