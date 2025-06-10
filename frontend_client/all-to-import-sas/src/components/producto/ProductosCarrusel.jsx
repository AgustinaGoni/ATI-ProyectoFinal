import React, { useEffect, useState } from "react";
import ProductoCard from "./ProductoCard";
import { useProductos } from "../../hooks/useProductos";
import Slider from "react-slick";
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Highlight,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";


const ProductosCarrusel = () => {
  const { productos, loading } = useProductos();
  const breakpoints = useBreakpointValue({ base: 2, sm: 3, md: 4, lg: 5 });

  const settings = {
    // dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: breakpoints,
    slidesToScroll: breakpoints,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 2 },
      },
    ],
  };

  const primerosProductos = productos.slice(-7);

  return (
    <Box mt={16}>
      <Heading
        lineHeight="tall"
        textTransform="uppercase"
        fontSize={{ base: "xl", lg: "3xl" }}
        textAlign={"center"}
      >
        Nuevos ingresos
      </Heading>
      {loading ? (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 5 }} gap={6}>
          {[...Array(breakpoints)].map((_, index) => (
            <Box key={index} p={4} boxShadow="lg" borderRadius="8px">
              <Stack spacing={4}>
                <Skeleton height="200px" />
                <Skeleton height="20px" width="60%" />
                <Flex justifyContent="space-between" alignItems="center">
                  <Skeleton height="20px" width="30%" />
                  <Skeleton height="40px" width="30%" />
                </Flex>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      ) : (

          <Slider {...settings} className="slider-container">
            {primerosProductos.map((producto) => (
              <ProductoCard key={producto.id} productosAMostrar={producto} />
            ))}
            <div className="slick-slide button-slide">
              <Button
                as={Link}
                color={'primary'}
                to="/productos"
                size="lg"
                variant="link"
                className="slider-button"
              >
                Ver todo
              </Button>
            </div>
          </Slider>
      )}
    </Box>
  );
};

export default ProductosCarrusel;
