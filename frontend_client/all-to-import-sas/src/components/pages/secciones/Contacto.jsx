import React from "react";
import {
  Box,
  Container,
  Flex,
  Text,
  Link,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { IconPhone, IconMail, IconBrandInstagram } from "@tabler/icons-react"; // Íconos de Tabler

const Contacto = () => {
  return (
    <Container maxW="1280px" px={5} my={8}>
      <Heading
        my={10}
        textAlign={"center"}
        fontSize={{ base: "2xl", lg: "4xl" }}
      >
        Contáctanos
      </Heading>
      <Container maxW="container.lg">
        <Flex
          rowGap={6}
          flexDirection={{ base: "column", md: "row" }}
          justify="space-around"
        >
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
            width={{ base: "100%", md: "30%" }}
          >
            <IconPhone
              size={50}
              stroke={1.5}
              color="gray"
              style={{ marginBottom: "15px" }}
            />
            <Text fontWeight="bold" my={4}>
              Teléfono
            </Text>
            <Text>
              <Link href="tel:+59898633195" color="teal.500">
                098 633 195
              </Link>
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
            width={{ base: "100%", md: "30%" }}
          >
            <IconMail
              size={50}
              stroke={1.5}
              color="gray"
              style={{ marginBottom: "15px" }}
            />
            <Text fontWeight="bold" my={4}>
              Correo electrónico
            </Text>
            <Text>
              <Link href="mailto:alltoimportsas@gmail.com" color="teal.500">
                alltoimportsas@gmail.com
              </Link>
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
            width={{ base: "100%", md: "30%" }}
          >
            <IconBrandInstagram
              size={50}
              stroke={1.5}
              color="gray"
              style={{ marginBottom: "15px" }}
            />
            <Text fontWeight="bold" my={4}>
              Instagram
            </Text>
            <Text>
              <Link
                href="https://www.instagram.com/alltoimport/"
                color="teal.500"
                isExternal
              >
                @alltoimport
              </Link>
            </Text>
          </Flex>
        </Flex>
      </Container>
    </Container>
  );
};

export default Contacto;
