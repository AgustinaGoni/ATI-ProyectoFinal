export const validarDatos = (datos) => {
  const { nombre, apellido} =
    datos;

  const errores = {};

  if (!nombre) errores.nombre = "El nombre es requerido.";
  if (!apellido) errores.apellido = "El apellido es requerido.";


  return errores;
};