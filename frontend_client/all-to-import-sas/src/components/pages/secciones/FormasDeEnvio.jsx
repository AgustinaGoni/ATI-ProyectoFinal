import React from "react";
import { Box, Container, Flex, Heading, Text } from "@chakra-ui/react";
import { IconTruck, IconMapPin, IconHome } from "@tabler/icons-react"; // Íconos de Tabler

const FormasEnvio = () => {
  return (
    <Container maxW="1280px" px={5} my={8}>
      <Heading
        my={10}
        textAlign={"center"}
        fontSize={{ base: "2xl", lg: "4xl" }}
      >
        Formas de Envío
      </Heading>
      <Flex rowGap={6} flexDirection={{base:'column', lg:"row"}} justify="space-around" p="20px" mt={8}>
        <Flex
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          p="15px"
          bg="white"
          borderRadius={8}
          boxShadow="lg"
          _hover={{ transform: "translateY(-5px)" }}
          transition={"all 1s ease"}
          width={{base: "100%", lg:"30%"}}
        >
          <IconTruck
            size={50}
            stroke={1.5}
            color="gray"
            style={{ marginBottom: "15px" }}
          />
          <Text fontWeight="bold" my={4}>
            Envío en Montevideo
          </Text>
          <Text textAlign={"center"}>
            Enviamos su pedido dentro de Montevideo $200 imp. inc.
          </Text>
        </Flex>
        <Flex
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          p="15px"
          bg="white"
          borderRadius={8}
          boxShadow="lg"
          _hover={{ transform: "translateY(-5px)" }}
          transition={"all 1s ease"}
          width={{base: "100%", lg:"30%"}}
        >
          <IconMapPin
            size={50}
            stroke={1.5}
            color="gray"
            style={{ marginBottom: "15px" }}
          />
          <Text fontWeight="bold" my={4}>
            Envíos al Interior
          </Text>
          <Text textAlign="center">
            Enviamos su pedido por la agencia DAC. Despachamos la mercadería y
            se paga el envío una vez llegue el pedido.
          </Text>
        </Flex>
        <Flex
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          p="15px"
          bg="white"
          borderRadius={8}
          boxShadow="lg"
          _hover={{ transform: "translateY(-5px)" }}
          transition={"all 1s ease"}
          width={{base: "100%", lg:"30%"}}
        >
          <IconHome
            size={50}
            stroke={1.5}
            color="gray"
            style={{ marginBottom: "15px" }}
          />
          <Text fontWeight="bold" my={4}>
            Retiro en Local
          </Text>
          <Text textAlign="center">
            Retire su pedido web únicamente en nuestros puntos de retiro en
            Unión y Lezica.
          </Text>
          <Text textAlign="center">
            Una vez finalizada su compra se le enviará un mail para saber cuándo
            podrá ser retirado el pedido.
          </Text>
          <Text textAlign="center" my={4}>
            <Text as={"span"} fontWeight={"bold"}>
              Puntos de Retiro:
            </Text>
          </Text>
          <Text textAlign="center">
            <Text as={"span"} fontWeight={"bold"}>
              Unión:
            </Text>{" "}
            Tomás Claramunt 3752 esquina Serrato
          </Text>
          <Text textAlign="center">
            <Text as={"span"} fontWeight={"bold"}>
              Lezica:
            </Text>{" "}
            Gutenberg 6364 esquina Guanahany
          </Text>
        </Flex>
      </Flex>
    </Container>
  );
};

export default FormasEnvio;
