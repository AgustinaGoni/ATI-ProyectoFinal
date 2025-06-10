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
import { useNavigate, useParams } from "react-router-dom";
import { obtenerDatosDelNegocioPorId } from "../../../js/api/obtenerDatosDelNegocioPorId";
import { modificarDatosNegocio } from "../../../js/api/modificarDatosNegocio";

const ModificarDatosReitro = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false); // Añadir estado loading
  const toast = useToast();

  const navigate = useNavigate();
  const [datosModificados, setDatosModificados] = useState({
    nombre: "",
    direccion: {
      departamento: "",
      ciudad: "",
      calle: "",
      codigoPostal: "",
      nroPuerta: "",
      nroApartamento: "",
    },
    telefono: "",
    horario: "",
  });
  const [error, setError] = useState();

  useEffect(() => {
    fetchDatosRetiro();
  }, [id]);

  const fetchDatosRetiro = async () => {
    try {
      setLoading(true);
      const datos = await obtenerDatosDelNegocioPorId(id);
      if (datos) {
        setDatosModificados({
          nombre: datos.nombre,
          direccion: {
            departamento: datos.direccion.departamento,
            ciudad: datos.direccion.ciudad,
            calle: datos.direccion.calle,
            codigoPostal: datos.direccion.codigoPostal,
            nroPuerta: datos.direccion.nroPuerta,
            nroApartamento: datos.direccion.nroApartamento,
          },
          telefono: datos.telefono,
          horario: datos.horario,
        });
      } else {
        navigate("/panel-admin/configuracion/ver-direcciones-retiro");
      }
    } catch (e) {
      console.error(e);
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosModificados((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      console.log(datosModificados);
      const registroExitoso = await modificarDatosNegocio(id, datosModificados);
      if (registroExitoso) {
        navigate("/panel-admin/configuracion/ver-direcciones-retiro");
      }
      toast({
        title: "Datos modificados",
        description: "Los datos de retiro se han modificado correctamente.",
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

  return (
    <>
      <Heading>Modificar datos de retiro</Heading>
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
                  name="nombre"
                  type="text"
                  placeholder="Ingrese nombre"
                  value={datosModificados.nombre}
                  onChange={handleChange}
                />
                <FormHelperText>
                  Nombre indentificador para la opción de envío.
                </FormHelperText>
              </FormControl>

              <FormControl id="departamento" isRequired>
                <FormLabel m={0}>Departamento</FormLabel>
                <Input
                  name="departamento"
                  type="text"
                  placeholder="Ingrese departamento"
                  value={datosModificados.direccion.departamento}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="ciudad" isRequired>
                <FormLabel m={0}>Barrio</FormLabel>
                <Input
                  name="ciudad"
                  type="text"
                  placeholder="Ingrese barrio"
                  value={datosModificados.direccion.ciudad}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="barrio" isRequired>
                <FormLabel m={0}>Calle</FormLabel>
                <Input
                  name="calle"
                  type="text"
                  placeholder="Ingrese calle"
                  value={datosModificados.direccion.calle}
                  onChange={handleChange}
                />
                <FormHelperText>Ejemplo: Calle A esq. Calle B</FormHelperText>
              </FormControl>
              <FormControl id="nroPuerto" isRequired>
                <FormLabel m={0}>Número de puerta</FormLabel>
                <Input
                  name="nroPuerta"
                  type="text"
                  placeholder="Ingrese número de puerta"
                  value={datosModificados.direccion.nroPuerta}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="nroPuerto">
                <FormLabel m={0}>Número de apartamento (Opcional)</FormLabel>
                <Input
                  name="nroApartamento"
                  type="text"
                  placeholder="Ingrese número de apartamento"
                  value={datosModificados.direccion.nroApartamento}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="barrio" isRequired>
                <FormLabel m={0}>Código postal</FormLabel>
                <Input
                  name="codigoPostal"
                  type="text"
                  placeholder="Ingrese código postal"
                  value={datosModificados.direccion.codigoPostal}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="telefono" isRequired>
                <FormLabel m={0}>Teléfono</FormLabel>
                <Input
                  name="telefono"
                  type="text"
                  placeholder="Ingrese teléfono"
                  value={datosModificados.telefono}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="horario" isRequired>
                <FormLabel m={0}>Horario</FormLabel>
                <Input
                  name="horario"
                  type="text"
                  placeholder="Ingrese horario"
                  value={datosModificados.horario}
                  onChange={handleChange}
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
                Modificar
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

export default ModificarDatosReitro;
