import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import VentasPorEstado from '../pages/ventas/VentasPorEstado';

const VentasPorEstadoWrapper = () => {
  const { estado } = useParams();
  const estadoValido = parseInt(estado, 10);

  // Verifica si el estado es un número válido dentro del rango permitido
  if (isNaN(estadoValido) || estadoValido < 0 || estadoValido > 4) {
    return <Navigate to="/not-found" />; // Redirige a la página de "Not Found"
  }

  // Si el estado es válido, renderiza el componente VentasPorEstado
  return <VentasPorEstado estado={estadoValido} />;
};

export default VentasPorEstadoWrapper;
