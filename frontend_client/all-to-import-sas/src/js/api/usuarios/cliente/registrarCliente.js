import { API_URL } from '../../../config';

export const registrarCliente = async (usuario) => {
  const response = await fetch(`${API_URL}Usuario/Cliente`, {
    method: "POST",
    body: JSON.stringify(usuario),
    headers: { "Content-type": "application/json" },
  });

  const data = await response.json();
  if (response.status === 200) {
    return data;
  } else {
    throw new Error(data || "Error en el registro");
  }
};