const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validarRegistro = ({ nombre, apellido, correoElectronico, contrasenia }) => {

  if (
    !nombre.trim() ||
    !apellido.trim() ||
    !correoElectronico.trim() ||
    !contrasenia.trim()
  ) {
    return false;
  }

  if (contrasenia.length < 6) {
    return false;
  }

  if (!emailRegex.test(correoElectronico)) {
    return false;
  }

  return true;
};

export const validarLogin = ({ correo, clave }) => {

  if (
    !correo.trim() ||
    !clave.trim()
  ) {
    return false;
  }

  if (!emailRegex.test(correo)) {
    return false;
  }

  return true;
};