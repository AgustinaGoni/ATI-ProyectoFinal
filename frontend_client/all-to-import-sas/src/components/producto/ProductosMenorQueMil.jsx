import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Heading,
  Input,
  SimpleGrid,
  Text,
  Flex,
  Tag,
  TagCloseButton,
  TagLabel,
  Container,
} from "@chakra-ui/react";
import { useCart } from "../../hooks/useCart";
import { useFilter } from "../../hooks/useFilter";
import ProductosSkeleton from "./ProductosSkeleton";
import { useProductos } from "../../hooks/useProductos";
import BotonFiltrar from "./BotonFiltrar";
import ProductoCard from "./ProductoCard";

const Productos = () => {
  const { productosMenoresMil, loading } = useProductos();
  const { filtrarProductos } = useFilter();
  const { carrito } = useCart();
  const { filtros, setFiltros } = useFilter();
  const productosFiltrados = filtrarProductos(productosMenoresMil);

  const productosAMostrar = Object.values(filtros).every((filtro) => !filtro)
    ? productosMenoresMil
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

  return (
    <Container maxW="1280px" px={5} my={8}>
      <Flex my={10} flexDirection={"column"} gap={2}>
        <Heading fontSize={{ base: "xl", sm: "3xl", lg: "5xl" }}>
          Por menos de $1000
        </Heading>
        <Text fontWeight={500} color={"gray"}>
          Encuentra una selección de productos útiles y a buen precio, todo por
          menos de $1000. Perfecto para regalos, mejoras en el hogar o
          simplemente para darte un gusto sin gastar de más.
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
                  {/* {key === "categoria" &&
                    `Categoría: ${
                      categorias.find(
                        (categoria) => categoria.id === filtros[key]
                      )?.nombre
                    }`} */}
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
