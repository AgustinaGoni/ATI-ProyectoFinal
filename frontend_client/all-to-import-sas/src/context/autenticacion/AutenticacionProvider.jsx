import React, { createContext, useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { login } from "../../js/api/usuarios/login";
import { registrarCliente } from "../../js/api/usuarios/cliente/registrarCliente";
import { getToken } from "../../js/config";

export const AutenticacionContext = createContext();

export function AutenticacionProvider({ children }) {
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [esAdmin, setEsAdmin] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();

  useEffect(() => {
    const token = getToken();
    if (token !== null && token.trim() !== "") {
      setEstaAutenticado(true);
    } else {
      setEstaAutenticado(false);
    }
  }, []);

  const loginModal = async (usuario) => {
    setError("");
    try {
      const datos = await login(usuario);
      if (datos.esAdmin) {
        setError(
          "Correo electrónico no registrado, verifique e intente nuevamente."
        );
        return false;
      }
      localStorage.setItem("token", datos.token);
      setEstaAutenticado(true);

      return true;
    } catch (e) {
      console.error("ERROR EN EL LOGIN:", e);

      if (e instanceof TypeError) {
        setError("Error de conexión, por favor vuelva a intentarlo.");
      } else if (e.message) {
        setError(e.message);
      }

      return false; // Indica que hubo un error en el login
    }
  };

  const registrarClienteModal = async (usuario) => {
    setError("");

    try {
      const datos = await registrarCliente(usuario);
      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada con éxito",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      return true;
    } catch (e) {
      console.error("ERROR EN EL LOGIN:", e);
      setError(e.message);

      return false; // Indica que hubo un error en el login
    }
  };

  const logout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    setEstaAutenticado(false);
    setEsAdmin(false);
  };

  return (
    <AutenticacionContext.Provider
      value={{
        estaAutenticado,
        esAdmin,
        loginModal,
        registrarClienteModal,
        logout,
        setError,
        error,
      }}
    >
      {children}
    </AutenticacionContext.Provider>
  );
}
