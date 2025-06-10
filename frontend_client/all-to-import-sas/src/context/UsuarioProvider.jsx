import React, { createContext, useEffect, useState } from "react";
import { obtenerDatosCliente } from "../js/api/usuarios/obtenerDatosCliente";
import { getToken } from "../js/config";

export const UsuarioContext = createContext();
const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);

  useEffect(() => {
    if (getToken()) {
      fetchUsuario();
    }
  }, []);

  const fetchUsuario = async () => {
    setLoading(true);
    try {
      const usuario = await obtenerDatosCliente();
      setUsuario(usuario);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UsuarioContext.Provider
      value={{ usuario, loading, actualizarUsuario: fetchUsuario }}
    >
      {children}
    </UsuarioContext.Provider>
  );
};

export default UsuarioProvider;
