import {
  Box,
  Container,
  Flex,
  Link as ChakraLink,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useModal } from "../../context/ModalProvider";
import { useNavigate, Link as RouterLink } from "react-router-dom";

const NavBarInfo = ({ onCloseDrawer }) => {
  const { openSignupModal } = useModal();
  const { estaAutenticado } = useAuth();

  const handleRegistrarse = () => {
    if (onCloseDrawer) {
      onCloseDrawer();
    }
    openSignupModal();
  };

  return (
    <Box
      as="nav"
      px={{ base: "6", lg: "8" }}
      w="100%"
    >
      <Container maxW="1280px" p={{ base: 0, lg: "inherit" }}>
        <Flex
          alignItems={{ base: "start", lg: "center" }}
          justifyContent={{ base: "start", lg: "center" }}
          flexDirection={{ base: "column", lg: "row" }}
          gap={{ base: "4", lg: "8" }}
          py={2}
          color="primary"
          fontSize="sm"
          w="auto"
        >
          <Text
            display={{ base: "block", lg: "none" }}
            w="100%"
            pb="2"
            textTransform="uppercase"
            fontSize={20}
          >
            La empresa
          </Text>
          <ChakraLink as={RouterLink} to="/">
            Inicio
          </ChakraLink>
          <ChakraLink as={RouterLink} to={"/sobre-nosotros"}>
            Sobre Nosotros
          </ChakraLink>
          <ChakraLink
            as={RouterLink}
            to="/como-comprar"
            // onClick={handleComoComprarClick}
          >
            ¿Cómo comprar?
          </ChakraLink>
          <ChakraLink
            as={RouterLink}
            to="/formas-envio"
            // onClick={handleFormasEnvioClick}
          >
            Formas de Envío
          </ChakraLink>
          {!estaAutenticado && (
            <ChakraLink onClick={handleRegistrarse}>Registrarse</ChakraLink>
          )}
          <ChakraLink
            as={RouterLink}
            to="/contacto"
            // onClick={handleContactoClick}
          >
            Contacto
          </ChakraLink>
        </Flex>
      </Container>
    </Box>
  );
};

export default NavBarInfo;
