import {
  Container,
  Stack,
  Box,
  Heading,
  Text,
  Button,
  Image,
  SimpleGrid,
} from "@chakra-ui/react";
import { IconShoppingCart } from "@tabler/icons-react";

export default function Hero() {
  return (
    <Box bgGradient={"linear(to-r, #F0F0F0, #B1B1B1)"}>
      <Container
        maxW="1280px"
        py={{ base: "4", md: "6", lg: "8" }}
        pr={{ base: "0", md: "4" }}
      >
        <SimpleGrid
          columns={2}
          position="relative"
          overflow="hidden"
          align={{ base: "start", lg: "center" }}
          spacing={{ base: 3, md: 10 }}
          py={3}
          ml={{base:"0", sm:"16px"}}
        >
          <Stack
            flex={1}
            spacing={{ base: 5, md: 10 }}
            align={{ base: "start", lg: "center" }}
          >
            <Heading
              fontSize={{ base: "md", md: "3xl", lg: "5xl" }}
              textTransform={"uppercase"}
              textAlign={{lg: "center"}}
            >
              Aspiradora Robot Inteligente Samsung
            </Heading>
            <Text
              fontSize={{ base: "2xl", md: "5xl", lg: "7xl" }}
              fontWeight={"bold"}
              color={"#407076"}
            >
              $ 8560
            </Text>
          </Stack>
          <Box
            position="absolute"
            right={{ base: "-70px", md: "0px" }}
            top="50%"
            transform="translateY(-50%)"
            width={{ base: "270px", sm: "320px", md:"400px", lg: "550px" }}
            height="full"
            overflow="hidden"
          >
            <Image
              src="/img/img_prueba.png"
              alt={"Imagen del producto (aqui va nombre)"}
              width={{ base: "270px", sm: "320px", md:"400px", lg: "550px" }}
              height="full"
              objectFit="contain"
            />
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
