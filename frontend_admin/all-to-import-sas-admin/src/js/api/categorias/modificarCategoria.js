import { API_URL, getToken } from "../../config";

export const modificarCategoria = async (idCategoria, categoria) => {
  const response = await fetch(`${API_URL}Producto/Categoria/${idCategoria}`, {
    method: "PUT",
    body: JSON.stringify(categoria),
    headers: {
      "Authorization": `Bearer ${getToken()}`,
      "Content-type": "application/json",
    },
  });

  const data = await response.json();
  if (response.status === 200) {
    return data;
  } else {
    throw new Error(data || "Error sl crear una categoría");
  }
};
