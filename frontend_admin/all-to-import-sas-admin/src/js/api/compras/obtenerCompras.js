import { API_URL, getToken } from "../../config";

export const obtenerCompras = async () => {
  try {
    const response = await fetch(`${API_URL}Compra`, {
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
    return []; 
  }
};
