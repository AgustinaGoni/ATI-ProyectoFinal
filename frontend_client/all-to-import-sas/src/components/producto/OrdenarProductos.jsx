import { Box, Select, Text } from "@chakra-ui/react";
import React from "react";
import { useFilter } from "../../hooks/useFilter";

const OrdenarProductos = ({ onClose }) => {
  const { filtros, setFiltros } = useFilter();

  return (
    <Box mt={4}>
      <Text>Ordenar por</Text>
      <Select
        mt={2}
        value={filtros.orden}
        onChange={(e) => {
          setFiltros((prevFiltros) => ({
            ...prevFiltros,
            orden: e.target.value,
          }));
          onClose();
        }}
      >
        <option value="">Recomendado</option>
        <option value="asc">Menor a mayor</option>
        <option value="desc">Mayor a menor</option>
        <option value="a-z">Por nombre (A-z)</option>
        <option value="z-a">Por nombre (Z-a)</option>
      </Select>
    </Box>
  );
};

export default OrdenarProductos;
