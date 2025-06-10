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
import { registrarDatosNegocio } from "../../../js/api/registrarDatosNegocio";

const AgregarDatosRetiro = () => {
  const [nombre, setNombre] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [calle, setCalle] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [nroPuerta, setNroPuerta] = useState("");
  const [nroApartamento, setNroApartamento] = useState("");
  const [telefono, setTelefono] = useState(false);
  const [horario, setHorario] = useState(false);
  const [loading, setLoading] = useState(false); // Añadir estado loading
  const navigate = useNavigate();
  const toast = useToast()
  const [error, setError] = useState();

  const handleSubmit = async (e) => {

    e.preventDefault();
    try {
      setLoading(true);
      const datos = {
        nombre,
        direccion: {
          departamento,
          ciudad,
          calle,
          codigoPostal,
          nroPuerta,
          nroApartamento,
        },
        telefono,
        horario,
      };

      const registroExitoso = await registrarDatosNegocio(datos);
      if (registroExitoso) {
        navigate("/panel-admin/configuracion/ver-direcciones-retiro");
      }
      toast({
        title: "Registro exitoso",
        description: "Nuevo lugar de retiro registrado",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (e) {
      console.error("Error al registrarse:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setNombre("");
    setDepartamento("");
    setCiudad("");
    setCalle("");
    setNroPuerta("");
    setNroApartamento("");
    setCodigoPostal("");
    setTelefono("");
    setHorario("");
  }, []);

  return (
    <>
      <Heading>Agregar nueva dirección de retiro</Heading>
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
              <FormControl id="nombre" isRequired>
                <FormLabel m={0}>Nombre</FormLabel>
                <Input
                  type="text"
                  placeholder="Ingrese nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
                <FormHelperText>
                  Nombre indentificador para la opción de envío.
                </FormHelperText>
              </FormControl>

              <FormControl id="departamento" isRequired>
                <FormLabel m={0}>Departamento</FormLabel>
                <Input
                  type="text"
                  placeholder="Ingrese departamento"
                  value={departamento}
                  onChange={(e) => setDepartamento(e.target.value)}
                />
              </FormControl>
              <FormControl id="barrio" isRequired>
                <FormLabel m={0}>Barrio</FormLabel>
                <Input
                  type="text"
                  placeholder="Ingrese barrio"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                />
              </FormControl>
              <FormControl id="barrio" isRequired>
                <FormLabel m={0}>Calle</FormLabel>
                <Input
                  type="text"
                  placeholder="Ingrese calle"
                  value={calle}
                  onChange={(e) => setCalle(e.target.value)}
                />
                <FormHelperText>Ejemplo: Calle A esq. Calle B</FormHelperText>
              </FormControl>
              <FormControl id="nroPuerto" isRequired>
                <FormLabel m={0}>Número de puerta</FormLabel>
                <Input
                  type="text"
                  placeholder="Ingrese número de puerta"
                  value={nroPuerta}
                  onChange={(e) => setNroPuerta(e.target.value)}
                />
              </FormControl>
              <FormControl id="nroPuerto">
                <FormLabel m={0}>Número de apartamento (Opcional)</FormLabel>
                <Input
                  type="text"
                  placeholder="Ingrese número de apartamento"
                  value={nroApartamento}
                  onChange={(e) => setNroApartamento(e.target.value)}
                />
              </FormControl>
              <FormControl id="barrio" isRequired>
                <FormLabel m={0}>Código postal</FormLabel>
                <Input
                  type="text"
                  placeholder="Ingrese código postal"
                  value={codigoPostal}
                  onChange={(e) => setCodigoPostal(e.target.value)}
                />
              </FormControl>
              <FormControl id="telefono" isRequired>
                <FormLabel m={0}>Teléfono</FormLabel>
                <Input
                  type="text"
                  placeholder="Ingrese teléfono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </FormControl>
              <FormControl id="horario" isRequired>
                <FormLabel m={0}>Horario</FormLabel>
                <Input
                  type="text"
                  placeholder="Ingrese horario"
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                />
                <FormHelperText>
                  Ejemplo: Lunes a Viernes de 09:00 a 18:00 horas.
                </FormHelperText>
              </FormControl>
            </VStack>
            <VStack w="100%">
              <Stack
                direction="row"
                justifyContent="space-between"
                w="100%"
              ></Stack>

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
                Agregar
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

export default AgregarDatosRetiro;
