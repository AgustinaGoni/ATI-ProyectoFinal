import React from "react";
import {
  Flex,
  Box,
  Heading,
  Text,
} from "@chakra-ui/react";
import { IconCircleOff, IconShoppingCart } from "@tabler/icons-react";

const CardGenerico = ({
  titulo = "Titulo",
  descripcion = "Descripción",
  icono = IconCircleOff,
}) => {
  return (
    <Flex
      flexDirection={"column"}
      rounded={8}
      gap={4}
      color={"background"}
      bg={"primary"}
      justifyContent={"center"}
      alignItems={"center"}
      w={{ base: "auto", md: "350px" }}
      p={4}
      shadow={'lg'}
    >
      <Box
      >
        {icono}
      </Box>
      <Heading
        as={"h3"}
        textAlign={"center"}
        fontWeight={600}
        fontSize={{ base: 'lg', lg: "xl" }}
      >
        {titulo}
      </Heading>
      <Text h={"50px"} textAlign={"center"} fontSize={{ base: "xs", lg: "sm" }}>
        {descripcion}
      </Text>
    </Flex>
  );
};

export default CardGenerico;
