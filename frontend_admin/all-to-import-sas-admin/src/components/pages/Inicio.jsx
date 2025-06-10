import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
} from "@chakra-ui/react";
import TotalVentasCard from "../cards/ventas/TotalVentasCard";
import NuevasVentasCard from "../cards/ventas/NuevasVentasCard";
import VentasParaEnvioCard from "../cards/ventas/VentasParaEnvioCard";
import VentasParaRetiroCard from "../cards/ventas/VentasParaRetiroCard";
import VentasFinalizadasCard from "../cards/ventas/VentasFinalizadasCard";
import ProductosSinStokCard from "../cards/productos/ProductosSinStokCard";
import TotalProductosCard from "../cards/productos/TotalProductosCard";
import ProductosHabilitadosCard from "../cards/productos/ProductosHabilitadosCard";
import ProductosDeshabilitadosCard from "../cards/productos/ProductosDeshabilitadosCard";
import { IconCube, IconShoppingCart } from "@tabler/icons-react";
import VentasFacturadasCard from "../cards/ventas/VentasFacturadasCard";

const Inicio = () => {
  const [loading, setLoading] = useState(true);
  const [cargandoComponentes, setCargandoComponentes] = useState(0);

  const totalComponentes = 2;
  const handleCargandoComponente = () => {
    setCargandoComponentes((prev) => prev + 1);
  };

  useEffect(() => {
    if (cargandoComponentes === totalComponentes) {
      setLoading(false);
    }
  }, [cargandoComponentes, totalComponentes]);

  return (
    <>
      <Box px={6}>
        <Flex alignItems={"center"} mb={8} columnGap={4}>
          <IconShoppingCart size={40} />
          <Heading fontSize={"3xl"}>Ventas</Heading>
        </Flex>
        <Grid
          templateColumns={{
            base: "repeat(auto-fill, minmax(150px, 1fr))",
            md: "repeat(auto-fill, minmax(200px, 1fr))", 
            lg: "repeat(auto-fill, minmax(250px, 1fr))", 
            xl: "repeat(auto-fill, minmax(300px, 1fr))",
          }}
          gap={8}
          autoRows="minmax(100px, auto)" 
          width="100%" 
          maxWidth="auto" 
        >
          <GridItem>
            <NuevasVentasCard onLoad={handleCargandoComponente} />
          </GridItem>
          <GridItem>
            <VentasFacturadasCard onLoad={handleCargandoComponente} />
          </GridItem>
          <GridItem>
            <VentasParaEnvioCard onLoad={handleCargandoComponente} />
          </GridItem>
          <GridItem>
            <VentasParaRetiroCard onLoad={handleCargandoComponente} />
          </GridItem>
          <GridItem>
            <VentasFinalizadasCard onLoad={handleCargandoComponente} />
          </GridItem>
          <GridItem>
            <TotalVentasCard onLoad={handleCargandoComponente} />
          </GridItem>
        </Grid>
      </Box>
      <Divider py={8} />
      <Box px={6} mt={8}>
        <Flex alignItems={"center"} mb={8} columnGap={4}>
          <IconCube size={40} />
          <Heading fontSize={"3xl"}>Productos</Heading>
        </Flex>
        <Grid
          templateColumns={{
            base: "repeat(auto-fill, minmax(150px, 1fr))", 
            md: "repeat(auto-fill, minmax(200px, 1fr))", 
            lg: "repeat(auto-fill, minmax(250px, 1fr))",
            xl: "repeat(auto-fill, minmax(300px, 1fr))", 
          }}
          gap={8}
          autoRows="minmax(100px, auto)" 
          width="100%" 
          maxWidth="auto" 
        >
          <GridItem>
            <ProductosSinStokCard onLoad={handleCargandoComponente} />
          </GridItem>
          <GridItem>
            <ProductosHabilitadosCard onLoad={handleCargandoComponente} />
          </GridItem>
          <GridItem>
            <ProductosDeshabilitadosCard onLoad={handleCargandoComponente} />
          </GridItem>
          <GridItem>
            <TotalProductosCard onLoad={handleCargandoComponente} />
          </GridItem>
        </Grid>
      </Box>
    </>
  );
};

export default Inicio;
