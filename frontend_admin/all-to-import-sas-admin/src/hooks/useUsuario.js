import { useContext } from "react";
import { UsuarioContext } from "../context/UsuarioProvider";

export const useUsuario = () => {
  return useContext(UsuarioContext);
};
