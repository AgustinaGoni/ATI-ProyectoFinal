import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "../hooks/useCart";
import {
  Box,
  Button,
  Card,
  CardBody,
  Checkbox,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Image,
  Input,
  Select,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
  Link as ChakraLink,
  Center,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import {
  IconShoppingCart,
  IconTrashX,
} from "@tabler/icons-react";
import { useNavigate, Link as ReactRouterLink } from "react-router-dom";
import { useModal } from "../context/ModalProvider";
import { useAuth } from "../hooks/useAuth";
import { useProductos } from "../hooks/useProductos";
import { actualizarStock } from "../js/api/actualizarStock";

const Carrito = () => {
  const { estaAutenticado } = useAuth();
  const {
    carrito,
    aumentarCantidad,
    disminuirCantidad,
    eliminarDelCarrito,
  } = useCart();
  const toast = useToast();
  const { productos } = useProductos();

  const navigate = useNavigate();
  const { openLoginModal } = useModal();
  const [loading, setLoading] = useState(false); // Estado para manejar la carga

  const estaVacio = useMemo(() => carrito.length === 0, [carrito]);
  const carritoTotalPagar = useMemo(
    () =>
      carrito
        .reduce((total, item) => total + item.cantidad * item.precio, 0)
        .toFixed(),
    [carrito]
  );
  const carritoCantidadProductos = useMemo(
    () => carrito.reduce((total, item) => total + item.cantidad, 0),
    [carrito]
  );

  const validarCarritoParaAvanzar = async () => {

    try {
      setLoading(true);
      if (estaVacio) {
        return false;
      }

      if (carritoTotalPagar <= 0) {
        return false;
      }

      const precioCero = carrito.find((prod) => prod.precio === 0);
      if (precioCero) {
        return false;
      }

      const stockActualizado = await actualizarStock(); // Espera la actualización
      if (!stockActualizado) {
        return false; 
      } else {
        return true;
      }
      return true;
    } catch (error) {
      console.error("Error al validar el carrito:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al validar el carrito.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="1280px" my={10} px={5}>
      <Heading
        textAlign={"center"}
        lineHeight={1.1}
        fontWeight={600}
        fontSize={{ base: "2xl", sm: "3xl", lg: "5xl" }}
      >
        Mi carrito
      </Heading>
      {estaVacio ? (
        <Flex direction="column" alignItems="center" textAlign="center" mt={12}>
          <Box>
            <IconShoppingCart width="64" height="64" />
          </Box>
          <Text display="block" fontWeight="semibold" fontSize="lg" p={5}>
            Tu carrito está vacío
          </Text>
        </Flex>
      ) : (
        <Grid
          templateColumns={"repeat(12, 1fr)"}
          gap={6}
          mt={8}
          p={6}
          rounded={8}
          boxShadow="lg"
          height="fit-content"
        >
          <GridItem colSpan={{ base: 12, lg: 7 }}>
            <>
              <Box>
                <Heading py={2} fontSize={"lg"}>
                  Detalle de la orden
                </Heading>
              </Box>
              <TableContainer display={{ base: "none" }}>
                <Table size="md">
                  <Thead>
                    <Tr>
                      <Th
                        textAlign={"center"}
                        fontWeight={"bold"}
                        fontSize="sm"
                        pl={0}
                      >
                        Producto
                      </Th>
                      <Th
                        textAlign={"center"}
                        fontWeight={"bold"}
                        fontSize="sm"
                        pl={0}
                      >
                        Cantidad
                      </Th>
                      <Th
                        textAlign={"center"}
                        fontWeight={"bold"}
                        fontSize="sm"
                        pl={0}
                      >
                        Precio C/U
                      </Th>
                      <Th
                        textAlign={"center"}
                        fontWeight={"bold"}
                        fontSize="sm"
                        pl={0}
                      >
                        Total
                      </Th>
                      <Th
                        textAlign={"center"}
                        fontWeight={"bold"}
                        fontSize="sm"
                        pl={0}
                      ></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {carrito.map((producto) => (
                      <Tr key={producto.id}>
                        <Td fontSize="sm" pl={0}>
                          <Box
                            boxSize={"40px"}
                            display={"flex"}
                            justifyContent={{ base: "center", md: "start" }}
                            alignItems={"center"}
                            gap={3}
                            w={"auto"}
                          >
                            <Image
                              src={`data:image/jpeg;base64,${producto.imagen}`}
                              alt={`Imagen del producto ${producto.nombre}`}
                              objectFit={"contain"}
                              w={"40px"}
                              h={"40px"}
                            />
                            <ChakraLink
                              as={ReactRouterLink}
                              fontSize={{ base: "sm", sm: "md" }}
                              fontWeight={"medium"}
                              lineHeight="1.2"
                              mb={2}
                              whiteSpace="normal"
                              overflowWrap="break-word"
                              to={`/producto/${producto.nombre}/${producto.id}`}
                            >
                              {producto.nombre}
                            </ChakraLink>
                          </Box>
                        </Td>
                        <Td fontSize="sm" pl={0}>
                          <Flex alignItems={"center"} justifyContent={"center"}>
                            <Button
                              size="xs"
                              onClick={() => disminuirCantidad(producto)}
                            >
                              -
                            </Button>
                            <Text w={"32px"} textAlign={"center"}>
                              {producto.cantidad}
                            </Text>
                            <Button
                              size="xs"
                              onClick={() => aumentarCantidad(producto)}
                            >
                              +
                            </Button>
                          </Flex>
                        </Td>
                        <Td textAlign={"center"} pl={0}>
                          $ {producto.precio}
                        </Td>
                        <Td pl={0}>$ {producto.precio * producto.cantidad}</Td>
                        <Td pl={0}>
                          <Button
                            bg={"none"}
                            _hover={{
                              bg: "none",
                              color: "red",
                            }}
                            aria-label="Icono para eliminar el producto del carrito"
                            onClick={() => eliminarDelCarrito(producto)}
                          >
                            x
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
              <Box display={{ base: "block" }}>
                {carrito.map((producto) => (
                  <Card
                    key={producto.id}
                    bg={"none"}
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
                      <Flex
                        w={"full"}
                        flexDirection={"column"}
                      >
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
                          <Flex flexDirection={"column"}>
                            <Text
                              color={"gray.500"}
                              fontSize={{ base: "xs", lg: "sm" }}
                            >
                              $ {producto.precio} c/u
                            </Text>
                            <Text
                              color="blue.600"
                              fontSize={{ base: "md", lg: "xl" }}
                            >
                              $ {producto.precio * producto.cantidad}
                            </Text>
                          </Flex>
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
                      </Flex>
                    </CardBody>
                  </Card>
                ))}
              </Box>
            </>
          </GridItem>
          {carrito.length !== 0 ? (
            <>
              <GridItem colSpan={1} display={{ base: "none", lg: "block" }}>
                <Center height="100%">
                  <Divider orientation="vertical" />
                </Center>
              </GridItem>
              <GridItem colSpan={{ base: 12, lg: 4 }}>
                <Box>
                  <Heading py={2} fontSize={"lg"}>
                    Resumen
                  </Heading>
                </Box>
                <Flex
                  direction="column"
                  gap={4}
                  fontSize="sm"
                >
                  <Flex
                    flexDirection={"row"}
                    justifyContent={"space-between"}
                    borderBottom={"1px"}
                    borderColor={"gray.100"}
                    mb={4}
                    fontWeight={"bold"}
                  >
                    <Text py={3}>Cantidad de productos:</Text>
                    <Box as="span" py={3}>
                      {carritoCantidadProductos}
                    </Box>
                  </Flex>
                  <Flex
                    flexDirection={"row"}
                    justifyContent={"space-between"}
                    borderBottom={"1px"}
                    borderColor={"gray.100"}
                    mb={4}
                    fontWeight={"bold"}
                  >
                    <Text py={3}>Total a pagar:</Text>

                    <Box as="span" fontWeight="bold" py={3}>
                      $ {carritoTotalPagar}
                    </Box>
                  </Flex>
                  <Button
                    variant={"solid"}
                    isDisabled={loading}
                    color={"botonColor"}
                    bg={"botonBg"}
                    _hover={{
                      transition: "all 1s ease-out",
                      border: "1px solid",
                      borderColor: "botonBg",
                      bg: "botonColor",
                      color: "botonBg",
                    }}
                    size={{ base: "sm" }}
                    onClick={ async () => {
                      if (localStorage.getItem("token") === null) {
                        openLoginModal();
                      } else {
                        const puedeAvanzar = await validarCarritoParaAvanzar(); // Espera a que se valide

                        if (puedeAvanzar && estaAutenticado) {
                          navigate("/realizar-pedido"); 
                        } else {
                          toast({
                            title: "Hubo un error",
                            description: "Contactese con soporte técnico.",
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                            position: "top",
                          });
                        }
                      }
                    }}
                  >
                      {loading ?<> <Spinner size="sm" /> <Text ml={4}>Preparando todo para finalizar la compra </Text> </> : "Finalizar compra"} 
                  </Button>
                  <Button
                    mt={4}
                    size={{ base: "xs", md: "sm" }}
                    variant="link"
                    color={"primary"}
                    fontWeight={600}
                    onClick={() => {
                      navigate("/");
                    }}
                  >
                    Seguir comprando
                  </Button>
                </Flex>
              </GridItem>
            </>
          ) : null}
        </Grid>
      )}
    </Container>
  );
};

export default Carrito;
