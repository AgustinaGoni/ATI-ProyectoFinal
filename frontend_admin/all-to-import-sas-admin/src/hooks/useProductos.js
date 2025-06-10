import { useContext } from "react";
import { ProductosContext } from "../context/ProductosProvider";

export const useProductos = () => {
  return useContext(ProductosContext);
};
