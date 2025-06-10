import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const PagoAprobado = () => {
  useEffect(() => {
    const carrito = localStorage.getItem("carrito");
    if (carrito) {
      localStorage.removeItem("carrito");
    } 
  }, []);

  return (
    <Box
      display="flex"
      flex="1"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={8}
      mb={10}
    >
      <Alert
        status="success"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="100%"
        w={"auto"}
        flex="1"
        m={10}
        p={10}
        rounded={10}
      >
        <AlertIcon boxSize="50px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="3xl">
          ¡Pago aprobado!
        </AlertTitle>
        <AlertDescription display={"flex"} flexDirection={"column"} py={8}>
          <Text fontWeight={"bold"} fontSize={"lg"} mb={8}>
            ¡Gracias por compra!
          </Text>
          <Text>
          Tu pago se ha realizado con éxito, haciendo click en el botón puedes
          ir a ver el detalle de tu compra.
          </Text>
          <Text fontWeight={"bold"} fontSize={"sm"} mt={6}>
          Hemos enviado los detalles de tu compra por correo electrónico. Si no lo encuentras en tu bandeja de entrada, revisa tu carpeta de spam o correo no deseado.
          </Text>
        </AlertDescription>
      </Alert>
      <Button as={Link} to={"/mis-compras"}>Ir a mis compras</Button>
    </Box>
  );
};

export default PagoAprobado;
