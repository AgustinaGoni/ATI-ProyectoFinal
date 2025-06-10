import React, { createContext, useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { accesoLogin } from "../js/api/usuarios/login";

export const AutenticacionContext = createContext();

export function AutenticacionProvider({ children }) {
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [esAdmin, setEsAdmin] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    let admin = JSON.parse(localStorage.getItem("admin")) || false;
    if (token) {
      setEstaAutenticado(true);
    }
    if (admin) {
      setEsAdmin(admin);
    }
  }, []);

  const login = async (usuario) => {
    setError("");
    try {
      const datos = await accesoLogin(usuario);
      if (!datos.esAdmin) {
        throw new Error("No puedes acceder a este sitio.");
      }
      localStorage.setItem("token", datos.token);
      localStorage.setItem("admin", JSON.stringify(datos.esAdmin));
      setEstaAutenticado(true);
      setEsAdmin(datos.esAdmin);
      return true; // Indica que el login fue exitoso
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


  const logout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    setEstaAutenticado(false);
    setEsAdmin(false);
  };

  return (
    <AutenticacionContext.Provider
      value={{ estaAutenticado, esAdmin, login, logout, error }}
    >
      {children}
    </AutenticacionContext.Provider>
  );
}
