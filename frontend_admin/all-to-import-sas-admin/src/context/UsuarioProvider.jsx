import React, { createContext, useEffect, useState } from 'react'
import { obtenerDatosFuncionario } from '../js/api/usuarios/funcionario/obtenerDatosFuncionario';

export const UsuarioContext = createContext()
const UsuarioProvider = ({children}) => {
  const [usuario, setUsuario] = useState({});
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const usuario = await obtenerDatosFuncionario();
        setUsuario(usuario);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <UsuarioContext.Provider value={{usuario, loading}}>
      {children}
    </UsuarioContext.Provider>
  )
}

export default UsuarioProvider