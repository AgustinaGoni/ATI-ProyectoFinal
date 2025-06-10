import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Flex,
  Tag,
  TagCloseButton,
  TagLabel,
  Container,
} from "@chakra-ui/react";
import { useFilter } from "../../hooks/useFilter";
import ProductosSkeleton from "./ProductosSkeleton";
import { useProductos } from "../../hooks/useProductos";
import BotonFiltrar from "./BotonFiltrar";
import ProductoCard from "./ProductoCard";
import { useLocation } from "react-router-dom";

const Productos = () => {
  const { productos, loading } = useProductos();
  const { filtrarProductos, filtros, setFiltros } = useFilter();

  const productosFiltrados = filtrarProductos(productos);
  const [firstLoad, setFirstLoad] = useState(true);
  const location = useLocation();



  const productosAMostrar = Object.values(filtros).every((filtro) => !filtro)
    ? productos
    : productosFiltrados;

  const handleRemoveFiltro = (key) => {
    setFiltros((prevFiltros) => {
      const newFiltros = { ...prevFiltros };
      delete newFiltros[key];
      return newFiltros;
    });
  };
  const filtrosActivos = Object.keys(filtros).filter(
    (key) =>
      filtros[key] !== undefined && filtros[key] !== "" && filtros[key] !== 0
  );


  const ordenMap = {
    asc: "Menor a mayor",
    desc: "Mayor a menor",
    "a-z": "A - Z",
    "z-a": "Z - a",
  };

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
    } else {
      setFiltros({
        nombre: "",
        precioDesde: 0,
        precioHasta: 0,
        categoria: 0,
        orden: "",
      });
    }
  }, [location.pathname]); 

  return (
    <Container maxW="1280px" px={5} my={8}>
      <Flex my={10} flexDirection={"column"} gap={2}>
        <Heading fontSize={{ base: "2xl", lg: "4xl" }}>
          Todos nuestros productos
        </Heading>
        <Text fontWeight={500} color={"gray"}>
          Sumérgete en un mundo de posibilidades y explora nuestra increíble
          variedad de productos que harán tu vida más fácil y placentera.
          <Text as={"span"} fontWeight={600}>
            ¡Descubre lo que hemos diseñado para sorprenderte y satisfacer todas
            tus necesidades!
          </Text>
        </Text>
        <Box mt={4}>
          <BotonFiltrar />
        </Box>
      </Flex>
      <Box mt={4} mb={8}>
        {filtrosActivos.length > 0 && (
          <Flex display={{ base: "none", lg: "flex" }} gap={2}>
            {filtrosActivos.map((key) => (
              <Tag size={"sm"} key={key} borderRadius={8} variant="solid">
                <TagLabel>
                  {key === "precioDesde" && `Desde: ${filtros[key]}`}
                  {key === "precioHasta" && `Hasta: ${filtros[key]}`}
                  {key === "nombre" && `Nombre: ${filtros[key]}`}
                  {key === "orden" && `Ordenar: ${ordenMap[filtros[key]]}`}
                </TagLabel>
                <TagCloseButton onClick={() => handleRemoveFiltro(key)} />
              </Tag>
            ))}
          </Flex>
        )}
      </Box>
      {loading ? (
        <ProductosSkeleton />
      ) : (
        <>
          {productosAMostrar.length === 0 ? (
            <Text>No hay productos disponibles</Text>
          ) : (
            <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4}>
              {productosAMostrar.map((producto) => (
                <ProductoCard productosAMostrar={producto} />
              ))}
            </SimpleGrid>
          )}
        </>
      )}
    </Container>
  );
};

export default Productos;
