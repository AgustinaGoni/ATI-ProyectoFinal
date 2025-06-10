import { API_URL, getToken } from '../../../config';

export const registrarFuncionario = async (usuario) => {
  const response = await fetch(`${API_URL}Usuario/Funcionario`, {
    method: "POST",    
    body: JSON.stringify(usuario),
    headers: {
      "Authorization": `Bearer ${getToken()}`,
      "Content-type": "application/json",
    },
  });

  const data = await response.json();
  if (response.status === 200) {
    return data;
  } else {
    throw new Error(data || "Error en el registro");
  }
};