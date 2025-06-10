import React, { createContext, useEffect, useState } from 'react'
import { obtenerCategorias } from '../js/api/categorias/obtenerCategorias';


export const CategoriasContext = createContext()

const CategoriasProvider = ({ children }) => {
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const categorias = await obtenerCategorias();
        setCategorias(categorias);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <CategoriasContext.Provider value={{categorias, error, loading}}>
      {children}
    </CategoriasContext.Provider>
  )
}

export default CategoriasProvider