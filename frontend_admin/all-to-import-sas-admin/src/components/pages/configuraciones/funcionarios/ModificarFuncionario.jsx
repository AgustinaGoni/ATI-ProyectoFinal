import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import { obtenerFuncionarioPorId } from "../../../../js/api/usuarios/funcionario/obtenerFuncionarioPorId";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { validarDatos } from "../../../../js/validarDatos";
import { API_URL, getToken } from "../../../../js/config";
import { IconArrowLeft } from "@tabler/icons-react";
import { getIdUsuarioDesdeToken } from "../../../../js/api/usuarios/funcionario/obtenerDatosFuncionario";

const ModificarFuncionario = () => {
  const { id } = useParams();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [funcionario, setFuncionario] = useState({});
  const [loading, setLoading] = useState(false);
  const [datosModificados, setDatosModificados] = useState({
    nombre: "",
    apellido: "",
    correoElectronico: "",
  });
  const [erroresDatos, setErroresDatos] = useState({});
  useEffect(() => {
    fetchFuncionario();
  }, [id]);

  const fetchFuncionario = async () => {
    try {
      setLoading(true);
      const f = await obtenerFuncionarioPorId(id);
      console.log(f);
      setFuncionario(f);
      setDatosModificados({
        nombre: f.nombre,
        apellido: f.apellido,
        correoElectronico: f.correoElectronico,
      });
    } catch (e) {
      console.log(e);
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
    const errores = validarDatos(datosModificados);

    if (Object.keys(errores).length > 0) {
      setErroresDatos(errores);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}Usuario/Funcionario/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosModificados),
      });

      const responseData = await response.json();

      if (response.ok) {
        navigate("/panel-admin/configuracion/funcionarios");
        toast({
          title: "Datos modificados",
          description:
            "Los datos del funcionario se han modificado correctamente.",
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
    }
  };

    const idUsuarioLogueado = getIdUsuarioDesdeToken();
const [verificarId, setVerificarId] = useState(false)
useEffect(() => {
  if (idUsuarioLogueado === id) {
    setVerificarId(true);
  } else {
    setVerificarId(false);
  }
}, [id, idUsuarioLogueado]);

  return (
    <>
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
          <Flex gap={8} justifyContent={"start"} flexDirection={"column"}>
            <Box>
              <Button
                variant={"link"}
                as={RouterLink}
                to="/panel-admin/configuracion/funcionarios"
              >
                <IconArrowLeft />
                Atrás
              </Button>
            </Box>
            <Box>
              <Heading size="lg">
                Modificar datos del funcionario:{" "}
                <Box as="span" fontWeight={400}>
                  {" "}
                  {funcionario.nombre} {funcionario.apellido}
                </Box>
              </Heading>
            </Box>
          </Flex>
          <Box as="form" onSubmit={handleSubmit} mt={8}>
            <VStack spacing={4} width="100%">
              <FormControl isInvalid={erroresDatos.nombre}>
                <FormLabel>Nombre</FormLabel>
                <Input
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
                <FormLabel>Apellido</FormLabel>
                <Input
                  name="apellido"
                  placeholder="Ingresar apellido"
                  value={datosModificados.apellido}
                  onChange={handleChange}
                />
                {erroresDatos.apellido && (
                  <FormErrorMessage>{erroresDatos.apellido}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={erroresDatos.correoElectronico}>
                <FormLabel>Correo Electrónico</FormLabel>
                <Input
                  name="correoElectronico"
                  placeholder="Ingresar correo electrónico"
                  type="text"
                  value={datosModificados.correoElectronico}
                  onChange={handleChange}
                />
                {erroresDatos.correoElectronico && (
                  <FormErrorMessage>
                    {erroresDatos.correoElectronico}
                  </FormErrorMessage>
                )}
              </FormControl>
              <Flex w={"full"} justifyContent={"end"} gap={8}>
                <Button  variant={"outline"}
                  color={"botonBg"}
                  _hover={{
                    transition: "0.5s ease",
                    bg: "botonBg",
                    color: "botonColor",
                  }} type="submit">
                  Guardar cambios
                </Button>
                <Button
                  isDisabled={verificarId}
                  variant={'outline'} 
                  color={"red"}                
                  _hover={{
                    transition: '0.5s ease',
                    bg:'red',
                    color: 'botonColor'
                  }}
                  onClick={onOpen}
                >
                  Eliminar
                </Button>
              </Flex>
            </VStack>
          </Box>
          <ConfirmarEliminacion isOpen={isOpen} onClose={onClose} id={id} />
        </>
      )}
    </>
  );
};

export default ModificarFuncionario;

const ConfirmarEliminacion = ({ isOpen, onClose, id }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleEliminarFuncionario = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}Usuario/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        navigate("/panel-admin/configuracion/funcionarios");

        toast({
          title: "Funcionario eliminado",
          description: "El funcionario se ha eliminado correctamente.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } else {
        const mensajeError =
          responseData.mensaje || "Error al eliminar el funcionario.";
        setErroresDatos((prev) => ({
          ...prev,
          contrasenia: mensajeError,
        }));
      }
    } catch (e) {
      console.error("Error:", e);
      toast({
        title: "Hubo un error",
        description: e.message || "Error al eliminar el funcionario.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Eliminar funcionario</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {!loading ? (
            <Text>¿Seguro que desea eliminar al funcionario?</Text>
          ) : (
            <Flex justifyContent="center" alignItems="center">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            </Flex>
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme={"gray"} mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant={"link"}
            _hover={{
              color: "red",
            }}
            onClick={handleEliminarFuncionario}
          >
            Confirmar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
