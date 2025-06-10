import { API_URL, getToken } from "../../config";

export const eliminarCategoria = async (idCategoria) => {
  const response = await fetch(`${API_URL}Producto/Categoria/${idCategoria}`, {
    method: "DELETE",
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
