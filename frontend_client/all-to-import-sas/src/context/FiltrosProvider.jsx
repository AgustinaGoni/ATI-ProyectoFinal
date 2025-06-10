import { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const FiltrosContext = createContext();

export const FiltrosProvider = ({ children }) => {
  const [filtros, setFiltros] = useState({
    precioDesde: 0,
    precioHasta: 0,
    categoria: 0,
    nombre: "",
  });

  const location = useLocation(); 

  // Efecto que se ejecuta cuando cambia la ubicación (ruta)
  // useEffect(() => {
  //   // Restablecer filtros a valores vacíos cuando cambias de página
  //   setFiltros({
  //     nombre: "",
  //     precioDesde: 0,
  //     precioHasta: 0,
  //     categoria: 0,
  //     orden: "",
  //   });
  // }, [location.pathname]); // Dependencia en location.pathname

  return (
    <FiltrosContext.Provider value={{ filtros, setFiltros }}>
      {children}
    </FiltrosContext.Provider>
  );
};
