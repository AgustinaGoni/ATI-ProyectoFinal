import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  FormControl,
  FormLabel,
  Input,
  Link,
  VStack,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useMediaQuery,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import RecuperarContrasenia from "./RecuperarContrasenia";
import { validarLogin } from "../js/validaciones";

import { useAuth } from "../hooks/useAuth";
import Registrarse from "./Registrarse";
import { useModal } from "../context/ModalProvider";
import { IconUser } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
// import { obtenerDatosCliente } from "../js/api/usuarios/obtenerDatosCliente";
import { useUsuario } from "../hooks/useUsuario";
import SpinnerComponent from "./SpinnerComponent";
import MenuUsuario from "./MenuUsuario";
import ReCAPTCHA from "react-google-recaptcha";
import { actualizarStock } from "../js/api/actualizarStock";

const Login = ({ onDrawerMenuClose }) => {
  const navigate = useNavigate();
  const [isMobileOrTablet] = useMediaQuery("(max-width: 900px)"); // Ajusta el tamaño de la pantalla según tus necesidades
  const { estaAutenticado, esAdmin, loginModal, logout, setError, error } =
    useAuth();
  const { actualizarUsuario } = useUsuario();
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const captcha = useRef(null);

  const {
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
    openSignupModal,
    closeSignupModal,
    closeRecuperarContraseniaModal,
  } = useModal();

  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !validarLogin({
        correo,
        clave,
      })
    ) {
      return;
    }

    try {
      setLoading(true); 

      const usuario = {
        correo,
        clave,
        captchaToken: captchaToken || "",
      };

      const loginExitoso = await loginModal(usuario);
      if (loginExitoso) {
        await actualizarUsuario();
        closeLoginModal(); 
        setTimeout(async () => {
          await actualizarStock();
        }, 0);
      }
    } catch (e) {
      console.error("Error al iniciar sesión:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoginModalOpen) {
      setError("");
      setCorreo("");
      setClave("");
      setCaptchaToken(null);
    }
  }, [isLoginModalOpen]);

  const handleReCaptcha = () => {
    setCaptchaToken(captcha.current.getValue());
  };

  return (
    <>
      <MenuUsuario
        openLoginModal={openLoginModal}
        closeSignupModal={closeSignupModal}
        closeRecuperarContraseniaModal={closeRecuperarContraseniaModal}
        onDrawerMenuClose={onDrawerMenuClose}
      />
      <Modal
        closeOnOverlayClick={false}
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        isCentered
        motionPreset="scale"
      >
        <ModalOverlay />
        <ModalContent p={4} w={{ base: "95%", lg: "100%" }}>
          <ModalHeader mx="auto">
            {" "}
            {loading ? "Ingresando" : "Ingresar"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
                <Box as="form" onSubmit={handleSubmit}>
                  <VStack spacing={4} width="100%">
                    <FormControl isRequired>
                      <FormLabel m={0}>Correo Electrónico</FormLabel>
                      <Input
                        type="email"
                        placeholder="Ingrese su correo electrónico"
                        variant="flushed"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel m={0}>Contraseña</FormLabel>
                      <Input
                        type="password"
                        placeholder="Ingrese su contraseña"
                        variant="flushed"
                        value={clave}
                        onChange={(e) => setClave(e.target.value)}
                      />
                    </FormControl>
                    <ReCAPTCHA
                      sitekey={import.meta.env.VITE_RECAPTCHA_KEY}
                      ref={captcha}
                      onChange={handleReCaptcha}
                    />
                  </VStack>
                  <Button 
                  type="submit" 
                  color={"botonColor"}
                  bg={"botonBg"}
                  _hover={{
                    transition: "all 1s ease-out",
                    borderColor: "botonBg",
                    bg: "#292828",
                  }}
                  width="100%" 
                  mt={3}
                  >
                    Ingresar
                  </Button>
                  {error && (
                    <Text color="red.500" mt={4}>
                      {error}
                    </Text>
                  )}
                </Box>
                <ModalFooter
                  flexWrap="wrap"
                  px={0}
                  textAlign="start"
                  justifyContent="start"
                  gap={3}
                  fontSize={{ base: "sm", lg: "md" }}
                >
                  <Text>
                    ¿Olvidaste la contraseña?
                    <Box as="span">
                      {" "}
                      Por favor ponte en contacto con{" "}
                      <Box as="span" fontWeight={600}>
                        alltoimportsas@gmail.com
                      </Box>
                    </Box>
                  </Text>
                  <Text>
                    ¿Aún no estás registrado?
                    <Link
                      ml={2}
                      color="link"
                      textDecoration="underline"
                      onClick={() => {
                        setError("");
                        closeLoginModal();
                        openSignupModal();
                      }}
                    >
                      Crear una cuenta
                    </Link>
                  </Text>
                </ModalFooter>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      <Registrarse />
      <RecuperarContrasenia />
    </>
  );
};

export default Login;
