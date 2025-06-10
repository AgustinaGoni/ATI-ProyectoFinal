import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
} from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

const PagoCancelado = () => {
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
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="100%"
        w={'auto'}
        flex="1"
        m={10}
        p={10}
        rounded={10}
      >
        <AlertIcon boxSize="50px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="3xl">
          ¡Pago cancelado!
        </AlertTitle>
        <AlertDescription display={'flex'} flexDirection={'column'}  py={8}>
          Ha ocurrido un error en el pago. Por favor vuelva a intentarlo.
        </AlertDescription>
      </Alert>
      <Button as={Link} to={"/mi-carrito"}>Ir al carrito</Button>
    </Box>
  );
};

export default PagoCancelado;
