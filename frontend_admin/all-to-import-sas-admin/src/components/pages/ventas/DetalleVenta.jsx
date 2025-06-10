import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { obtenerCompraPorId } from "../../../js/api/compras/obtenerCompraPorId";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  GridItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { API_URL, getToken } from "../../../js/config";
import { obtenerDatosDelNegocioPorId } from "../../../js/api/obtenerDatosDelNegocioPorId";
import { actualizarStock } from "../../../js/api/actualizarStock";

const DetalleVenta = () => {
  const { id } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [compra, setCompra] = useState({});
  const [loading, setLoading] = useState(true);
  const [direccion, setDireccion] = useState({});
  const [datoNegocio, setDatoNegocio] = useState({});
  const [itemsCompra, setItemsCompra] = useState([]);
  const [errores, setErrores] = useState({
    direccion: "",
  });
  const [estado, setEstado] = useState(0);
  const [loadingCambioEstado, setLoadingCambioEstado] = useState(false);
  const [deshabilitarBotonCambioEstado, setDeshabilitarBotonCambioEstado] =
    useState(false);

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
      setEstado(Number(c.estadoCompra));
      setItemsCompra(c.itemsCompra);
      setLoading(false);
    };

    fetchData();
  }, [id, estado]);

  const obtenerDireccion = async (idDireccion) => {
    try {
      const response = await fetch(
        `${API_URL}Usuario/Direccion/${idDireccion}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(
          "Error obteniendo la dirección: " + response.statusText
        ); o
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

  const obtenerSiguienteEstado = (estado, tipoEntrega) => {
    const estados = {
      0: 1, 
      1: tipoEntrega === "EnvioDomicilio" ? 2 : tipoEntrega === "RetiroCompra" ? 3 : 4, 
      2: 4, 
      3: 4, 
    };

    return estados[estado] || 4;
  };

  const confirmarCambioDeEstado = async () => {

    const siguienteEstado = obtenerSiguienteEstado(estado, compra.entrega.tipo);


    console.log("Siguiente estado: " + siguienteEstado);

    if (siguienteEstado >= 4) {
      setDeshabilitarBotonCambioEstado(true);
    }

    try {
      setLoadingCambioEstado(true);
      if(siguienteEstado === 1){
        await actualizarStock()
      }
  
      const response = await fetch(
        `${API_URL}Compra/Estado/${compra.id}/${siguienteEstado}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al actualizar el estado: ${errorText}`);
      }

      setEstado(siguienteEstado);
      toast({
        position: "top",
        title: "Se ha actualizado el estado de la compra.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
      toast({
        position: "top",
        title: "Error",
        description:
          error.message || "No se pudo actualizar el estado del producto.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingCambioEstado(false);
      onClose();
    }
  };
  return (
    <Container maxW="1280px">
      {loading ? (
        <Text>CARGANDO</Text>
      ) : (
        <>
          <Heading
            textAlign={"center"}
            fontWeight={600}
            fontSize={{ base: "xl", sm: "3xl", lg: "5xl" }}
          >
            Detalle del pedido #{id}
          </Heading>
          <Grid templateColumns="repeat(2, 1fr)" mt={12} gap={4}>
            <GridItem
              colSpan={1}
              p={4}
              rounded={8}
              bg={"gray.100"}
              boxShadow="md"
            >
              <Heading as={"h3"} size={"md"}>
                Pedido
              </Heading>
              <Grid templateColumns="200px 1fr" columnGap={4} rowGap={1} py={4}>
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
                  Mercado pago ({compra.paymentId})
                </Box>
                <Text>Estado:</Text>
                <Box as="span" fontWeight={600}>
                  {compra.estadoCompraNombre === "ListoParaRetirar"
                    ? "Listo para retirar"
                    : compra.estadoCompraNombre}
                </Box>
                <Button
                  variant={"outline"}
                  color={"botonBg"}
                  _hover={{
                    transition: "0.5s ease",
                    bg: "botonBg",
                    color: "botonColor",
                  }}
                  mt={4}
                  isDisabled={deshabilitarBotonCambioEstado}
                  onClick={onOpen}
                >
                  Cambiar de estado
                </Button>
              </Grid>
            </GridItem>
            <GridItem
              colSpan={1}
              p={4}
              rounded={8}
              bg={"gray.100"}
              boxShadow="md"
            >
              <Heading as={"h3"} size={"md"}>
                Cliente
              </Heading>
              <Grid templateColumns="200px 1fr" columnGap={4} rowGap={1} py={4}>
                <Text>Nombre y apellido:</Text>
                <Box fontWeight={600}>
                  {compra.cliente.nombre} {compra.cliente.apellido}
                </Box>
                <Text>Documento de identidad:</Text>
                <Box fontWeight={600}>{compra.cliente.documentoIdentidad}</Box>
                <Text>Telefóno:</Text>
                <Box fontWeight={600}>{compra.cliente.telefono}</Box>
                <Text>Correo electrónico:</Text>
                <Box fontWeight={600}>{compra.cliente.correoElectronico}</Box>
                <Text>Razón social:</Text>
                <Box fontWeight={600}>{compra.razonSocial}</Box>
                <Text>Rut:</Text>
                <Box fontWeight={600}>{compra.rut}</Box>
              </Grid>
            </GridItem>
            <GridItem
              colSpan={1}
              p={4}
              rounded={8}
              bg={"gray.100"}
              boxShadow="md"
            >
              <Heading as={"h3"} size={"md"}>
                {compra.entrega.tipo === "EnvioDomicilio"
                  ? "Envío a domicilio "
                  : "Retiro en persona"}
              </Heading>
              <Grid templateColumns="200px 1fr" columnGap={4} rowGap={1} py={4}>
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
            </GridItem>
            <GridItem
              colSpan={1}
              p={4}
              rounded={8}
              bg={"gray.100"}
              boxShadow="md"
            >
              <Box>
                <Heading as={"h3"} size={"md"}>
                  Productos
                </Heading>
              </Box>
              <TableContainer py={4}>
                <Table size="md">
                  <Thead>
                    <Tr>
                      <Th fontWeight={"bold"} fontSize="sm" pl={0}>
                        Producto
                      </Th>
                      <Th fontWeight={"bold"} fontSize="sm" pl={0}>
                        Cantidad
                      </Th>
                      <Th fontWeight={"bold"} fontSize="sm" pl={0}>
                        Precio C/U
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {itemsCompra.map((p) => (
                      <Tr key={p.id}>
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
                              src={`data:image/jpeg;base64,${p.producto.imagen}`}
                              alt={`Imagen del producto ${p.producto.nombre}`}
                              objectFit={"contain"}
                              w={"40px"}
                              h={"40px"}
                            />
                            <Text> {p.producto.nombre}</Text>
                          </Box>
                        </Td>
                        <Td pl={0}>{p.producto.cantidad}</Td>
                        <Td pl={0}>
                          $ {p.producto.precio * p.producto.cantidad}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
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
            </GridItem>
          </Grid>

          {/* Modal de Confirmación */}
          <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              {loadingCambioEstado ? (
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
                  <ModalHeader>Confirmar cambio de estado</ModalHeader>
                  <ModalBody>
                    ¿Estás seguro de que deseas cambiar el estado de la compra?
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      colorScheme="blue"
                      mr={3}
                      onClick={confirmarCambioDeEstado}
                    >
                      Confirmar
                    </Button>
                    <Button variant="outline" onClick={onClose}>
                      Cancelar
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      )}
    </Container>
  );
};

export default DetalleVenta;
