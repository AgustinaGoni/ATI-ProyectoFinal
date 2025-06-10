import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { obtenerCategoriaPorId } from "../../js/api/categorias/obtenerCategoriaPorId";
import Cargando from "../Cargando";
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
} from "@chakra-ui/react";
import { IconArrowLeft } from "@tabler/icons-react";

const EditarCategoria = () => {
  const { id } = useParams();
  const [categoria, setcategoria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const categoria = await obtenerCategoriaPorId(id);
      setcategoria(categoria);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
                onClick={() => navigate("/categorias")}
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
                {/* <Grid gap={20}> */}
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
                    type="text"
                    value={categoria.nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Descripción</FormLabel>
                  <Textarea
                    type="text"
                    minH={"150px"}
                    defaultValue={categoria.descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                </FormControl>
                {/* </Grid> */}
              </GridItem>
              <GridItem>
                <Button colorScheme={"teal"} type="submit">
                  Guardar cambios
                </Button>
                {/* Verificar que no se pueda eliminar la categoria "Sin Categoria" ya que es una por defecto */}
                <Button ml={8} variant={'outline'} colorScheme={"red"}>Eliminar</Button>
              </GridItem>
            </Grid>
          </Box>
        </>
      )}
    </>
  );
};

export default EditarCategoria;
