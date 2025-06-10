import React from "react";
import {
  Box,
  Heading,
  Flex,
  List,
  ListItem,
  Link,
  Text,
  Container,
  Image,
  Icon,
  ScaleFade,
  Tooltip,
  Grid,
  GridItem,
  Divider,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { IconBrandFacebook, IconBrandInstagram } from "@tabler/icons-react";
import { useAuth } from "../../hooks/useAuth";
import { useModal } from "../../context/ModalProvider";
const Footer = () => {
  const navigate = useNavigate();
  const { openSignupModal } = useModal();



  return (
    <Box as="footer" bg="background2" py={10} fontSize="0.875rem">
      <Container maxW="1280px" marginX="auto" px={0}>
        <Flex
          flexDirection={{ base: "column", md: "row" }}
          alignItems="start"
          px={{ base: "16px" }}
        >
          <Box w={{ base: "100%" }} mb={{ base: "1.5rem", lg: "0" }}>
            <Heading
              as="h5"
              color="secondary"
              mb="0.5rem"
              fontSize="md"
              fontWeight="semibold"
              textTransform={"uppercase"}
            >
              All To Import
            </Heading>
            <Flex flexDirection={'column'} lineHeight="2">
              <ChakraLink
                as={RouterLink}
                color="secondary"
                _hover={{  color:"teal.500"  }}
                to="/"
              >
                Inicio
              </ChakraLink>
              <ChakraLink
                as={RouterLink}
                color="secondary"
                _hover={{  color:"teal.500"  }}
                to={""}
              >
                Sobre Nosotros
              </ChakraLink>
              <ChakraLink
                as={RouterLink}
                color="secondary"
                _hover={{  color:"teal.500"  }}
                to="/contacto"
              >
                Contacto
              </ChakraLink>
            </Flex>
          </Box>
          <Box w={{ base: "100%" }} mb={{ base: "1.5rem", lg: "0" }}>
            <Heading
              as="h5"
              color="secondary"
              mb="0.5rem"
              fontSize="md"
              fontWeight="semibold"
              textTransform={"uppercase"}
            >
              Compra
            </Heading>
            <Flex flexDirection={'column'} lineHeight="2">
              <ChakraLink
                as={RouterLink}
                color="secondary"
                _hover={{ color:"teal.500" }}
                to="/como-comprar"
              >
                ¿Cómo comprar?
              </ChakraLink>
              <ChakraLink
                as={RouterLink}
                color="secondary"
                _hover={{  color:"teal.500"  }}
                to="/formas-envio"
              >
                Formas de Envío
              </ChakraLink>
            </Flex>
          </Box>
          <Box w={{ base: "100%" }} mb={{ base: "1.5rem", lg: "0" }}>
            <Heading
              as="h5"
              color="secondary"
              mb="0.5rem"
              fontSize="md"
              fontWeight="semibold"
              textTransform={"uppercase"}
            >
              Paga seguro
            </Heading>
            <Text color={"secondary"}>
              Ofrecemos el servicio de Mercado Pago para que tus datos de compra
              estén protegidos
            </Text>
          </Box>
        </Flex>
        <Grid
          templateColumns={{ base: "1fr", md: "auto 1fr" }}
          alignItems="center"
          gap={4}
          mt={{ base: 0, md: 8 }}
          px={{ base: "16px" }}
          color={"secondary"}
        >
          <GridItem order={{ base: 1, md: 2 }}>
            <Flex justifyContent={{ base: "center", md: "end" }} columnGap={3}>
              <Tooltip
                label="All To Import en Facebook"
                bg={"gray.200"}
                color={"primary"}
              >
                <Link
                  href={
                    "https://www.facebook.com/p/ALL-To-Import-SAS-61554711303884/"
                  }
                  isExternal
                >
                  <Box
                    transition="transform 0.3s ease-in-out"
                    _hover={{
                      color: "#3B5998",
                      transform: "scale(1.1)",
                    }}
                  >
                    <IconBrandFacebook
                      stroke={1}
                      height={"32px"}
                      width={"32px"}
                    />
                  </Box>
                </Link>
              </Tooltip>
              <Tooltip
                label="All To Import en Instagram"
                bg={"gray.200"}
                color={"primary"}
              >
                <Link
                  href={"https://www.instagram.com/alltoimport/"}
                  isExternal
                >
                  <Box
                    transition="transform 0.3s ease-in-out"
                    _hover={{
                      color: "#DD2A7B",
                      transform: "scale(1.1)",
                    }}
                  >
                    <IconBrandInstagram
                      stroke={1}
                      height={"32px"}
                      width={"32px"}
                    />
                  </Box>
                </Link>
              </Tooltip>
            </Flex>
          </GridItem>
          <GridItem order={{ base: 2, md: 1 }}>
            <Text fontSize={{ base: "xs", md: "sm" }}>
              All To Import SAS &copy; {new Date().getFullYear()} | Todos los
              derechos reservados.
            </Text>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

const LinkItem = ({ text, isTag = false, tagText, href }) => {
  return (
    <ListItem>
      <Link href={href} color="secondary" _hover={{  color:"teal.500"  }}>
        {text}
      </Link>
      {isTag && (
        <Text
          as="span"
          ml="0.25rem"
          px="0.25rem"
          fontSize="0.5rem"
          bg="gray.100"
          color="gray.600"
        >
          {tagText}
        </Text>
      )}
    </ListItem>
  );
};

export default Footer;
