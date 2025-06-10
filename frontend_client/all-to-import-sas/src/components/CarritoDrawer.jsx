import React, { useMemo } from "react";
import {
  Box,
  Flex,
  Heading,
  Button,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerCloseButton,
  Text,
  Card,
  CardBody,
  Stack,
  Image,
  ButtonGroup,
} from "@chakra-ui/react";
import { IconShoppingCart, IconTrashX } from "@tabler/icons-react";
import { useCart } from "../hooks/useCart";
import { Link, useNavigate } from "react-router-dom";

const Carrito = ({ isOpen, onClose }) => {
  const {
    carrito,
    limpiarCarrito,
    aumentarCantidad,
    disminuirCantidad,
    eliminarDelCarrito,
  } = useCart();

  const estaVacio = useMemo(() => carrito.length === 0, [carrito]);
  const carritoTotalPagar = useMemo(
    () =>
      carrito
        .reduce((total, item) => total + item.cantidad * item.precio, 0)
        .toFixed(),
    [carrito]
  );

  const navigate = useNavigate();
  return (
    <Drawer
      isOpen={isOpen}
      placement={"right"}
      onClose={onClose}
      size={{ md: "md" }}
      maxHeight={"100vh"}
    >
      <DrawerOverlay />
      <DrawerContent display="flex" flexDirection="column">
        <DrawerHeader
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={4}
          borderBottomWidth="1px"
          py={8}
          fontSize="2xl"
          fontWeight={"semibold"}
          zIndex={1200}
        >
          Mi carrito
          <DrawerCloseButton
            position="inherit"
            color="black"
            border="2px"
            borderColor="black"
            borderRadius="50%"
          />
        </DrawerHeader>
        <DrawerBody flex="1" overflowY="auto" px={{ base: 0, md: 3 }}>
          {estaVacio ? (
            <Flex
              direction="column"
              alignItems="center"
              textAlign="center"
              py={4}
            >
              <Box>
                <IconShoppingCart width="64" height="64" />
              </Box>
              <Text display="block" fontWeight="semibold" fontSize="lg" p={5}>
                Tu carrito está vacío
              </Text>
              <Button onClick={() => (navigate("/"), onClose())}>
                Ir a comprar
              </Button>
            </Flex>
          ) : (
            <Box>
              {carrito.map((producto) => (
                <Card
                  key={producto.id}
                  borderBottom="1px"
                  borderColor={"gray.200"}
                  borderRadius={0}
                  boxShadow="none"
                  mb={4}
                >
                  <CardBody
                    p={3}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    gap={3}
                  >
                    <Box
                      boxSize={"80px"}
                      display={"flex"}
                      justifyContent={"center"}
                      w={"auto"}
                    >
                      <Image
                        src={`data:image/jpeg;base64,${producto.imagen}`}
                        alt={`Imagen del producto ${producto.nombre}`}
                        objectFit={"contain"}
                        w={"80px"}
                        h={"80px"}
                      />
                    </Box>
                    <Box w={"full"} px={{ base: 3, sm: 5 }}>
                      <Box mb={6} h={"32px"}>
                        <Heading
                          as="h3"
                          fontSize={{ base: "xs", sm: "md" }}
                          fontWeight="bold"
                        >
                          {producto.nombre}
                        </Heading>
                        <Text
                            fontSize={{ base: "xs", sm: "md" }}
                            color={"gray.500"}
                          >
                            Cod. {producto.codigo}
                          </Text>
                      </Box>
                      <Stack
                        justifyContent="space-between"
                        alignItems={"center"}
                        direction="row"
                        spacing={{ base: 2, sm: 0 }}
                      >
                        <Flex gap={"3"}>
                          <Button
                            size="xs"
                            onClick={() => disminuirCantidad(producto)}
                          >
                            -
                          </Button>
                          <Text>{producto.cantidad}</Text>
                          <Button
                            size="xs"
                            onClick={() => aumentarCantidad(producto)}
                          >
                            +
                          </Button>
                        </Flex>
                        <Text color="blue.600" fontSize="xl">
                          $ {producto.precio * producto.cantidad}
                        </Text>
                        <IconButton
                            aria-label="Eliminar producto del carrito"
                            icon={<IconTrashX />}
                            bg={"none"}
                            _hover={{
                              bg: "none",
                              color: "red.600",
                            }}                            
                            onClick={() => eliminarDelCarrito(producto)}
                          />
                      </Stack>
                    </Box>
                  </CardBody>
                </Card>
              ))}
            </Box>
          )}         
        </DrawerBody>

        {carrito.length !== 0 ? (
          <DrawerFooter
            flexDirection={"column"}
            gap={6}
            justifyContent="space-around"
            borderTopWidth="1px"
          >
            <Flex justifyContent={"space-evenly"} w={"50%"}>
              <Text fontSize="lg">Total:</Text>
              <Text fontWeight="bold" fontSize="lg">
                $ {carritoTotalPagar}
              </Text>
            </Flex>
            <ButtonGroup w={"100%"} justifyContent="space-between">
              <Button
                size={{ base: "xs", md: "sm" }}
                variant="link"
                color={'primary'}
                fontWeight={600}
                onClick={() => {
                  navigate("/");
                  onClose();
                }}
              >
                Seguir comprando
              </Button>
              <Button
              as={Link}
              to={"/mi-carrito"}
              textDecoration={'none'}
                variant={"solid"}
                color={"botonColor"}
                bg={"botonBg"}
                _hover={{
                  transition: "all .5s ease-out",
                  border: "1px solid",
                  borderColor: "botonBg",
                  bg: "botonColor",
                  color: "botonBg",
                }}
                size={{ base: "sm" }}
                onClick={() => {
                  onClose();
                }}
              >
                Ver carrito
              </Button>
            </ButtonGroup>
          </DrawerFooter>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
};

export default Carrito;
