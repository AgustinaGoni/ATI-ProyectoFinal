import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import CategoriasProvider from "../context/CategoriasProvider";
import ProductosProvider from "../context/ProductosProvider";

const RutasProtegidas = ({ children }) => {
  const { esAdmin, estaAutenticado } = useAuth();

  if (!estaAutenticado) {
    return <Navigate to={"/"} />;
  }
  return (
    <>

        <CategoriasProvider>
          <ProductosProvider>{children}</ProductosProvider>
        </CategoriasProvider>

    </>
  );
};

export default RutasProtegidas;