const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validarRegistro = ({ nombre, apellido, correoElectronico, contrasenia, setError }) => {

  if (
    !nombre.trim() ||
    !apellido.trim() ||
    !correoElectronico.trim() ||
    !contrasenia.trim()
  ) {
    setError("Debe completar todos los campos");
    return false;
  }

  if (contrasenia.length < 6) {
    setError("La contraseña debe tener un mínimo de 6 caracteres");
    return false;
  }

  if (!emailRegex.test(correoElectronico)) {
    setError("El correo electrónico no es válido");
    return false;
  }

  setError("");
  return true;
};

export const validarLogin = ({ correo, clave, setError }) => {

  if (
    !correo.trim() ||
    !clave.trim()
  ) {
    setError("Debe completar todos los campos");
    return false;
  }

  if (!emailRegex.test(correo)) {
    setError("El correo electrónico no es válido");
    return false;
  }

  setError("");
  return true;
};