import { API_URL } from "../../config";


export const verificarUsuario = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}Login/verificar_usuario`, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
      }
    });

    if (response.ok) {
        const data = await response.json();
        return data.authenticated;
    } else {
        throw new Error('Error al verificar la autenticación');
    }
} catch (error) {
    console.error('Error en la solicitud de verificación de usuario:', error);
    throw error;
}
};