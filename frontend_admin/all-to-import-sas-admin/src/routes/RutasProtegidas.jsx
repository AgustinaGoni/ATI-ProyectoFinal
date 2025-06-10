import React from "react";
import { Navigate } from "react-router-dom";
import { PATH_LOGIN } from "./paths";
import { useAuth } from "../hooks/useAuth";
import UsuarioProvider from "../context/UsuarioProvider";
import CategoriasProvider from "../context/CategoriasProvider";
import ProductosProvider from "../context/ProductosProvider";

const RutasProtegidas = ({ children }) => {
  const { esAdmin, estaAutenticado } = useAuth();
  console.log(estaAutenticado);
  console.log("Es admin: " + esAdmin)


  if (!estaAutenticado) {
    return <Navigate to={PATH_LOGIN} />;
  }
  return (
    <>
      <UsuarioProvider>
        <CategoriasProvider>
          <ProductosProvider>{children}</ProductosProvider>
        </CategoriasProvider>
      </UsuarioProvider>
    </>
  );
};

export default RutasProtegidas;
