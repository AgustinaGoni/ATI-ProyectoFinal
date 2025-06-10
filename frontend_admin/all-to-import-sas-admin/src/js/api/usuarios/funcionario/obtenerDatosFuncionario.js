import { API_URL, getToken } from "../../../config";
import { jwtDecode } from "jwt-decode";

// export const getIdUsuarioDesdeToken = () => {
//   // const token = sessionStorage.getItem("token");
//   const token = localStorage.getItem("token");
//   if (!token) return null;

//   const decodedToken = jwtDecode(token);
//   return decodedToken.sub; // El ID del usuario
// };

// // Uso del ID del usuario
// const userId = getIdUsuarioDesdeToken();
// console.log("User ID:", userId);
export const getIdUsuarioDesdeToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("Token no disponible");
    return null;
  }

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.sub; // El ID del usuario
  } catch (error) {
    console.error("Error decodificando el token:", error);
    return null;
  }
};

export const obtenerDatosFuncionario = async () => {
  try {
    const usuarioId = getIdUsuarioDesdeToken();

    const response = await fetch(
      `${API_URL}Usuario/BuscarFuncionario/${usuarioId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-type": "application/json",
        },
      }
    );
    const datos = await response.json();
    return datos;
  } catch (error) {
    console.error("Error obteniendo al usuario:", error);
  }
};
