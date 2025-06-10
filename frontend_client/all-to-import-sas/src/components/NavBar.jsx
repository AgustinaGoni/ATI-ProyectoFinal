import {
  Box,
  Flex,
  Link as ChakraLink,
  MenuButton,
  MenuItem,
  MenuList,
  Menu,
  Button,
  Container,
  Text,
  LinkBox,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { obtenerCategorias } from "../js/api/categorias/obtenerCategorias";

const NavBar = ({ onCloseDrawer }) => {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const datos = await obtenerCategorias();
      setCategorias(datos);
    } catch (error) {
      console.error("Error obteniendo las categorías:", error);
    }
  };

  const categoriasFiltradas = categorias.filter(
    (categoria) => categoria.nombre !== "Sin Categoría"
  );

  // Obtener las primeras 5 categorías
  const categoriasPrincipales = categoriasFiltradas.slice(0, 5);


  const handleCategoriaClick = () => {
    if (onCloseDrawer) {
      onCloseDrawer();
    }
  };
  return (
    <>
      <Box as="nav" bg="background2" px={{ base: "6", lg: "0" }} w="100%">
        <Container maxW="1280px" p={{ base: 0, lg: "inherit" }}>
          <Flex
            alignItems={{ base: "start", lg: "center" }}
            justifyContent={{ base: "start", lg: "start" }}
            flexDirection={{ base: "column", lg: "row" }}
            gap={{ base: "4", lg: "8" }}
            py={{ base: "8", lg: "3" }}
            px={{ base: "0", lg: "5" }}
            color="white"
          >

            <Text
              display={{ base: "block", lg: "none" }}
              w="100%"
              pb="2"
              borderBottom="1px"
              textTransform="uppercase"
              fontSize={20}
            >
              Categorías
            </Text>
            {categorias.length > 0 && (
              <Menu>
                <MenuButton
                  display={{ base: "none", lg: "inline" }}
                  w={{ base: "100%", lg: "auto" }}
                >
                  <Text as="span" pr={{ base: 2, lg: 4 }}>
                    Todas las categorías
                  </Text>
                </MenuButton>

                <MenuList>
                  <MenuItem
               
                    as={RouterLink}
                    to="/productos"
                    color={"black"}
                  >
                    Ver todos los productos
                  </MenuItem>
                  {categoriasFiltradas.map((categoria) => (
                    <MenuItem
                      color={"black"}
                      key={categoria.id}
                      as={RouterLink}
                      to={`/categoria/${categoria.nombre}/${categoria.id}`}
                      onClick={() => handleCategoriaClick()}
                    >
                      {categoria.nombre}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            )}

            {categoriasPrincipales.map((categoria) => (
              <ChakraLink
                key={categoria.id}
                as={RouterLink}
                to={`/categoria/${categoria.nombre}/${categoria.id}`}
                display={{ base: "none", lg: "inline" }}
                w={{ base: "100%", lg: "auto" }}
                pb={{ base: "2", lg: "0" }}
                borderBottom={{ base: "1px", lg: "0" }}
                pr={{ base: 2, lg: 4 }} 
                onClick={() => handleCategoriaClick()}
              >
                {categoria.nombre}
              </ChakraLink>
            ))}
            <ChakraLink
              as={RouterLink}
            to="/productos"
              display={{ base: "block", lg: "none" }}
              w={{ base: "100%", lg: "auto" }}
              pb={{ base: "2", lg: "0" }}
              borderBottom={{ base: "1px", lg: "0" }}
              pr={{ base: 2, lg: 4 }} 
              onClick={() => handleCategoriaClick()}
            >
              Ver todos los productos
            </ChakraLink>
            {categoriasFiltradas.map((categoria) => (
              <ChakraLink
                key={categoria.id}
                as={RouterLink}
              to={`/categoria/${categoria.nombre}/${categoria.id}`}
                display={{ base: "block", lg: "none" }}
                w={{ base: "100%", lg: "auto" }}
                pb={{ base: "2", lg: "0" }}
                borderBottom={{ base: "1px", lg: "0" }}
                pr={{ base: 2, lg: 4 }} 
                onClick={() => handleCategoriaClick()}
              >
                {categoria.nombre}
              </ChakraLink>
            ))}
          </Flex>
        </Container>
      </Box>
    </>
  );
};

export default NavBar;