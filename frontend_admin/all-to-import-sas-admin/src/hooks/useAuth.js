import { useContext } from "react";
import { AutenticacionContext } from "../context/AutenticacionProvider";


export const useAuth = () => useContext(AutenticacionContext);
