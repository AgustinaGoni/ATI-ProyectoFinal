export   function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);

  // Obtener las partes de la fecha
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // getMonth() devuelve el mes en base 0
  const anio = fecha.getFullYear();
  const horas = String(fecha.getHours()).padStart(2, "0");
  const minutos = String(fecha.getMinutes()).padStart(2, "0");
  const segundos = String(fecha.getSeconds()).padStart(2, "0");

  // Formatear la fecha y hora
  return `${dia}-${mes}-${anio} ${horas}:${minutos}:${segundos}`;
}