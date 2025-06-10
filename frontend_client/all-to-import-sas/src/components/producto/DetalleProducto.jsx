import React, { useState, useEffect } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import {
  Container,
  Grid,
  GridItem,
  Box,
  Image,
  Heading,
  Text,
  Flex,
  Button,
  IconButton,
  Input,
  Divider,
  Link as ChakraLink,
  Center,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useToast,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useCart } from "../../hooks/useCart";
import Cargando from "../Cargando";
import { obtenerProductoPorId } from "../../js/api/productos/obtenerProductoPorId";
import {
  IconMinus,
  IconPlus,
  IconShoppingCartPlus,
  IconShoppingCartX,
  IconTruck,
} from "@tabler/icons-react";
import { capitalizarPrimeraLetraPalabra } from "../../utils/custom-theme/capitalizarPrimeraLetraPalabra";
import MercadoPagoLogo from "/img/mercado-pago-logo-vector-2023-optimizado.svg";
import { metodosDePagoMP } from "../../js/api/metodosDePagoMP";
import { validarStockPrecio } from "../../js/api/productos/validarStockPrecio";

const DetalleProducto = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [metodosPago, setMetodosPago] = useState([]);
  const [tarjetasCredito, setTarjetasCredito] = useState([]);
  const [tarjetasDebito, setTarjetasDebito] = useState([]);
  const [redesCobranza, setRedesCobranza] = useState([]);
  const [cantidad, setCantidad] = useState(1);
  const [deshabilitarBoton, setDeshabilitarBoton] = useState(false);
  const [producto, setProducto] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    imagen: "",
    precio: "",
    stock: "",
    categoria: { nombre: "" },
  });
  const [errores, setErrores] = useState({
    cantidad: "",
  });

  const {
    carrito,
    agregarAlCarrito,
    eliminarDelCarrito,
  } = useCart();
  const toast = useToast();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const producto = await obtenerProductoPorId(id);
        producto.nombre = capitalizarPrimeraLetraPalabra(producto.nombre);
        setProducto(producto);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const metodos = await metodosDePagoMP();
        setMetodosPago(metodos);
      } catch (error) {
        console.error("Error al obtener los metodos de pagos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const credito = metodosPago.filter(
      (metodo) => metodo.payment_type_id === "credit_card"
    );
    const debito = metodosPago.filter(
      (metodo) => metodo.payment_type_id === "debit_card"
    );
    const redes = metodosPago.filter(
      (metodo) => metodo.payment_type_id === "ticket"
    );

    setTarjetasCredito(credito);
    setTarjetasDebito(debito);
    setRedesCobranza(redes);
  }, [metodosPago]);

  const productoEnElCarrito = (producto) => {
    return carrito.some((item) => item.id === producto.id);
  };

  const handleCantidadChange = (e) => {
    const { name, value } = e.target;
    const nuevaCantidad = Number(value);

    if (value.trim() === "") {
      setCantidad("");
      setErrores((prev) => ({
        ...prev,
        [name]: "Debe ingresar una cantidad válida.",
      }));
      setDeshabilitarBoton(true);
    } else if (nuevaCantidad > 0 && nuevaCantidad <= producto.stock) {
      setCantidad(nuevaCantidad);
      setErrores((prev) => ({
        ...prev,
        [name]: "",
      }));
      setDeshabilitarBoton(false);
    } else {
      setErrores((prev) => ({
        ...prev,
        [name]: "Debe ingresar una cantidad válida.",
      }));
      setDeshabilitarBoton(true);
    }
  };

  const incrementarCantidad = () => {
    const nuevaCantidad = Math.min(cantidad + 1, producto.stock);
    setCantidad(nuevaCantidad);
    if (nuevaCantidad > 0 && nuevaCantidad <= producto.stock) {
      setDeshabilitarBoton(false);
      setErrores((prev) => ({
        ...prev,
        cantidad: "",
      }));
    }
  };

  const decrementarCantidad = () => {
    const nuevaCantidad = Math.max(cantidad - 1, 1);
    setCantidad(nuevaCantidad);
    if (nuevaCantidad > 0 && nuevaCantidad <= producto.stock) {
      setDeshabilitarBoton(false);
      setErrores((prev) => ({
        ...prev,
        cantidad: "",
      }));
    }
  };

  const handleAgregarAlCarrito = () => {
    if (!validarStockPrecio(producto.stock, producto.precio)) {
      return toast({
        position: "top",
        title: "No disponible",
        description: "El producto que intentas agregar no esta disponible.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }

    if (!cantidad) {
      setErrores((prev) => ({
        ...prev,
        cantidad: "Debe ingresar una cantidad valida.",
      }));
      return;
    }

    agregarAlCarrito({ ...producto, cantidad: cantidad >= 1 ? cantidad : 1 }); // Asegúrate de pasar la cantidad correcta
  };


  return (
    <Container maxW="1280px" px={5} my={12}>
      {loading ? (
        <Grid
          templateRows={{ base: "repeat(5, auto)", md: "repeat(5, auto)" }}
          templateColumns={{ base: "1fr", md: "2fr 1fr" }}
          gap={4}
        >
          <GridItem rowSpan={5} colSpan={1}>
            <Cargando
              columns={1}
              rows={1}
              height={{ base: "240px", md: "240px" }}
              startColor="blue.100"
            />
          </GridItem>
          <GridItem colSpan={1}>
            <Cargando
              columns={1}
              rows={1}
              width={{ base: "50%", md: "50%" }}
              height={{ base: "40px", md: "40px" }}
              startColor="blue.600"
            />
          </GridItem>
          <GridItem colSpan={1}>
            <Cargando
              columns={1}
              rows={1}
              width={{ base: "30%", md: "30%" }}
              height={{ base: "30px", md: "30px" }}
              startColor="blue.600"
            />
          </GridItem>
          <GridItem colSpan={1}>
            <Cargando
              columns={1}
              rows={1}
              width={{ base: "20%", md: "20%" }}
              height={{ base: "30px", md: "30px" }}
              startColor="blue.200"
            />
          </GridItem>
          <GridItem colSpan={1}>
            <Cargando
              columns={1}
              rows={1}
              width={{ base: "40%", md: "40%" }}
              height={{ base: "40px", md: "40px" }}
              startColor="blue.200"
            />
          </GridItem>
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <Cargando
              columns={1}
              rows={1}
              height={{ base: "100px", md: "100px" }}
              startColor="blue.100"
            />
          </GridItem>
        </Grid>
      ) : (
        <>
          <Breadcrumb mb={8} fontSize={{ base: "xs", md: "sm" }}>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              {producto.categoria && producto.categoria.id ? (
                <BreadcrumbLink href={`/categoria/${producto.categoria.id}`}>
                  {producto.categoria.nombre}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbLink href="/">Sin categoria</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <Text fontWeight={600}>{producto.nombre}</Text>
            </BreadcrumbItem>
          </Breadcrumb>
          <Grid
            templateRows={{ base: "auto", lg: "repeat(5, auto)" }}
            templateColumns={{ base: "1fr", lg: "repeat(2, auto)" }}
            gap={4}
            columnGap={{ base: 2, md: 2 }}
          >
            <GridItem rowSpan={5} colSpan={1}>
              <Box
                boxSize={{ base: "full", md: "250px", lg: "500px" }}
                display={"flex"}
                justifyContent={{ base: "center", md: "start" }}
                alignItems={"center"}
                gap={3}
                w={"auto"}
                mr={{ base: 0, md: 8 }}
                mb={{ base: 4, md: 0 }}
                border={"1px solid"}
                borderColor={"gray.200"}
                borderRadius={8}
                bg={"white"}
              >
                <Image
                  src={`data:image/jpeg;base64,${producto.imagen}`}
                  alt={`Imagen del producto ${producto.nombre}`}
                  objectFit={"contain"}
                  w={"auto"}
                  h={"auto"}
                  rounded={8}
                />
              </Box>
            </GridItem>
            <GridItem rowSpan={5} colSpan={1}>
              <Flex direction={"column"} gap={6}>
                <Box>
                  <Heading
                    fontWeight={500}
                    fontSize={{ base: "2xl", md: "4xl" }}
                  >
                    {producto.nombre}
                  </Heading>
                  <Text
                    fontWeight={300}
                    mt={2}
                    fontSize={{ base: "sm", md: "2xl" }}
                  >
                    Cod.: {producto.codigo}
                  </Text>
                </Box>
                <Text
                  fontWeight={600}
                  fontSize={{ base: "2xl", md: "3xl" }}
                  color={"#003459"}
                >
                  $ {producto.precio}
                </Text>
                <Flex
                  gap={{ base: 4, md: 8 }}
                  alignItems={"start"}
                  flexDirection={{ base: "column", sm: "row" }}
                >
                  <Flex columnGap={1} rowGap={6} alignItems={"center"}>
                    <FormControl isInvalid={errores.cantidad}>
                      <IconButton
                        bg={"none"}
                        icon={<IconMinus />}
                        aria-label="Disminuir cantidad"
                        onClick={decrementarCantidad}
                        mr={{ base: 2, md: 6 }}
                        size={{ base: "sm", md: "md" }}
                        _hover={{
                          bg: "gray.200",
                          transition: "background-color 0.3s ease-in-out",
                        }}
                        _active={{
                          bg: "gray.300",
                        }}
                        _focus={{
                          boxShadow: "none",
                        }}
                      />
                      <Input
                        name="cantidad"
                        type="number"
                        value={cantidad}
                        onChange={handleCantidadChange}
                        min={1}
                        max={producto.stock}
                        textAlign="center"
                        width={{ base: "50px", md: "60px" }}
                        fontSize={{ base: "sm", md: "md" }}
                      />
                      <IconButton
                        bg={"none"}
                        icon={<IconPlus />}
                        aria-label="Aumentar cantidad"
                        onClick={incrementarCantidad}
                        ml={{ base: 2, md: 6 }}
                        size={{ base: "sm", md: "md" }}
                        _hover={{
                          bg: "gray.200",
                          transition: "background-color 0.3s ease-in-out",
                        }}
                        _active={{
                          bg: "gray.300",
                        }}
                        _focus={{
                          boxShadow: "none",
                        }}
                      />
                      <FormErrorMessage>{errores.cantidad}</FormErrorMessage>
                    </FormControl>
                  </Flex>
                  <Flex
                    gap={2}
                    alignItems={"center"}
                    width={{ base: "100%", sm: "auto" }}
                  >
                    {productoEnElCarrito(producto) ? (
                      <Button
                        rightIcon={<IconShoppingCartX />}
                        width={{ base: "100%", md: "auto" }}
                        variant={'quitarDelCarrito'}
                        name={"quitarCarrito"}
                        onClick={() => eliminarDelCarrito(producto)}
                      >
                        Quitar del carrito
                      </Button>
                    ) : (
                      <Button
                        rightIcon={<IconShoppingCartPlus />}
                        width={{ base: "100%", md: "auto" }}
                        variant={'primary'}
                        name={"agregarCarrito"}
                        isDisabled={deshabilitarBoton}
                        onClick={handleAgregarAlCarrito}
                      >
                        Agregar al carrito
                      </Button>
                    )}
                  </Flex>
                </Flex>
                <Box 
                bg={"bg_card"} 
                px={4} 
                pt={4}
                rounded={8}
                boxShadow="lg"
                >
                  <Flex
                    fontSize={"sm"}
                    alignItems={{ base: "start"}}
                    gap={2}
                    flexDirection={{ base: "column"}}
                  >
                    <Box>
                      <Text fontWeight={600}>Medios de pago</Text>
                    </Box>
                    <Flex fontSize={"sm"} alignItems={"center"} gap={2}>
                      {tarjetasCredito.map((metodo) =>
                        metodo.status === "active" ? (
                          <Box key={metodo.id} boxSize={"full"} w={"auto"}>
                            <Tooltip
                              label={metodo.name}
                              aria-label={`Tooltip para el logo de ${metodo.nombre}`}
                            >
                              <Image
                                src={metodo.thumbnail}
                                alt={`Logo de ${metodo.nombre}`}
                                objectFit={"contain"}
                                w={"full"}
                                h={"full"}
                              />
                            </Tooltip>
                          </Box>
                        ) : null
                      )}
                      <Center height="50px">
                        <Divider orientation="vertical" />
                      </Center>
                      {tarjetasDebito.map((metodo) =>
                        metodo.status === "active" ? (
                          <Box key={metodo.id} boxSize={"full"} w={"auto"}>
                            <Tooltip
                              label={metodo.name}
                              aria-label={`Tooltip para el logo de ${metodo.nombre}`}
                            >
                              <Image
                                src={metodo.thumbnail}
                                alt={`Logo de ${metodo.nombre}`}
                                objectFit={"contain"}
                                w={"full"}
                                h={"full"}
                              />
                            </Tooltip>
                          </Box>
                        ) : null
                      )}
                       <Center height="50px">
                        <Divider orientation="vertical" />
                      </Center>
                      {redesCobranza.map((metodo) =>
                        metodo.status === "active" ? (
                          <Box key={metodo.id} boxSize={"full"} w={"auto"}>
                            <Tooltip
                              label={metodo.name}
                              aria-label={`Tooltip para el logo de ${metodo.nombre}`}
                            >
                              <Image
                                src={metodo.thumbnail}
                                alt={`Logo de ${metodo.nombre}`}
                                objectFit={"contain"}
                                w={"full"}
                                h={"full"}
                              />
                            </Tooltip>
                          </Box>
                        ) : null
                      )}
                    </Flex>
                  </Flex>
                  <Flex fontSize={"sm"} alignItems={"center"} gap={2}>
                    <Text fontWeight={600}>Paga de forma segura con</Text>
                    <Box
                      boxSize={"auto"}
                      display={"flex"}
                      justifyContent={{ base: "center", md: "start" }}
                      alignItems={"center"}
                      gap={3}
                      w={"auto"}
                      mr={8}
                    >
                      <Image
                        src={MercadoPagoLogo}
                        alt={"Logo de Mercado Pago"}
                        objectFit={"contain"}
                        w={"100px"}
                        h={"100px"}
                      />
                    </Box>
                  </Flex>
                </Box>
                <Flex
                  gap={2}
                  bg={"primary"}
                  color={'background'}
                  boxShadow="lg"
                  p={2}
                  width={"auto"}
                  rounded={4}
                  flexDirection={{ base: "column" }}
                >
                  <Flex gap={2}>
                    <IconTruck />
                    <Text fontWeight={500}>
                      Realizamos envíos a todo el país.
                    </Text>
                  </Flex>
                  <ChakraLink as={RouterLink} to={'/formas-envio'}>Ver formas de envío</ChakraLink>
                </Flex>
              </Flex>
            </GridItem>
            <GridItem colSpan={{ base: 1, md: 2 }}>
              <Box>
                <Heading
                  fontWeight={500}
                  fontSize={{ base: "xl", md: "2xl" }}
                  mt={{ base: 4, md: 8 }}
                >
                  Detalles del producto
                </Heading>
                <Text mt={2} fontSize={{ base: "sm", md: "md" }}>
                  {producto.descripcion}
                </Text>
              </Box>
            </GridItem>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default DetalleProducto;
