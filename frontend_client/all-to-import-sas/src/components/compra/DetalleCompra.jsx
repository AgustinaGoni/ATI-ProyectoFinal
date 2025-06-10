import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Flex,
  Text,
  Grid,
  GridItem,
  Image,
  Card,
  CardBody,
  Divider,
} from "@chakra-ui/react";
import { useCart } from "../../hooks/useCart";
import { useNavigate } from "react-router-dom";
import { Wallet } from "@mercadopago/sdk-react";
import { API_URL, getToken } from "../../js/config";

const DetalleCompra = ({
  datosFacturacion,
  datosEnvio,
  preferenceId,
  onBack,
}) => {
  const navigate = useNavigate();
  const { carrito } = useCart();
  const [direccion, setDireccion] = useState({});
  const [costoEnvio, setCostoEnvio] = useState(0);

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

  const [loading, setLoading] = useState(0);
  const [showWallet, setShowWallet] = useState(false);
  useEffect(() => {

    const fetchData = async () => {
      if (datosEnvio.idDireccion) {
        await obtenerDireccion(datosEnvio.idDireccion);
      }
      await obtenerCostoEnvio();
    };
    fetchData();
  }, []);

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

      setDireccion(null); 
    }
  };

  const obtenerCostoEnvio = async () => {
    try {
      const response = await fetch(`${API_URL}DatosNegocio/ObtenerCostoEnvio`);
      if (!response.ok) {
        throw new Error(
          "Error obteniendo el costo de envio: " + response.statusText
        );
      }
      const costo = await response.json(); 
      setCostoEnvio(costo);
    } catch (error) {
      console.error("Error obteniendo el costo de envio:", error);
      setCostoEnvio(null);
    }
  };

  const totalPagar =
    direccion.departamento === "Montevideo"
      ? Number(carritoTotalPagar) + Number(costoEnvio)
      : Number(carritoTotalPagar);
      
  return (
    <>
      <Box mb={4}>
        <Heading pb={2} fontSize={"lg"}>
          Resumen de la compra
        </Heading>
        <Box>
          <Text color={"gray.600"} fontSize={{ base: "sm", md: "md" }}>
            Una vez haga clic en el botón{" "}
            <Box as="span" fontWeight={600}>
              Pagar con Mercado Pago
            </Box>{" "}
            será redirigido a la página de Mercado Pago para poder realizar el
            pago de forma segura.
          </Text>
        </Box>
      </Box>
      <Grid
        templateColumns={"repeat(2, 1fr)"}
        gap={4}
        p={4}
        rounded={8}
        boxShadow="lg"
        height="fit-content"
      >
        <GridItem
          fontSize={{ base: "sm", md: "md" }}
          colSpan={{ base: 2, md: 1 }}
        >
          <Grid gap={4}>
            <GridItem>
              <Heading as={"h3"} fontSize={"md"}>
                Datos de facturación
              </Heading>
              <Grid
                templateColumns={{ base: "120px 1fr", md: "200px 1fr" }}
                columnGap={4}
                rowGap={1}
                py={2}
              >
                <Text>Nombre y apellido:</Text>
                <Box fontWeight={600}>
                  {datosFacturacion.nombre} {datosFacturacion.apellido}
                </Box>
                <Text>Documento de identidad:</Text>
                <Box fontWeight={600}>
                  {datosFacturacion.documentoIdentidad}
                </Box>
                <Text>Telefóno:</Text>
                <Box fontWeight={600}>{datosFacturacion.numeroTelefono}</Box>
                <Text>Correo electrónico:</Text>
                <Box fontWeight={600}>{datosFacturacion.email}</Box>
                {datosFacturacion.checkFacturaRut && (
                  <>
                    <Text>Razón social:</Text>
                    <Box fontWeight={600}>{datosFacturacion.razonSocial}</Box>
                    <Text>Rut:</Text>
                    <Box fontWeight={600}>{datosFacturacion.rut}</Box>
                  </>
                )}
              </Grid>
            </GridItem>
            <GridItem>
              <Heading as={"h3"} fontSize={"md"}>
                {datosEnvio.tipoEnvio === "domicilio"
                  ? "Envío a domicilio "
                  : "Retiro en persona"}
              </Heading>
              <Box>
                <Grid
                  templateColumns={{ base: "120px 1fr", md: "200px 1fr" }}
                  columnGap={4}
                  rowGap={1}
                  py={1}
                >
                  {datosEnvio.tipoEnvio === "domicilio" ? (
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
                          <Text color={"gray.600"} fontWeight={300}>
                            S/N
                          </Text>
                        )}
                      </Box>
                      <Text>Nro. Apartamento:</Text>
                      <Box fontWeight={600}>
                        {direccion.nroApartamento ? (
                          <Text>{direccion.nroApartamento}</Text>
                        ) : (
                          <Text color={"gray.600"} fontWeight={300}>
                            S/N
                          </Text>
                        )}
                      </Box>
                      <Text>Comentario:</Text>
                      <Box fontWeight={600}>
                        {datosEnvio.comentarioEnvio ? (
                          <Text>{datosEnvio.comentarioEnvio}</Text>
                        ) : (
                          <Text color={"gray.600"} fontWeight={300}>
                            Sin comentarios
                          </Text>
                        )}
                      </Box>
                    </>
                  ) : (
                    <>
                      <Text>Nombre y apellido:</Text>
                      <Box fontWeight={600}>{datosEnvio.nombreApellido}</Box>
                      <Text>Documento de identidad:</Text>
                      <Box fontWeight={600}>{datosEnvio.numeroDocumento}</Box>
                      <Text>Lugar de retiro:</Text>
                      <Box fontWeight={600}>{datosEnvio.idLugarRetiro}</Box>
                      <Text>Comentario:</Text>
                      <Box fontWeight={600}>
                        {datosEnvio.comentarioRetiro ? (
                          <Text>{datosEnvio.comentarioRetiro}</Text>
                        ) : (
                          <Text color={"gray.600"} fontWeight={300}>
                            Sin comentarios
                          </Text>
                        )}
                      </Box>
                    </>
                  )}
                </Grid>
              </Box>
            </GridItem>
          </Grid>
        </GridItem>

        <GridItem
          fontSize={{ base: "sm", md: "md" }}
          colSpan={{ base: 2, md: 1 }}
        >
          <Grid gap={4}>
            <GridItem>
              <Heading as={"h3"} fontSize={"md"}>
                Deatlle del pedido
              </Heading>
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
                          src={`data:image/jpeg;base64,${producto.imagen}`}
                          alt={`Imagen del producto ${producto.nombre}`}
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
                            {producto.nombre}
                          </Heading>
                          <Text
                            fontSize={{ base: "xs", sm: "md" }}
                            color={"gray.500"}
                          >
                            Cod. {producto.codigo}
                          </Text>
                        </Box>
                        <Box w={"auto"} textAlign={"end"}>
                          <Text
                            color="primary"
                            fontWeight={600}
                            fontSize={{ base: "xs", lg: "md" }}
                          >
                            {producto.cantidad} unid.
                          </Text>
                          <Text
                            color="blue.600"
                            fontSize={{ base: "sm", lg: "md" }}
                          >
                            $ {producto.precio * producto.cantidad}
                          </Text>
                        </Box>
                      </Flex>
                    </CardBody>
                  </Card>
                ))}
              </Box>
              <Button
                variant={"link"}
                size={"sm"}
                onClick={() => navigate("/mi-carrito")}
              >
                Modificar algún producto
              </Button>
            </GridItem>
            <GridItem>
              <Heading as={"h3"} fontSize={"md"}>
                Total
              </Heading>
              <Grid templateColumns="200px 1fr" columnGap={4} rowGap={1} py={4}>
                <Text>Cantidad de productos:</Text>
                <Box fontWeight={600}>{carritoCantidadProductos}</Box>
                <Text>Subtotal:</Text>
                <Box fontWeight={600}>$ {carritoTotalPagar}</Box>
                {direccion.departamento === "Montevideo" ? (
                  <>
                    <Text>Costo de envío (Dento de Montevideo):</Text>
                    <Box fontWeight={600}>$ {costoEnvio}</Box>
                  </>
                ) : null}
                <Divider />
                <Divider />
                <Text>Total a pagar:</Text>
                <Box fontWeight={600}>$ {totalPagar}</Box>
              </Grid>
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem colSpan={{ base: 2 }}>
          <Flex
            justifyContent={"space-between"}
            alignItems={"center"}
            flexDirection={{ base: "column", md: "row" }}
          >
            <Button
              size={{ base: "xs", md: "sm" }}
              variant="link"
              color={"primary"}
              fontWeight={600}
              onClick={onBack}
            >
              Atrás
            </Button>
            <Box>
              {preferenceId &&
                <Wallet initialization={{ preferenceId }}  />
              }
            </Box>
          </Flex>
        </GridItem>
      </Grid>
    </>
  );
};

export default DetalleCompra;
