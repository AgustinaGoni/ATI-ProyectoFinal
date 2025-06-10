import { useContext } from "react";
import { AutenticacionContext } from "../context/autenticacion/AutenticacionProvider";

export const useAuth = () => useContext(AutenticacionContext);
