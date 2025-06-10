import { useEffect, useRef, useState } from "react";
import {
  Container,
  FormControl,
  Input,
  Stack,
  Button,
  Heading,
  VStack,
  FormLabel,
  Flex,
  Box,
  Text,
  Spinner,
  useMediaQuery,
  Icon,
} from "@chakra-ui/react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { IconTool, IconXboxX } from "@tabler/icons-react";
import ReCAPTCHA from "react-google-recaptcha";
import { actualizarStock } from "../../js/api/actualizarStock";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const { login, esAdmin, error } = useAuth();
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();
  const [captchaToken, setCaptchaToken] = useState(null);
  const captcha = useRef(null);

  const [isMobileOrTablet] = useMediaQuery("(max-width: 768px)");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const usuario = {
        correo,
        clave,
        captchaToken: captchaToken || "",
      };

      const loginExitoso = await login(usuario);
      console.log(loginExitoso);
      console.log(esAdmin);
      if (loginExitoso) {
        await actualizarStock();
        navigate("/panel-admin/inicio");
      }
    } catch (e) {
      console.error("Error al iniciar sesión:", e);
      captcha.current.reset(); // Resetea el reCAPTCHA en caso de error
      setCaptchaToken(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReCaptcha = () => {
    console.log("hubo un click en recaptcha");

    setCaptchaToken(captcha.current.getValue());
  };

  useEffect(() => {
    setCorreo("");
    setClave("");
    setCaptchaToken(null); // Resetea el token cuando el modal se cierra
  }, []);
  return (
    <Container maxW="7xl" h={"100vh"} p={{ base: 5, md: 10 }}>
      <Flex align="center" justify="center" h="100%" flexDirection={"column"}>
        {isMobileOrTablet ? (
           <Box
           textAlign="center"
           py={10}
           px={6}
           minHeight="100vh"
           display="flex"
           flexDirection="column"
           alignItems="center"
           justifyContent="center"
         >
           <Icon as={IconTool} boxSize={24} color="gray.600" mb={4} />
           <Heading as="h1" size="xl" mb={4} color="gray.700">
             No disponible en versión responsive
           </Heading>
           <Text fontSize="lg" color="gray.500">
             Estamos trabajando para que puedas utilizar la version responsive sin problemas. ¡Gracias por tu paciencia!
           </Text>
         </Box>
        ) : (
          <>
            <Flex align="center" justifyContent={"space-between"} gap={2}>
              <Heading textTransform={"uppercase"} fontSize="3xl">
                All To Import SAS - Administración
              </Heading>
            </Flex>
            <Stack spacing={4} align="center">
              <Stack spacing={10} align="center">
                <Box>
                  <Heading mt={8} fontSize="xl">
                    Ingresar al sistema
                  </Heading>
                </Box>
              </Stack>
              <VStack
                as="form"
                spacing={8}
                w={{ base: "sm", sm: "lg" }}
                p={{ base: 5, sm: 6 }}
                onSubmit={handleSubmit}
              >
                {" "}
                {loading ? (
                  <Flex justifyContent="center" alignItems="center">
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
                    <VStack spacing={6} w="100%">
                      <FormControl id="email" isRequired>
                        <FormLabel m={0}>Correo Electrónico</FormLabel>
                        <Input
                          type="email"
                          placeholder="Ingrese su correo electrónico"
                          variant="flushed"
                          value={correo}
                          onChange={(e) => setCorreo(e.target.value)}
                        />
                      </FormControl>
                      <FormControl id="password" isRequired>
                        <FormLabel m={0}>Contraseña</FormLabel>
                        <Input
                          type="password"
                          placeholder="Ingrese su contraseña"
                          variant="flushed"
                          value={clave}
                          onChange={(e) => setClave(e.target.value)}
                        />
                      </FormControl>
                    </VStack>
                    <VStack w="100%">
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        w="100%"
                      ></Stack>
                      <ReCAPTCHA
                        sitekey={import.meta.env.VITE_RECAPTCHA_KEY}
                        ref={captcha}
                        onChange={handleReCaptcha}
                      />

                      <Button
                        type="submit"
                        color={"botonBg"}
                        _hover={{
                          transition: "0.5s ease",
                          bg: "botonBg",
                          color: "botonColor",
                        }}
                        rounded="md"
                        w="100%"
                        mt={6}
                      >
                        Ingresar
                      </Button>
                      {error && (
                        <Flex
                          p={2}
                          flexDirection={"row"}
                          alignItems={"center"}
                          color={"red.500"}
                          gap={2}
                          rounded={8}
                          w={"100%"}
                        >
                          <IconXboxX />
                          <Text fontWeight={400}>{error}</Text>
                        </Flex>
                      )}
                    </VStack>
                  </>
                )}
              </VStack>
            </Stack>
          </>
        )}
      </Flex>
    </Container>
  );
};

export default Login;
