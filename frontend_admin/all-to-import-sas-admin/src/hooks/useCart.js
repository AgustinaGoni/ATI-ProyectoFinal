import { useContext } from "react";
import { CarritoContext } from "../context/CarritoProvider";

export const useCart = () => {
  const contexto = useContext(CarritoContext);

  if (contexto === undefined) {
    throw new Error("useCart() debe usarse dentro de un CartProvider");
  }

  return contexto;
};
