import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { IconXboxX } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registrarFuncionario } from "../../../../js/api/usuarios/funcionario/registrarFuncionario";
const RegistrarFuncionario = () => {
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState();
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const usuario = {
        nombre,
        apellido,
        correoElectronico,
        contrasenia,
      };
      const registroExitoso  = await registrarFuncionario(usuario); 
      if (registroExitoso) {
        navigate("/panel-admin/configuracion/funcionarios");
      }
      toast({
        title: "Registro exitoso",
        description: "Nuevo funcionario registrado con exito",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      })
    } catch (e) {
      console.error("Error al registrarse:", e);
      setError(e.message)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setNombre("");
    setApellido("");
    setCorreoElectronico("");
    setContrasenia("");
  }, []);

  return (
    <>
      <Heading>Agregar nuevo funcionario</Heading>
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
            <Text>Registrando nuevo funcionaro</Text>
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
              <FormControl id="nombre" isRequired>
                <FormLabel m={0}>Nombre</FormLabel>
                <Input
                  type="text"
                  placeholder="Ingrese nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </FormControl>

              <FormControl id="apellido" isRequired>
                <FormLabel m={0}>Apellido</FormLabel>
                <Input
                  type="text"
                  placeholder="Ingrese apellido"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                />
              </FormControl>
              <FormControl id="correoElectronico" isRequired>
                <FormLabel m={0}>Correo Electrónico</FormLabel>
                <Input
                  type="text"
                  placeholder="Ingrese correo electrónico"
                  value={correoElectronico}
                  onChange={(e) => setCorreoElectronico(e.target.value)}
                />
              </FormControl>
              <FormControl id="contrasenia" isRequired>
                <FormLabel m={0}>Contraseña</FormLabel>
                <Input
                  type="password"
                  placeholder="Ingrese contraseña"
                  value={contrasenia}
                  onChange={(e) => setContrasenia(e.target.value)}
                />
                <FormHelperText>La contraseña debe tener al menos 8 carecteres, una letra mayúscula, una minúscula, un número, y un carácter especial.</FormHelperText>
              </FormControl>
            </VStack>
            <VStack w="100%">
              <Button
                type="submit"
                variant={"outline"}
                color={"botonBg"}
                _hover={{
                  transition: "0.5s ease",
                  bg: "botonBg",
                  color: "botonColor",
                }}
                w="100%"
              >
                Registrar
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
    </>
  );
};

export default RegistrarFuncionario;
