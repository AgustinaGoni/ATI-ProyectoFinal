import React from "react";
import {
  Flex,
  Box,
  Heading,
  Text,
  List,
  ListItem,
  ListIcon,
  Button,
  Spinner,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { IconShoppingCart } from "@tabler/icons-react";

const CardGenericoProducto = ({
  loading,
  titulo = "Titulo",
  cantidad = 0,
  items = [],
  linkTo = "/",
  textoBoton = "",
  icono = IconShoppingCart,
  noHayDatos = "",
}) => {
  return (
    <Flex
      flexDirection={"column"}
      bg={"gray.100"}
      boxShadow="md"
      px={4}
      justifyContent={"start"}
      alignItems={'stretch'}
      h={"full"}
    >
      {loading ? (
        <Flex justifyContent="center" alignItems="center" py={8}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Flex>
      ) : (
        <>
          <Flex
            columnGap={4}
            my={4}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Flex columnGap={2}>
              <Heading as={"h2"} size={"md"}>
                {titulo}
              </Heading>
            </Flex>
            <Box fontSize="3xl" fontWeight="bold">
              <Text>{cantidad}</Text>
            </Box>
          </Flex>
          {cantidad === 0 ? (
            <Text color={"gray"}>{noHayDatos}</Text>
          ) : (
            <>
              <Text color={"gray"}>Productos</Text>
              <List spacing={1}>
                {items.slice(-3).map((item) => (
                  <ListItem key={item.id}>
                    <ListIcon as={icono} color="green.500" />
                      {item.nombre}
                  </ListItem>
                ))}
              </List>
            </>
          )}
          <Flex columnGap={4} my={6}>
            <Button
              as={RouterLink}
              textDecoration={"none"}
              variant={"link"}
              to={linkTo}
            >
              {textoBoton}
            </Button>
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default CardGenericoProducto;
