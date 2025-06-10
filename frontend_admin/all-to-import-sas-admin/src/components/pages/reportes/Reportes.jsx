import React from "react";
import { Box } from "@chakra-ui/react";
import ProductosMasVendidos from "./ProductosMasVendidos";
import ReporteVentas from "./ReportesVentas";

const Reportes = () => {
  return (
    <Box p={4}>
      <Box mb={8}>
        <ProductosMasVendidos />
      </Box>
      <Box mt={8}>
        <ReporteVentas />
      </Box>
    </Box>
  );
};

export default Reportes;
