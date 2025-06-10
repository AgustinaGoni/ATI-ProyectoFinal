//VERIFICAR CÉDULA DE IDENTIDAD
export const verificarDocumentoDeIdentidad = (documento) => {
  // Asegurarse de que la entrada sea una cadena y limpiar caracteres no numéricos
  documento = (documento || "").toString().replace(/[.-]/g, "");



  // Verificar que el número de cédula sea una cadena de dígitos
  if (!/^\d+$/.test(documento)) {
    throw new Error("El número de cédula debe contener solo dígitos.");
  }

  // Añadir un cero al inicio si la longitud es 7
  if (documento.length === 7) {
    documento = "0" + documento;
  };

  // Verificar que el número de cédula tenga exactamente 8 dígitos
  if (documento.length !== 8) {
    throw new Error("El número de cédula debe tener 8 dígitos.");
  }

  const multiplicador = "2987634";
  const digitoVerificado = parseInt(documento.charAt(documento.length - 1), 10);
  let acumulador = 0;

  // Calcular el acumulador
  for (let i = 0; i < documento.length - 1; i++) {
    acumulador +=
      parseInt(documento.charAt(i), 10) * parseInt(multiplicador.charAt(i), 10);
  }

  // Calcular el dígito verificador
  const digitoVerificador = (10 - (acumulador % 10)) % 10;

  // Verificar y retornar el resultado
  if (digitoVerificado === digitoVerificador) {
    return true;
  }
  return false;
};
