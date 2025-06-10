import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { verificarNumeroTelefonico } from "../../js/validaciones/numeroTelefonico";
import { verificarDocumentoDeIdentidad } from "../../js/validaciones/documentoDeIdentidad";
import { API_URL, getToken } from "../../js/config";

const validarDatos = (datos) => {
  const { nombre, apellido, telefono, documentoIdentidad, rut, razonSocial } =
    datos;

  const errores = {};

  if (!nombre) errores.nombre = "El nombre es requerido.";
  if (!apellido) errores.apellido = "El apellido es requerido.";
  if (!telefono) {
    errores.telefono = "El número de teléfono es requerido.";
  } else if (!verificarNumeroTelefonico(telefono)) {
    errores.telefono = "El número de teléfono no es válido.";
  }
  if ((!razonSocial && rut) || (razonSocial && !rut)) {
    if (!razonSocial) errores.razonSocial = "La razón social es requerida.";
    if (!rut) errores.rut = "El RUT es requerido.";
  }
  if (!documentoIdentidad) {
    errores.documentoIdentidad = "El documento de identidad es requerido.";
  } else if (!verificarDocumentoDeIdentidad(documentoIdentidad)) {
    errores.documentoIdentidad =
      "El documento de identidad ingresado es incorrecto.";
  }

  return errores;
};

const EditarDatos = ({ usuario, isOpenEditarDatos, onCloseEditarDatos }) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [contrasenia, setContrasenia] = useState("");
  const [datosModificados, setDatosModificados] = useState({
    nombre: usuario.nombre || "",
    apellido: usuario.apellido || "",
    telefono: usuario.telefono || "",
    razonSocial: usuario.razonSocial || "",
    rut: usuario.rut || "",
    documentoIdentidad: usuario.documentoIdentidad || "",
  });
  const [erroresDatos, setErroresDatos] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosModificados((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errores = validarDatos(datosModificados);

    if (Object.keys(errores).length > 0) {
      setErroresDatos(errores);
      return;
    }

    if (!contrasenia) {
      setErroresDatos((prev) => ({
        ...prev,
        contrasenia: "La contraseña es requerida.",
      }));
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}Usuario/Cliente/${usuario.id}?contrasenia=${contrasenia}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datosModificados),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        onCloseEditarDatos();
        setDatosModificados({
          nombre: usuario.nombre || "",
          apellido: usuario.apellido || "",
          telefono: usuario.telefono || "",
          razonSocial: usuario.razonSocial || "",
          rut: usuario.rut || "",
          documentoIdentidad: usuario.documentoIdentidad || "",
        });
        toast({
          title: "Datos modificados",
          description: "Tus datos se han modificado correctamente.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } else {
        const mensajeError =
          responseData.mensaje || "Error al guardar los nuevos datos.";
        setErroresDatos((prev) => ({
          ...prev,
          contrasenia: mensajeError,
        }));
      }
    } catch (e) {
      console.error("Error:", e);
      toast({
        title: "Hubo un error",
        description: e.message || "Error al guardar los nuevos datos.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setLoading(false);
      setContrasenia("");
    }
  };

  const handleClose = () => {
    setErroresDatos({});
    onCloseEditarDatos();
  };

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpenEditarDatos}
      onClose={onCloseEditarDatos}
    >
      <ModalOverlay />
      <ModalContent w={{ base: "95%", lg: "100%" }}>
        <ModalHeader mx="auto">
          {loading ? "Modificando los datos" : "Editar mis datos"}
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
            <Box as="form" onSubmit={handleSubmit}>
              <VStack spacing={4} width="100%">
                <FormControl isInvalid={erroresDatos.nombre}>
                  <FormLabel fontWeight={600} m={0}>
                    Nombre{" "}
                    <Text as={"span"} color={"red.600"}>
                      *
                    </Text>
                  </FormLabel>
                  <Input
                  variant={'flushed'}
                    name="nombre"
                    placeholder="Ingresar nombre"
                    value={datosModificados.nombre}
                    onChange={handleChange}
                  />
                  {erroresDatos.nombre && (
                    <FormErrorMessage>{erroresDatos.nombre}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={erroresDatos.apellido}>
                  <FormLabel fontWeight={600} m={0}>
                    Apellido{" "}
                    <Text as={"span"} color={"red.600"}>
                      *
                    </Text>
                  </FormLabel>
                  <Input
                  variant={'flushed'}
                    name="apellido"
                    placeholder="Ingresar apellido"
                    value={datosModificados.apellido}
                    onChange={handleChange}
                  />
                  {erroresDatos.apellido && (
                    <FormErrorMessage>{erroresDatos.apellido}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={erroresDatos.telefono}>
                  <FormLabel fontWeight={600} m={0}>
                    Teléfono{" "}
                    <Text as={"span"} color={"red.600"}>
                      *
                    </Text>
                  </FormLabel>
                  <Input
                  variant={'flushed'}
                    name="telefono"
                    placeholder="Ingresar teléfono"
                    type="text"
                    value={datosModificados.telefono}
                    onChange={handleChange}
                  />
                  {erroresDatos.telefono && (
                    <FormErrorMessage>{erroresDatos.telefono}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={erroresDatos.documentoIdentidad}>
                  <FormLabel fontWeight={600} m={0}>
                    Documento de Identidad{" "}
                    <Text as={"span"} color={"red.600"}>
                      *
                    </Text>
                  </FormLabel>
                  <Input
                  variant={'flushed'}
                    maxLength={8}
                    name="documentoIdentidad"
                    placeholder="Ingresar documento de identidad"
                    value={datosModificados.documentoIdentidad}
                    onChange={handleChange}
                  />
                  {erroresDatos.documentoIdentidad && (
                    <FormErrorMessage>
                      {erroresDatos.documentoIdentidad}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={erroresDatos.razonSocial}>
                  <FormLabel fontWeight={600} m={0}>
                    Razón Social{" "}
                    <Box as="span" color={"gray"} fontWeight={"light"}>
                      (Opcional)
                    </Box>
                  </FormLabel>
                  <Input
                  variant={'flushed'}
                    name="razonSocial"
                    placeholder="Ingresar razón social"
                    value={datosModificados.razonSocial}
                    onChange={handleChange}
                  />
                  {erroresDatos.razonSocial && (
                    <FormErrorMessage>
                      {erroresDatos.razonSocial}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={erroresDatos.rut}>
                  <FormLabel fontWeight={600} m={0}>
                    RUT{" "}
                    <Box as="span" color={"gray"} fontWeight={"light"}>
                      (Opcional)
                    </Box>
                  </FormLabel>
                  <Input
                  variant={'flushed'}
                    name="rut"
                    placeholder="Ingresar rut"
                    value={datosModificados.rut}
                    onChange={handleChange}
                  />
                  {erroresDatos.rut && (
                    <FormErrorMessage>{erroresDatos.rut}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={erroresDatos.contrasenia}>
                  <FormLabel fontWeight={600} m={0}>
                    Ingresar contraseña para confirmar{" "}
                    <Text as={"span"} color={"red.600"}>
                      *
                    </Text>
                  </FormLabel>
                  <Input
                  variant={'flushed'}
                    name="contrasenia"
                    type="password"
                    placeholder="Ingrese su contraseña"
                    onChange={(e) => setContrasenia(e.target.value)}
                  />
                  {erroresDatos.contrasenia && (
                    <FormErrorMessage>
                      {erroresDatos.contrasenia}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <Flex w={"full"} justifyContent={"end"} gap={8}>
                  <Button
                    variant="ghost"
                    size={{ base: "sm" }}
                    color={"primary"}
                    fontWeight={600}
                    onClick={handleClose}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
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
                  >
                    Guardar cambios
                  </Button>
                </Flex>
              </VStack>
            </Box>
          )}
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditarDatos;
