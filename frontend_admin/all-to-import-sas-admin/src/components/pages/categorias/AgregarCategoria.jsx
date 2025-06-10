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
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { agregarCategoria } from "../../../js/api/categorias/agregarCategoria";
import { useNavigate } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons-react";

const AgregarCategoria = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const datos = {
        nombre,
        descripcion,
      };

     const registroExitoso = await agregarCategoria(datos);
      if (registroExitoso) {
        navigate("/panel-admin/categorias");
      }
      toast({
        title: "Registro exitoso",
        description: "Nueva categoría registrada",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (e) {
      console.error("Error al registrarse la categoria:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Flex mx={10} gap={8} justifyContent={"start"} flexDirection={"column"}>
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
          <Heading>AgrEgar una nueva categoría</Heading>
        </Box>
      </Flex>

      <Box as="form" onSubmit={handleSubmit} m={10}>
        <Grid w={"50%"} gap={6}>
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Nombre</FormLabel>
              <Input
                type="text"
                placeholder="Ingrese un nombre"
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Descripción</FormLabel>
              <Textarea
                type="text"
                placeholder="Ingrese una descripción"
                minH={"150px"}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </FormControl>
            {/* </Grid> */}
          </GridItem>
          <GridItem>
            <Button colorScheme={"teal"} type="submit">
              Guardar cambios
            </Button>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
};

export default AgregarCategoria;
