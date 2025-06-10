import React, { createContext, useEffect, useState } from 'react'
import { obtenerCategorias } from '../js/api/categorias/obtenerCategorias';


export const CategoriasContext = createContext()

const CategoriasProvider = ({ children }) => {
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const c = await obtenerCategorias();
      setCategorias(c);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CategoriasContext.Provider value={{categorias, error, loading, fetchCategorias}}>
      {children}
    </CategoriasContext.Provider>
  )
}

export default CategoriasProvider