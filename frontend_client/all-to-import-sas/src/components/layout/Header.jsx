import React from "react";
// import CartIcon from "./icons/CartIcon";
import {
  Box,
  Flex,
  Heading,
  useDisclosure,
  Container,
  IconButton,
  Link as ChakreLink
} from "@chakra-ui/react";
import NavBar from "../NavBar";
import Buscador from "../Buscador";
import CarritoDrawer from "../CarritoDrawer";
import NavbarDrawer from "../NavbarDrawer";
import Login from "../Login";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { IconMenuDeep, IconShoppingCart } from "@tabler/icons-react";
import UsuarioProvider from "../../context/UsuarioProvider";

const Header = () => {
  const {
    isOpen: isDrawerMenuOpen,
    onOpen: onDrawerMenuOpen,
    onClose: onDrawerMenuClose,
  } = useDisclosure();

  const {
    isOpen: isDrawerCarritoOpen,
    onOpen: onDrawerCarritoOpen,
    onClose: onDrawerCarritoClose,
  } = useDisclosure();

  return (
    <>
      {/* <UsuarioProvider> */}
      <Box
        as="header"
        color={{ base: "secondary", lg: "primary" }}
        gridArea="header"
        width="100%"
        position="sticky"
        top={0}
        zIndex="1000"
        bg={{ base: "background2", lg: "background" }}
      >
        <Container maxW="1280px" p={{ base: 0, md: "inherit" }}>
          <Flex
            mx="auto"
            alignItems="center"
            justifyContent="space-between"
            py={5}
            px={{ base: 5 }}
          >
            <Flex alignItems="center" gap={2}>
              <IconButton
                icon={<IconMenuDeep />}
                bg="none"
                size="md"
                aria-label="Abrir Menu"
                display={{ base: "inherit", lg: "none" }}
                onClick={onDrawerMenuOpen}
                color={{ base: "secondary", lg: "primary" }}
                sx={{
                  transform: "scaleX(-1)",
                }}
                _hover={{
                  bg: "none",
                }}
                _focus={{
                  outline: "none",
                  boxShadow: "none",
                }}
              />
              <ChakreLink 
              as={RouterLink}
              to='/'
              _hover={{
                textDecoration:'none'
              }}
              >
                <Heading as="h1" size={{ base: "md", lg: "lg" }}>
                  All To Import
                </Heading>
              </ChakreLink>
            </Flex>
            <Box display={{ base: "none", lg: "block" }}>
              <Buscador />
            </Box>
            <Flex alignItems={"center"} gap={6}>
              <Box display={{ base: "block", lg: "none" }}>
                <Buscador />
              </Box>
              <Box display={{ base: "none", lg: "block" }}>
                <Login />
              </Box>
              <IconButton
                icon={<IconShoppingCart />}
                bg="none"
                size="md"
                aria-label={"Icono del carrito de compras"}
                onClick={onDrawerCarritoOpen}
                color={{ base: "secondary", lg: "primary" }}
                _hover={{
                  bg: "none",
                }}
              ></IconButton>
            </Flex>
          </Flex>
        </Container>
        <Box display={{ base: "none", lg: "inherit" }}>
          <NavBar />
        </Box>
      </Box>

      <NavbarDrawer
        isDrawerMenuOpen={isDrawerMenuOpen}
        onDrawerMenuClose={onDrawerMenuClose}
      />
      <CarritoDrawer
        isOpen={isDrawerCarritoOpen}
        onClose={onDrawerCarritoClose}
      />
      {/* </UsuarioProvider> */}
    </>
  );
};

export default Header;
