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
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { useAuth } from "../hooks/useAuth";
import { useModal } from "../context/ModalProvider";
import ReCAPTCHA from "react-google-recaptcha";

const Registrarse = () => {
  const { registrarClienteModal, setError, error } = useAuth();
  const { isSignupModalOpen, closeSignupModal, openLoginModal } = useModal();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const captcha = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true); 
      const usuario = {
        nombre,
        apellido,
        correoElectronico,
        contrasenia,
        captchaToken: captchaToken || "",
      };
      const registroExitoso = await registrarClienteModal(usuario);
      if (registroExitoso) {
        closeSignupModal();
      }
    } catch (e) {
      console.error("Error al iniciar sesión:", e);
    } finally {
      setLoading(false);
    }
  };

  //Limpia los campos del modal al cerrarlo
  useEffect(() => {
    if (!isSignupModalOpen) {
      setNombre("");
      setApellido("");
      setCorreoElectronico("");
      setContrasenia("");
      setCaptchaToken(null);
    }
  }, [isSignupModalOpen]);

  const handleReCaptcha = () => {
    setCaptchaToken(captcha.current.getValue());
  };

  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isSignupModalOpen}
        onClose={closeSignupModal}
        isCentered
        motionPreset="scale"
      >
        <ModalOverlay />
        <ModalContent p={4} w={{ base: "95%", lg: "100%" }}>
          <ModalHeader mx="auto">
            {" "}
            {loading ? "Registrando" : "Registrarse"}
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
                      <FormLabel htmlFor="nombre" m={0}>
                        Nombre
                      </FormLabel>
                      <Input
                        id="nombre"
                        name="nombre"
                        type="text"
                        placeholder="Ingrese su nombre"
                        variant="flushed"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel htmlFor="apellido" m={0}>
                        Apellido
                      </FormLabel>
                      <Input
                        id="apellido"
                        name="apellido"
                        type="text"
                        placeholder="Ingrese su apellido"
                        variant="flushed"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel htmlFor="email" m={0}>
                        Correo Electrónico
                      </FormLabel>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Ingrese su correo electrónico"
                        variant="flushed"
                        value={correoElectronico}
                        onChange={(e) => setCorreoElectronico(e.target.value)}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel htmlFor="contrasenia" m={0}>
                        Contaseña
                      </FormLabel>
                      <Input
                        id="contrasenia"
                        name="contrasenia"
                        type="password"
                        placeholder="Ingrese su contraseña"
                        variant="flushed"
                        value={contrasenia}
                        onChange={(e) => setContrasenia(e.target.value)}
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
                  mt={8}>
                    Registrarse
                  </Button>
                  {error && (
                    <Text mt={4} color="red.500">
                      {error}
                    </Text>
                  )}
                </Box>

                <ModalFooter
                  px={0}
                  textAlign="start"
                  justifyContent="start"
                  fontSize={{ base: "sm", lg: "md" }}
                >
                  <Text py={2}>
                    ¿Ya tienes una cuenta?
                    <Link
                      ml={2}
                      color="link"
                      textDecoration="underline"
                      onClick={() => {
                        setError("");
                        closeSignupModal();
                        openLoginModal();
                      }}
                    >
                      Clic aquí
                    </Link>
                  </Text>
                </ModalFooter>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Registrarse;
