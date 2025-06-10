import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Textarea,
  useDisclosure,
  useToast,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { IconArrowLeft } from "@tabler/icons-react";
import { obtenerCategoriaPorId } from "../../../js/api/categorias/obtenerCategoriaPorId";
import Cargando from "../../Cargando";
import { eliminarCategoria } from "../../../js/api/categorias/eliminarCategoria";
import { modificarCategoria } from "../../../js/api/categorias/modificarCategoria";

const ModificarCategoria = () => {
  const { id } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [categoria, setcategoria] = useState([]);
  const [loading, setLoading] = useState(false);
  const [datosModificados, setDatosModificados] = useState({
    nombre: "",
    descripcion: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const categoria = await obtenerCategoriaPorId(id);
      setcategoria(categoria);
      setLoading(false);
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

    try {
      const respuesta = await modificarCategoria(id, datosModificados);
      console.log(respuesta)
      if (respuesta) {
        navigate("/panel-admin/categorias");
        toast({
          title: "Datos modificados",
          description:
            "Los datos de la categoría se han modificado correctamente.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } 
    } catch (e) {
      toast({
        title: "Hubo un error",
        description: e.message || "Error al modifciar la categoría.",
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
    <>
      {loading ? (
        <>
          <Box m={10}>
            <Box my={4}>
              <Cargando
                columns={1}
                rows={1}
                width="50%"
                startColor="blue.600"
              />
            </Box>
            <Box my={4}>
              <Cargando
                columns={1}
                rows={1}
                width="25%"
                startColor="blue.600"
              />
            </Box>
            <Box my={4}>
              <Cargando
                columns={1}
                rows={1}
                width="50%"
                startColor="blue.300"
              />
            </Box>
            <Box my={4}>
              <Cargando
                columns={1}
                rows={1}
                width="25%"
                startColor="blue.600"
              />
            </Box>
            <Box my={4}>
              <Cargando
                columns={1}
                rows={1}
                width="50%"
                startColor="blue.300"
              />
            </Box>
            <Box my={4}>
              <Cargando
                columns={1}
                rows={1}
                width="25%"
                startColor="blue.600"
              />
            </Box>
            <Box my={4}>
              <Cargando
                columns={1}
                rows={1}
                width="50%"
                height="50px"
                startColor="blue.300"
              />
            </Box>
            <Box my={4}>
              <Cargando
                columns={1}
                rows={1}
                width="25%"
                startColor="blue.600"
              />
            </Box>
          </Box>
        </>
      ) : (
        <>
          <Flex
            mx={10}
            gap={8}
            justifyContent={"start"}
            flexDirection={"column"}
          >
            <Box>
              <Button
                alignItems={"center"}
                variant={"link"}
                onClick={() => navigate("/panel-admin/categorias")}
              >
                <IconArrowLeft />
                Atrás
              </Button>
            </Box>
            <Box>
              <Heading>Editar categoría - {categoria.nombre}</Heading>
            </Box>
          </Flex>
          <Box as="form" onSubmit={handleSubmit} m={10}>
            <Grid w={"50%"} gap={6}>
              <GridItem>
                <FormControl>
                  <FormLabel>Id</FormLabel>
                  <Input
                    bg={"gray.100"}
                    type="text"
                    value={id}
                    readOnly
                    required
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                  name="nombre"
                    type="text"
                    defaultValue={categoria.nombre}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Descripción</FormLabel>
                  <Textarea
                  name="descripcion"
                    type="text"
                    minH={"150px"}
                    defaultValue={categoria.descripcion}
                    onChange={handleChange}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <Button
                  variant={"outline"}
                  color={"botonBg"}
                  _hover={{
                    transition: "0.5s ease",
                    bg: "botonBg",
                    color: "botonColor",
                  }}
                  type="submit"
                >
                  Guardar cambios
                </Button>
                <Button
                  variant={"outline"}
                  color={"red"}
                  _hover={{
                    transition: "0.5s ease",
                    bg: "red",
                    color: "botonColor",
                  }}
                  onClick={onOpen}
                >
                  Eliminar
                </Button>
              </GridItem>
            </Grid>
          </Box>
          <ConfirmarEliminacion isOpen={isOpen} onClose={onClose} id={id} />
        </>
      )}
    </>
  );
};

export default ModificarCategoria;

const ConfirmarEliminacion = ({ isOpen, onClose, id }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleEliminarCategoria = async () => {
    try {
      setLoading(true);

      const respuesta = await eliminarCategoria(id);

      if (respuesta) {
        navigate("/panel-admin/categorias");

        toast({
          title: "Categoría eliminada",
          description: "La categoría se ha eliminado correctamente.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } else {
        const mensajeError = "Error al eliminar la categoría.";
        setErroresDatos((prev) => ({
          ...prev,
          contrasenia: mensajeError,
        }));
      }
    } catch (e) {
      console.error("Error:", e);
      toast({
        title: "Hubo un error",
        description: e.message || "Error al eliminar la categoría.",
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
        <ModalHeader>Eliminar categoría</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {!loading ? (
            <Text>¿Seguro que desea eliminar la categoría?</Text>
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
            onClick={handleEliminarCategoria}
          >
            Confirmar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
