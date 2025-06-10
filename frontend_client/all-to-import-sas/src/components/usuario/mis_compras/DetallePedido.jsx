import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { obtenerCompraPorId } from "../../../js/api/compras/obtenerCompraPorId";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Heading,
  Image,
  Card,
  CardBody,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Highlight,
  Stack,
  Skeleton,
} from "@chakra-ui/react";
import { API_URL, getToken } from "../../../js/config";
import { obtenerDatosDelNegocioPorId } from "../../../js/api/datos-negocio/obtenerDatosDelNegocioPorId";

const DetallePedido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [compra, setCompra] = useState({});
  const [loading, setLoading] = useState(true);
  const [direccion, setDireccion] = useState({});
  const [datoNegocio, setDatoNegocio] = useState({});
  const [itemsCompra, setItemsCompra] = useState([]);
  const [errores, setErrores] = useState({
    direccion: "",
  });



  useEffect(() => {
    const fetchData = async () => {
      const c = await obtenerCompraPorId(id);
      setCompra(c);
      if (c.entrega.tipo === "EnvioDomicilio") {
        await obtenerDireccion(c.entrega.envioDomicilio.idDireccion);
      }
      if (c.entrega.tipo === "RetiroCompra") {
        const datos = await obtenerDatosDelNegocioPorId(
          c.entrega.retiroCompra.datosNegocioId
        );
        setDatoNegocio(datos);
      }
      setItemsCompra(c.itemsCompra);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const obtenerDireccion = async (idDireccion) => {
    try {
      const response = await fetch(
        `${API_URL}Usuario/Direccion/${idDireccion}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      ); 
      if (!response.ok) {
        throw new Error(
          "Error obteniendo la dirección: " + response.statusText
        ); 
      }
      const datos = await response.json(); 
      setDireccion(datos);
    } catch (error) {
      console.error("Error obteniendo la dirección:", error);

      setErrores({
        direccion: "Dirección de envío no disponible.",
      });
      setDireccion(null); 
    }
  };

  const totalPagado = useMemo(
    () =>
      itemsCompra
        .reduce(
          (total, item) =>
            total + item.producto.cantidad * item.producto.precio,
          0
        )
        .toFixed(),
    [itemsCompra]
  );
  const cantidadProductosComprados = useMemo(
    () =>
      itemsCompra.reduce((total, item) => total + item.producto.cantidad, 0),
    [itemsCompra]
  );


  const estadoCompra =
    compra.estadoCompraNombre === "ListoParaRetirar"
      ? "Lista para retirar"
      : compra.estadoCompraNombre;
  return (
    <Container maxW="1280px" px={0} my={8}>
      {loading ? (
        <Stack justifyContent={'center'} alignItems={'center'} p={6}>
          <Skeleton height="20px" width={"50%"} startColor={"blue.600"} />
          <Skeleton height="20px" width={"50%"} startColor={"blue.500"} />
          <Skeleton height="220px" width={"50%"} startColor={"blue.200"} />
        </Stack>
      ) : (
        <>
          <Breadcrumb px={4} mb={8} fontSize={{ base: "xs", md: "sm" }}>
            <BreadcrumbItem>
              <BreadcrumbLink href="/mis-compras">Mis compras</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <Text>Detalle del pedido #{compra.id}</Text>
            </BreadcrumbItem>
          </Breadcrumb>
          <Heading
            textAlign={"center"}
    
            fontWeight={600}
            fontSize={{ base: "xl", sm: "3xl", lg: "5xl" }}
          >
            Detalle del pedido #{id}
          </Heading>
          <Heading
            as={"h2"}
            textAlign={"center"}
    
            fontWeight={600}
            fontSize={{ base: "lg", sm: "xl", lg: "2xl" }}
            mt={8}
          >
            Estado del pedido:
            <Highlight
              query={estadoCompra}
              styles={{
                ml: "2",
                px: "3",
                py: "1",
                rounded: "full",
                bg: "background2",
                color: "white",
                textTransform: "uppercase",
                fontSize: { base: "xs", md: "md", lg: "lg", xl: "xl" },
              }}
            >
              {estadoCompra}
            </Highlight>
          </Heading>
          <Flex
            my={10}
            alignContent={"center"}
            justifyContent={"center"}
            px={4}
          >
            <Box
              p={8}
              rounded={8}
              boxShadow="lg"
              display={"inline-block"}
              bg={"bg_card"}
              maxWidth={{ base: "100vw", md: "80vw", lg: "60vw" }}
            >
              <Box>
                <Heading as={"h3"} size={"md"}>
                  Pedido
                </Heading>
                <Grid
                  templateColumns={{ base: "1fr", md: "200px 1fr" }}
                  columnGap={4}
                  rowGap={1}
                  py={4}
                >
                  <Text>Fecha de compra: </Text>
                  <Box as="span" fontWeight={600}>
                    {new Date(compra.fechaCompra).toLocaleString()}
                  </Box>
                  <Text>Nro. Orden:</Text>
                  <Box as="span" fontWeight={600}>
                    {compra.id}
                  </Box>
                  <Text>Forma de pago:</Text>
                  <Box as="span" fontWeight={600}>
                    Mercado Pago ({compra.paymentId})
                  </Box>
                </Grid>
              </Box>
              <Divider mb={8} />
              <Box>
                <Heading as={"h3"} size={"md"}>
                  Cliente
                </Heading>
                <Grid
                  templateColumns={{ base: "1fr", md: "200px 1fr" }}
                  columnGap={4}
                  rowGap={1}
                  py={4}
                >
                  <Text>Nombre y apellido:</Text>
                  <Box fontWeight={600}>
                    {compra.cliente.nombre} {compra.cliente.apellido}
                  </Box>
                  <Text>Documento de identidad:</Text>
                  <Box fontWeight={600}>
                    {compra.cliente.documentoIdentidad}
                  </Box>
                  <Text>Telefóno:</Text>
                  <Box fontWeight={600}>{compra.cliente.telefono}</Box>
                  <Text>Correo electrónico:</Text>
                  <Box fontWeight={600}>{compra.cliente.correoElectronico}</Box>
                  {compra.razonSocial !== "" && compra.rut !== "" && (
                    <>
                      <Text>Razón social:</Text>
                      <Box fontWeight={600}>{compra.razonSocial}</Box>
                      <Text>Rut:</Text>
                      <Box fontWeight={600}>{compra.rut}</Box>
                    </>
                  )}
                </Grid>
              </Box>
              <Divider mb={8} />
              <Box>
                <Heading as={"h3"} size={"md"}>
                  {compra.entrega.tipo === "EnvioDomicilio"
                    ? "Envío a domicilio "
                    : "Retiro en persona"}
                </Heading>
                <Grid
                  templateColumns={{ base: "1fr", md: "200px 1fr" }}
                  columnGap={4}
                  rowGap={1}
                  py={4}
                >
                  {compra.entrega.tipo === "EnvioDomicilio" ? (
                    !errores.direccion ? (
                      <>
                        <Text>Departamento:</Text>
                        <Box fontWeight={600}>{direccion.departamento}</Box>
                        <Text>Ciudad:</Text>
                        <Box fontWeight={600}>{direccion.ciudad}</Box>
                        <Text>Calle:</Text>
                        <Box fontWeight={600}>{direccion.calle}</Box>
                        <Text>Código postal:</Text>
                        <Box fontWeight={600}>{direccion.codigoPostal}</Box>
                        <Text>Nro. Puerta:</Text>
                        <Box fontWeight={600}>
                          {direccion.nroPuerta ? (
                            <Text>{direccion.nroPuerta}</Text>
                          ) : (
                            <Text color={"gray"} fontWeight={300}>
                              S/N
                            </Text>
                          )}
                        </Box>
                        <Text>Nro. Apartamento:</Text>
                        <Box fontWeight={600}>
                          {direccion.nroApartamento ? (
                            <Text>{direccion.nroApartamento}</Text>
                          ) : (
                            <Text color={"gray"} fontWeight={300}>
                              S/N
                            </Text>
                          )}
                        </Box>
                        <Text>Comentario:</Text>
                        <Box fontWeight={600}>
                          {compra.entrega.comentario ? (
                            <Text>{compra.entrega.comentario}</Text>
                          ) : (
                            <Text color={"gray"} fontWeight={300}>
                              Sin comentarios
                            </Text>
                          )}
                        </Box>
                      </>
                    ) : (
                      <Text fontWeight={600}>{errores.direccion}</Text>
                    )
                  ) : (
                    <>
                      <Text>Nombre y apellido:</Text>
                      <Box fontWeight={600}>
                        {compra.entrega.retiroCompra.nombreApellido}
                      </Box>
                      <Text>Documento de identidad:</Text>
                      <Box fontWeight={600}>
                        {compra.entrega.retiroCompra.documentoCliente}
                      </Box>
                      <Text>Comentario:</Text>
                      <Box fontWeight={600}>
                        {compra.entrega.comentario ? (
                          <Text>{compra.entrega.comentario}</Text>
                        ) : (
                          <Text color={"gray"} fontWeight={300}>
                            Sin comentarios
                          </Text>
                        )}
                      </Box>
                      <Heading
                        as={"h4"}
                        size={"sm"}
                        gridColumn={"1 / span 2"}
                        mt={4}
                      >
                        Datos para el retiro en {datoNegocio.nombre}
                      </Heading>
                      <Text>Lugar de retiro:</Text>
                      <Box fontWeight={600}>
                        {datoNegocio.direccion.calle}{" "}
                        {datoNegocio.direccion.nroPuerta},{" "}
                        {datoNegocio.direccion.nombre}
                        {datoNegocio.direccion.codigoPostal},{" "}
                        {datoNegocio.direccion.departamento}
                      </Box>
                      <Text>Horario de atención:</Text>
                      <Box fontWeight={600}>{datoNegocio.horario}</Box>
                      <Text>Teléfono de contacto:</Text>
                      <Box fontWeight={600}>{datoNegocio.telefono}</Box>
                    </>
                  )}
                </Grid>
              </Box>
              <Divider mb={8} />
              <>
                <Box>
                  <Heading as={"h3"} size={"md"}>
                    Productos
                  </Heading>
                </Box>
                <Box display={{ base: "block" }}>
                  {itemsCompra.map((p) => (
                    <Card
                      key={p.id}
                      bg={"none"}
                      borderBottom="1px"
                      borderColor={"gray.200"}
                      borderRadius={0}
                      boxShadow="none"
                      mb={4}
                    >
                      <CardBody
                        py={3}
                        px={0}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        gap={3}
                      >
                        <Box
                          boxSize={"40px"}
                          display={"flex"}
                          justifyContent={"center"}
                          w={"auto"}
                        >
                          <Image
                            src={`data:image/jpeg;base64,${p.producto.imagen}`}
                            alt={`Imagen del producto ${p.producto.nombre}`}
                            objectFit={"contain"}
                            w={"40px"}
                            h={"40px"}
                          />
                        </Box>
                        <Flex
                          w={"full"}
                          mb={4}
                          h={"32px"}
                          gap={4}
                          alignItems={"start"}
                          justifyContent={"space-between"}
                        >
                          <Box w={"70%"}>
                            <Heading
                              as="h3"
                              fontSize={{ base: "xs", sm: "sm" }}
                              fontWeight="bold"
                            >
                              {p.producto.nombre}
                            </Heading>
                            <Text
                              fontSize={{ base: "xs", sm: "sm" }}
                              color={"gray.500"}
                            >
                              Cod. {p.producto.codigo}
                            </Text>
                          </Box>
                          <Box w={"auto"} textAlign={"end"}>
                            <Text
                              color="primary"
                              fontWeight={600}
                              fontSize={{ base: "xs", lg: "md" }}
                            >
                              {p.producto.cantidad} unid.
                            </Text>
                            <Text
                              color="blue.600"
                              fontSize={{ base: "sm", lg: "md" }}
                            >
                              $ {p.producto.precio * p.producto.cantidad}
                            </Text>
                          </Box>

                          {/* </Flex> */}
                          {/* <Stack
                          justifyContent="space-between"
                          alignItems={"center"}
                          direction="row"
                          spacing={{ base: 2, sm: 0 }}
                        > */}
                          {/* <Flex flexDirection={"column"}>
                          <Text
                            color={"gray.500"}
                            fontSize={{ base: "xs", lg: "sm" }}
                          >
                            $ {producto.precio} c/u
                          </Text> */}

                          {/* </Flex> */}
                          {/* </Stack> */}
                        </Flex>
                      </CardBody>
                    </Card>
                  ))}
                </Box>
                <Grid
                  templateColumns="200px 1fr"
                  columnGap={4}
                  rowGap={1}
                  justifyContent={"end"}
                >
                  <Text>Cantidad de productos: </Text>
                  <Box as="span" fontWeight={600}>
                    {cantidadProductosComprados}
                  </Box>
                  <Text>Total pagado:</Text>
                  <Box as="span" fontWeight={600}>
                    $ {totalPagado}
                  </Box>
                </Grid>
              </>
            </Box>
          </Flex>
        </>
      )}
    </Container>
  );
};

export default DetallePedido;
