export const verificarNumeroTelefonico = (telefono) => {
  const regex = /^(2\d{7}|4\d{7}|09[1-9]\d{6})$/;
  return regex.test(telefono.trim());
};
