import React from "react";
import { Container, Flex, Heading, Text } from "@chakra-ui/react";
import {
  IconShoppingCart,
  IconEye,
  IconCreditCard,
  IconTruck,
  IconCash,
} from "@tabler/icons-react";

const ComoComprar = () => {
  return (
    <Container maxW="1280px" px={5} my={8}>
      <Heading
        my={10}
        textAlign={"center"}
        fontSize={{ base: "2xl", lg: "4xl" }}
      >
        ¿Cómo Comprar?
      </Heading>
      <Container maxW="container.lg">
        <Flex
          justify="space-around"
          flexDirection="column"
          alignItems="center"
        >
          <Flex
            flexDirection={"column"}
            alignItems={"center"}
            p="15px"
            bg="white"
            borderRadius={8}
            boxShadow="lg"
            _hover={{ transform: "translateY(-5px)" }}
            transition={"all 1s ease"}
            width="80%"
            mb={8}
          >
            <IconShoppingCart
              size={50}
              stroke={1.5}
              color="gray"
              style={{ marginBottom: "16px" }}
            />
            <Text textAlign={'center'} fontWeight="bold" fontSize="xl" mb={4}>
              Paso 1 - Toca el Carrito
            </Text>
            <Text textAlign={'center'} >
              Busca el ícono del carrito en la esquina superior derecha y haz
              clic en él para ver tu carrito de compras.
            </Text>
          </Flex>

          <Flex
            flexDirection={"column"}
            alignItems={"center"}
            p="15px"
            bg="background"
            borderRadius={8}
            boxShadow="lg"
            _hover={{ transform: "translateY(-5px)" }}
            transition={"all 1s ease"}
            width="80%"
            mb={8}
          >
            <IconEye
              size={50}
              stroke={1.5}
              color="gray"
              style={{ marginBottom: "16px" }}
            />
            <Text textAlign={'center'}  fontWeight="bold" fontSize="xl" mb={4}>
              Paso 2 - Ver Carrito
            </Text>
            <Text textAlign={'center'} >
              Revisa los productos que has seleccionado y verifica las
              cantidades. Luego, haz clic en "Ver carrito".
            </Text>
          </Flex>

          <Flex
            flexDirection={"column"}
            alignItems={"center"}
            p="15px"
            bg="background"
            borderRadius={8}
            boxShadow="lg"
            _hover={{ transform: "translateY(-5px)" }}
            transition={"all 1s ease"}
            width="80%"
            mb={8}
          >
            <IconCreditCard
              size={50}
              stroke={1.5}
              color="gray"
              style={{ marginBottom: "16px" }}
            />
            <Text textAlign={'center'}  fontWeight="bold" fontSize="xl" mb={4}>
              Paso 3 - Finalizar Compra
            </Text>
            <Text textAlign={'center'} >
              Cuando estés listo, haz clic en "Finalizar compra" para proceder
              con el pago.
            </Text>
          </Flex>

          <Flex
            flexDirection={"column"}
            alignItems={"center"}
            p="15px"
            bg="background"
            borderRadius={8}
            boxShadow="lg"
            _hover={{ transform: "translateY(-5px)" }}
            transition={"all 1s ease"}
            width="80%"
            mb={8}
          >
            <IconTruck
              size={50}
              stroke={1.5}
              color="gray"
              style={{ marginBottom: "16px" }}
            />
            <Text textAlign={'center'}  fontWeight="bold" fontSize="xl" mb={4}>
              Paso 4 - Elige el Método de Entrega
            </Text>
            <Text textAlign={'center'} >
              Elige si deseas que te enviemos el pedido a tu dirección o si
              prefieres retirarlo en uno de nuestros puntos de retiro.
            </Text>
          </Flex>

          <Flex
            flexDirection={"column"}
            alignItems={"center"}
            p="15px"
            bg="background"
            borderRadius={8}
            boxShadow="lg"
            _hover={{ transform: "translateY(-5px)" }}
            transition={"all 1s ease"}
            width="80%"
            mb={8}
          >
            <IconCash
              size={50}
              stroke={1.5}
              color="gray"
              style={{ marginBottom: "16px" }}
            />
            <Text textAlign={'center'}  fontWeight="bold" fontSize="xl" mb={4}>
              Paso 5 - Paga con Mercado Pago
            </Text>
            <Text textAlign={'center'} >
              Completa tu compra realizando el pago a través de Mercado Pago,
              elige tu método de pago favorito y finaliza la transacción.
            </Text>
          </Flex>
        </Flex>
      </Container>
    </Container>
  );
};

export default ComoComprar;
