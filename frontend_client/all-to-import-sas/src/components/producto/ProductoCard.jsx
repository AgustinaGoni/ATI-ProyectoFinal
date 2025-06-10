import React from "react";
import {
  Box,
  Button,
  FormControl,
  Heading,
  Input,
  SimpleGrid,
  Text,
  Flex,
  Card,
  CardBody,
  Image,
  Stack,
  Select,
  Skeleton,
  Link as ChakraLink,
  useToast,
  IconButton,
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import { IconShoppingCartPlus, IconShoppingCartX } from "@tabler/icons-react";
import { useCart } from "../../hooks/useCart";
import { validarStockPrecio } from "../../js/api/productos/validarStockPrecio";
const ProductoCard = ({ productosAMostrar }) => {
  const { agregarAlCarrito, carrito, eliminarDelCarrito } = useCart();
  const toast = useToast();

  const productoEnElCarrito = (producto) => {
    return carrito.some((item) => item.id === producto.id);
  };

  const handleAgregarAlCarrito = (producto) => {
    if (!validarStockPrecio(producto.stock, producto.precio)) {
      toast({
        position: "top",
        title: "No disponible",
        description: "El producto que intentas agregar no esta disponible.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    } else {
      agregarAlCarrito(producto); // Asegúrate de pasar la cantidad correcta
    }
  };

  return (
    <>
      <Card
        mt={8}
        key={productosAMostrar.id}
        rounded={"md"}
        overflow="hidden"
        boxShadow="md"
        w={{base:'auto',lg:"220px"}}
        h={"300px"}
      >
        <CardBody
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          p={2}
        >
          <Box boxSize="120px" display="flex" justifyContent="center" w="auto">
            <Image
              src={`data:image/jpeg;base64,${productosAMostrar.imagen}`}
              alt={`Imagen del producto ${productosAMostrar.nombre}`}
              objectFit="contain"
            />
          </Box>
          <Box px={{ base: 0, sm: 2 }}>
            <Box mb={4} width="full">
              <ChakraLink
                as={ReactRouterLink}
                fontSize={{ base: "sm", sm: "md" }}
                fontWeight={"500"}
                lineHeight="1.2"
                mb={2}
                whiteSpace="normal"
                overflowWrap="break-word"
                to={`/producto/${productosAMostrar.nombre}/${productosAMostrar.id}`}
              >
                {productosAMostrar.nombre}
              </ChakraLink>
            </Box>
            <Stack
              justifyContent="space-between"
              alignItems={{base:'center', md:'start'}}
              direction={{base:"row", md:"column"}}
              spacing={2}
            >
              <Text color={"#003459"} fontSize="md">
                $ {productosAMostrar.precio}
              </Text>
              {productoEnElCarrito(productosAMostrar) ? (
                <>
                  <Button
                    rightIcon={<IconShoppingCartX />}
                    display={{ base: "none", md: "inherit" }}
                    size="xs"
                    py={4}
                    w={'100%'}

                    variant={"quitarDelCarrito"}
                    onClick={() => eliminarDelCarrito(productosAMostrar)}
                  >
                    Quitar del carrito
                  </Button>
                  <IconButton
                    display={{ base: "inherit", md: "none" }}
                    icon={<IconShoppingCartX />}
                    size="xs"
                    p={4}
                    variant={"quitarDelCarrito"}
                    onClick={() => eliminarDelCarrito(productosAMostrar)}
                  />
                </>
              ) : (
                <>
                  <Button
                    rightIcon={<IconShoppingCartPlus />}
                    w={'100%'}
                    display={{ base: "none", md: "inherit" }}
                    size="xs"
                    py={4}
                    variant={"primary"}
                    onClick={() => handleAgregarAlCarrito(productosAMostrar)}
                  >
                    Agregar al carrito
                  </Button>
                  <IconButton
                    display={{ base: "inherit", md: "none" }}
                    icon={<IconShoppingCartPlus />}
                    variant={"primary"}
                    p={4}
                    size="xs"
                    onClick={() => handleAgregarAlCarrito(productosAMostrar)}
                  />
                </>
              )}
            </Stack>
          </Box>
        </CardBody>
      </Card>
      {/* ))} */}
      {/* </SimpleGrid> */}
    </>
  );
};

export default ProductoCard;
