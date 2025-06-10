import React from "react";
import Slider from "react-slick";
import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Skeleton,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useCategorias } from "../../hooks/useCategorias";
import CategoriaCard from "./CategoriaCard";

const CategoriaCarrusel2 = () => {
  const { categorias, loading } = useCategorias();
  const categoriasFiltradas = categorias.filter(
    (categoria) => categoria.nombre !== "Sin Categoría"
  );
  const breakpoints = useBreakpointValue({ base: 2, sm: 3, md: 4, lg: 5 });

  const settings = {
    dots: true,
    infinite: true,
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

  return (
    <Box mt={16}>
      <Heading
        lineHeight="tall"
        textTransform="uppercase"
        fontSize={{ base: "xl", lg: "3xl" }}
        textAlign={"center"}
        mb={8}
      >
          Categorías
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
        <Slider {...settings}>
          {categoriasFiltradas.map((categoria) => (
            <CategoriaCard nombre={categoria.nombre} />
          ))}
        </Slider>
      )}
    </Box>
  );
};

export default CategoriaCarrusel2;
