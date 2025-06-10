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
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { IconShoppingCart } from "@tabler/icons-react";
import { formatearFecha } from "../../js/formatearFecha";

const CardGenerico = ({
  loading,
  titulo = "Titulo",
  cantidad = 0,
  items = [],
  linkItem = "/",
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
              <Text color={"gray"}>Últimas 3 ventas</Text>
              <List spacing={1}>
                {items.slice(-3).map((item) => (
                  <ListItem key={item.id}>
                    <ListIcon as={icono} color="green.500" />
                    <RouterLink to={`${linkItem}${item.id}`}>
                      {item.id} | {formatearFecha(item.fechaCompra)}
                    </RouterLink>
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

export default CardGenerico;
