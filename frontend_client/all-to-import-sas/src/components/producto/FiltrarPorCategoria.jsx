import React, { useEffect, useState } from "react";
import { Box, Select, Text } from "@chakra-ui/react";
import { useFilter } from "../../hooks/useFilter";
import {obtenerCategorias} from "../../js/api/categorias/obtenerCategorias"

const FiltrarPorCategoria = ({onClose}) => {
  const { filtros, setFiltros, filtrarProductos } = useFilter();

  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const datos = await obtenerCategorias();
        setCategorias(datos);
      } catch (error) {
        console.error("Error obteniendo las categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  return (
    <Box mt={4}>
      <Text>Buscar por categoría</Text>
      <Select
        placeholder="Seleccione una categoría"
        value={filtros.orden}
        onChange={(e) => {
          setFiltros((prevFiltros) => ({
            ...prevFiltros,
            categoria: Number(e.target.value),
          }));
          onClose();
        }}
      >
        {categorias.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.nombre}
          </option>
        ))}
      </Select>
    </Box>
  );
};

export default FiltrarPorCategoria;
