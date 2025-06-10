import { API_URL } from "../../config";

export const accesoLogin = async (usuario) => {
  const response = await fetch(`${API_URL}Login`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(usuario),
  });

  const data = await response.json();
  if (response.status === 200) {
    return data;
  } else {
    throw new Error(data || "Error en el login");
  }
};
