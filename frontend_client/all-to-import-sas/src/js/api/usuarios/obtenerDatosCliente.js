import { API_URL } from "../../config";
import { jwtDecode } from "jwt-decode";

export const getIdUsuarioDesdeToken = () => {
  const token = localStorage.getItem("token");

  // Verificar si el token está presente
  if (!token) {
    return null;
  }

  // Función para verificar si el token ha expirado
  const isTokenExpired = (token) => {
    try {
      const decodedToken = jwtDecode(token);

      if (!decodedToken.exp) {
        return true; // Considerar el token expirado si no tiene campo exp
      }

      const currentTime = Date.now() / 1000; // Tiempo actual en segundos
      return decodedToken.exp < currentTime; // Token expirado si exp < tiempo actual
    } catch (error) {
      console.error("Error decodificando el token:", error);
      return true; // Considerar el token expirado si hay un error al decodificar
    }
  };

  // Verificar si el token ha expirado
  if (isTokenExpired(token)) {
    return null; // No proceder si el token ha expirado
  }

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.sub; // Retorna el ID del usuario
  } catch (error) {
    console.error("Error decodificando el token:", error);
    return null;
  }
};

export const obtenerDatosCliente = async () => {
  const idUsuario = getIdUsuarioDesdeToken();

  if (idUsuario === null) {
    return; // No continuar si no se pudo obtener el ID del usuario
  }

  try {
    const usuarioId = getIdUsuarioDesdeToken();

    const respuesta = await fetch(
      `${API_URL}Usuario/BuscarCliente/${usuarioId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-type": "application/json",
        },
      }
    );
    const datos = await respuesta.json();

    return datos;
  } catch (error) {
    console.error("Error obteniendo al usuario:", error);
  }
};
