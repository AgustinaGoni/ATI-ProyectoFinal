import { API_URL } from '../../config';

export const editarProducto = async (producto) => {
  const response = await fetch(`${API_URL}Producto/EditarProducto`, {
    method: "POST",
    body: JSON.stringify(producto),
    headers: { "Content-type": "application/json" },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data || "Error en la actualización del producto");
  }
  return data;
};

