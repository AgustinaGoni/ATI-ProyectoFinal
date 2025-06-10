import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const PagoPendiente = () => {
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
        status="warning"
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
          ¡Pago pendiente!
        </AlertTitle>
        <AlertDescription display={"flex"} flexDirection={"column"} py={8}>
          Tu pago esta pendiente de confirmar. Te avisaremos una vez confirmado
          el pago.
          <Box as="span" fontWeight={"bold"} fontSize={"xs"} mb={8}>
            Tu compra está pendiente de confirmación. Te notificaremos por
            correo electrónico una vez que el pago haya sido confirmado.
          </Box>
        </AlertDescription>
      </Alert>
      <Button as={Link} to={"/mis-compras"}>
        Ir a mis compras
      </Button>
    </Box>
  );
};

export default PagoPendiente;
