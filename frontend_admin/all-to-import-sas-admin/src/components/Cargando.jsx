import { SimpleGrid, Skeleton } from "@chakra-ui/react";
import React from "react";

const Cargando = ({
  columns,
  rows,
  height = "20px",
  width = "100%",
  startColor = "blue.300",
}) => {
  // Crear una matriz para representar las celdas de la tabla
  const skeletons = Array.from({ length: columns * rows }, (_, index) => (
    <Skeleton key={index} height={height} width={width} startColor={startColor}/>
  ));

  return (
    <SimpleGrid columns={columns} spacing={4}>
      {skeletons}
    </SimpleGrid>
  );
};

export default Cargando;
