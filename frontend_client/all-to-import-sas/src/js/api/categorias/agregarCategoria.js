import { API_URL } from '../../config';

export const agregarCategoria = async (categoria) => {
  const response = await fetch(`${API_URL}Producto/AltaCategoria`, {
    method: "POST",
    body: JSON.stringify(categoria),
    headers: { "Content-type": "application/json" },
  });

  const data = await response.json();
  if (response.status === 200) {
    return data;
  } else {
    throw new Error(data || "Error sl crear una categoría");
  }
}