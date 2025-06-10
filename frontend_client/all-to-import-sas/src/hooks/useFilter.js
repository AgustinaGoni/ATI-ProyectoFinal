import { useContext } from "react";
import { FiltrosContext } from "../context/FiltrosProvider";

export const useFilter = () => {
  const { filtros, setFiltros } = useContext(FiltrosContext);


  const filtrarProductos = (productos) => {
    if (!productos) return []; // manejar productos undefined o null

    let productosFiltrados = [...productos];

    // Aplicar filtro por nombre si está definido
    if (filtros.nombre) {
      const nombreLowerCase = filtros.nombre.toLowerCase();
      productosFiltrados = productosFiltrados.filter((producto) =>
        producto.nombre.toLowerCase().includes(nombreLowerCase)
      );
    }

    // Aplicar filtro por precioDesde si está definido
    if (filtros.precioDesde) {
      productosFiltrados = productosFiltrados.filter(
        (producto) => producto.precio >= filtros.precioDesde
      );
    }

    // Aplicar filtro por precioHasta si está definido
    if (filtros.precioHasta) {
      productosFiltrados = productosFiltrados.filter(
        (producto) => producto.precio <= filtros.precioHasta
      );
    }
    // Aplicar filtro por categoría si está definida
    if (filtros.categoria) {
      productosFiltrados = productosFiltrados.filter(
        (producto) =>
          producto.categoria && producto.categoria.id === filtros.categoria
      );
    }

    // Ordenar productos según filtros.orden
    switch (filtros.orden) {
      case "asc":
        productosFiltrados.sort((a, b) => a.precio - b.precio);
        break;
      case "desc":
        productosFiltrados.sort((a, b) => b.precio - a.precio);
        break;
      case "a-z":
        productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case "z-a":
        productosFiltrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      default:
        productosFiltrados.sort((a, b) => a.stock - b.stock);
        break;
    }

    return productosFiltrados;
  };

  return { filtros, setFiltros, filtrarProductos };
};
