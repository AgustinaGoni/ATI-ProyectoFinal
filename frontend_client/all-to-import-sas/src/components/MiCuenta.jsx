import React, { useEffect, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Highlight,
  IconButton,
  Input,
  Link as ChakraLink,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Select,
  Skeleton,
  Spinner,
  Stack,
  Text,
  Textarea,
  useBreakpointValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useUsuario } from "../hooks/useUsuario";
import {
  IconBuilding,
  IconMail,
  IconMapPin,
  IconNumber,
  IconNumber123,
  IconPhone,
  IconTrashX,
  IconUser,
} from "@tabler/icons-react";
import AgregarDireccion from "./usuario/direcciones/AgregarDireccion";
// import EliminarDireccion from "./usuario/direcciones/EliminarDireccion";
import EditarDatos from "./usuario/EditarDatos";
import Cargando from "./Cargando";

const MiCuenta = () => {
  const navigate = useNavigate();
  const { usuario, loading, actualizarUsuario } = useUsuario();
  const [direcciones, setDirecciones] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenEditarDatos,
    onOpen: onOpenEditarDatos,
    onClose: onCloseEditarDatos,
  } = useDisclosure();

  useEffect(() => {
    if (usuario && usuario.direcciones) {
      setDirecciones(usuario.direcciones);
    }
  }, [usuario]);

  const handleDireccionAgregada = (nuevaDireccion) => {
    setDirecciones((prevDirecciones) => [...prevDirecciones, nuevaDireccion]);
  };

  const handleDatosActualizados = async () => {
    await actualizarUsuario(); // Actualiza los datos del usuario después de editar
  };

  const gridTemplateAreas = useBreakpointValue({
    base: ` "compras" "datos" "direccion"`,
    lg: `"compras compras" "datos direccion" `,
  });

  return (
    <Container maxW="1280px" px={0} my={8}>
      <Heading
        textAlign={"center"}
        lineHeight={1.1}
        fontWeight={600}
        fontSize={{ base: "xl", sm: "3xl", lg: "5xl" }}
      >
        Mi cuenta
      </Heading>
      {loading ? (
        <Stack>
          <Box my={4}>
            <Cargando columns={1} rows={1} width="50%" startColor="blue.300" />
          </Box>
          <Box my={4}>
            <Cargando columns={1} rows={1} width="50%" startColor="blue.300" />
          </Box>
        </Stack>
      ) : (
        <Grid
          templateAreas={gridTemplateAreas}
          columnGap={8}
          rowGap={10}
          my={8}
          px={{ base: 4, lg: 0 }}
        >
          <GridItem area={"compras"}>
            <Button
              as={RouterLink}
              textDecoration={"none"}
              variant={"solid"}
              border="1px solid"
              borderColor="botonBg"
              bg="botonColor"
              color="botonBg"
              _hover={{
                transition: "all .5s ease-out",
                bg: "botonBg",
                color: "botonColor",
                border: "1px solid",
              }}
              size={{ base: "sm" }}
              to={"/mis-compras"}
            >
              Ver todas mis compras
            </Button>
          </GridItem>
          <GridItem area={"datos"}>
            <Flex
              flexDirection={"column"}
              gap={6}
              border={"1px solid"}
              borderColor={"gray.300"}
             rounded={8}
              boxShadow="2xl"
              p={4}
            >
              <Heading as={"h3"} size="md">
                Mis datos
              </Heading>

              <Box>
                <Text fontWeight={"600"}>Nombre</Text>
                <Flex
                  gap={2}
                  alignItems={"center"}
                  bg={"#eee"}
                  p={2}
                  mt={2}
                  rounded={8}
                >
                  <IconUser />
                  {usuario.nombre}
                </Flex>
              </Box>
              <Box>
                <Text fontWeight={"600"}>Apellido</Text>
                <Flex
                  gap={2}
                  alignItems={"center"}
                  bg={"#eee"}
                  p={2}
                  mt={2}
                  rounded={8}
                >
                  <IconUser />
                  {usuario.apellido}
                </Flex>
              </Box>
              <Box>
                <Text fontWeight={"600"}>Documento de identidad</Text>
                <Flex
                  gap={2}
                  alignItems={"center"}
                  bg={"#eee"}
                  p={2}
                  mt={2}
                  rounded={8}
                >
                  <IconUser />
                  {usuario.documentoIdentidad
                    ? usuario.documentoIdentidad
                    : "0.000.000-0"}
                </Flex>
              </Box>
              <Box>
                <Text fontWeight={"600"}>Teléfono</Text>
                <Flex
                  gap={2}
                  alignItems={"center"}
                  bg={"#eee"}
                  p={2}
                  mt={2}
                  rounded={8}
                >
                  <IconPhone />
                  {usuario.telefono
                    ? usuario.telefono.replace(
                        /(\d{3})(\d{3})(\d{3})/,
                        "$1 $2 $3"
                      )
                    : "000 000 000"}
                </Flex>
              </Box>

              <Box>
                <Text fontWeight={"600"}> Correo Electrónico</Text>
                <Flex
                  gap={2}
                  alignItems={"center"}
                  bg={"#eee"}
                  p={2}
                  mt={2}
                  rounded={8}
                >
                  <IconMail />
                  {usuario.correoElectronico}
                </Flex>
              </Box>

              <Box>
                <Text fontWeight={"600"}> Razón Social</Text>
                <Flex
                  gap={2}
                  alignItems={"center"}
                  bg={"#eee"}
                  p={2}
                  mt={2}
                  rounded={8}
                >
                  <IconBuilding />
                  {usuario.razonSocial ? usuario.razonSocial : "Sin datos"}
                </Flex>
              </Box>
              <Box>
                <Text fontWeight={"600"}>RUT</Text>
                <Flex
                  gap={2}
                  alignItems={"center"}
                  bg={"#eee"}
                  p={2}
                  mt={2}
                  rounded={8}
                >
                  <IconNumber />
                  {usuario.rut ? usuario.rut : "Sin datos"}
                </Flex>
              </Box>

              {/* <Text>
                ¿Quieres cambiar la contraseña?{" "}
                <ChakraLink color={"blue"} textDecoration={"underline"}>
                  Clic aquí{" "}
                </ChakraLink>
              </Text> */}
              <Box>
                <Button
                  variant={"solid"}
                  color={"botonColor"}
                  bg={"botonBg"}
                  border="1px solid"
                  borderColor="transparent"
                  _hover={{
                    transition: "all .5s ease-out",
                    border: "1px solid",
                    borderColor: "botonBg",
                    bg: "botonColor",
                    color: "botonBg",
                  }}
                  size={{ base: "sm" }}
                  w={"auto"}
                  minWidth="fit-content"
                  onClick={onOpenEditarDatos}
                >
                  Editar mis datos
                </Button>
              </Box>
            </Flex>
          </GridItem>
          <GridItem area={"direccion"}>
            <Flex
              flexDirection={"column"}
              gap={6}
              border={"1px solid"}
              borderColor={"gray.300"}
              rounded={8}
              boxShadow="2xl"
              p={4}
            >
              <Heading as={"h3"} size="md">
                Mis direcciones
              </Heading>
              {direcciones.length == 0 ? (
                <Text>No tienes direcciones registradas</Text>
              ) : (
                direcciones.map((direccion, index) => (
                  <Box key={direccion.id} bg={"#eee"} p={2} rounded={8}>
                    <Flex gap={2}>
                      <IconMapPin />
                      <Text fontWeight={"600"}>Dirección {index + 1}</Text>
                    </Flex>
                    <Flex
                      flexDirection={"column"}
                      justifyContent={"space-between"}
                    >
                      <Text>Departamento: {direccion.departamento}</Text>
                      <Text>
                        Ciuadad: {direccion.ciudad} {direccion.codigoPostal}
                      </Text>
                      <Text>
                        Calle: {direccion.calle} {direccion.nroPuerta}
                      </Text>
                      <Text>
                        Nro. Apartamento:{" "}
                        {direccion.nroApartamento
                          ? direccion.nroApartamento
                          : "S/N"}
                      </Text>
                      <Text>
                        Comentario:{" "}
                        {direccion.comentario
                          ? direccion.comentario
                          : "Sin comentario"}
                      </Text>
                    </Flex>
                  </Box>
                ))
              )}
              <Box>
                <Button
                  variant={"solid"}
                  color={"botonColor"}
                  bg={"botonBg"}
                  border="1px solid"
                  borderColor="transparent"
                  _hover={{
                    transition: "all .5s ease-out",
                    border: "1px solid",
                    borderColor: "botonBg",
                    bg: "botonColor",
                    color: "botonBg",
                  }}
                  size={{ base: "sm" }}
                  w={"auto"}
                  minWidth="fit-content"
                  onClick={onOpen}
                >
                  Agregar una dirección
                </Button>
              </Box>
            </Flex>
          </GridItem>
        </Grid>
      )}
      <AgregarDireccion
        isOpen={isOpen}
        onClose={onClose}
        idCliente={usuario.id}
        onDireccionAgregada={handleDireccionAgregada}
      />
      <EditarDatos
        usuario={usuario}
        isOpenEditarDatos={isOpenEditarDatos}
        onCloseEditarDatos={() => {
          handleDatosActualizados(); 
          onCloseEditarDatos();
        }}
      />
    </Container>
  );
};

export default MiCuenta;
