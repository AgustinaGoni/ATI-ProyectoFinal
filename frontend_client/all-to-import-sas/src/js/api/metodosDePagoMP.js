import { API_URL } from "../config";

export const metodosDePagoMP = async () => {
  try {
    const response = await fetch(`${API_URL}MercadoPago/MetodosDePagos`);
    if (!response.ok) {
      throw new Error('Error al obtener los metodos de pago');
    }
    const datos = await response.json();
    return datos;

  } catch (error) {
    console.error("Error obteniendo los metodos de pago:", error);
    throw error;
  }
};
