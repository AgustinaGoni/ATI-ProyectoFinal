import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Image,
  Input,
  Select,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { IconArrowLeft } from "@tabler/icons-react";
import { editarProducto } from "../../../js/api/productos/editarProducto";
import { obtenerProductoPorId } from "../../../js/api/productos/obtenerProductoPorId";
import { useCategorias } from "../../../hooks/useCategorias";

const EditarProducto = () => {
  const { id } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const [producto, setProducto] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    imagen: "",
    precio: "",
    stock: "",
    categoria: { nombre: "" },
  });
  const [descripcionModificada, setDescripcionModificada] = useState("");
  const [categoriaActual, setcategoriaActual] = useState(0);
  const [loading, setLoading] = useState(false);
  const { categorias } = useCategorias();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const producto = await obtenerProductoPorId(id);
      setProducto(producto);
      setDescripcionModificada(producto.descripcion);
      setcategoriaActual(producto.categoria.id);
    };

    fetchData();
  }, []);

  const { codigo, nombre, descripcion, imagen, precio, stock, categoria } =
    producto;

  const [previewImage, setPreviewImage] = useState(null);

  const handleCategoriaChange = (e) => {
    setcategoriaActual(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // Crear una URL de vista previa para la imagen seleccionada
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const getBase64String = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result
          .replace("data:", "")
          .replace(/^.+,/, "");
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const solicitud = {
      idProducto: Number(id),
      descripcion: descripcionModificada,
      idCategoria: Number(categoriaActual),
      imagenBase64: imagen,
    };

    if (selectedFile) {
      try {
        solicitud.imagenBase64 = await getBase64String(selectedFile);
      } catch (error) {
        console.error("Error al leer la imagen:", error);
        toast({
          position: "top",
          title: "Error",
          description: "Hubo un error al leer la imagen seleccionada.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
    }

    try {
      const result = await editarProducto(solicitud);
      if (result) {
        navigate("/panel-admin/productos");
      }
      toast({
        position: "top",
        title: "Producto actualizado",
        description: result || "El producto se ha actualizado correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        position: "top",
        title: "Error",
        description:
          error.message || "Hubo un error al actualizar el producto.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

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
          <Box mx={10}>
            <Flex gap={8} justifyContent={"start"} flexDirection={"column"}>
              <Box>
                <Button
                  alignItems={"center"}
                  variant={"link"}
                  onClick={() => navigate("/panel-admin/productos")}
                >
                  <IconArrowLeft />
                  Atrás
                </Button>
              </Box>
              <Box>
                <Heading mb={10} size="lg">
                  Editar producto:{" "}
                  <Box as="span" fontWeight={400}>
                    {nombre}
                  </Box>
                </Heading>
              </Box>
            </Flex>
            <Text>
              Id:{" "}
              <Box as="span" fontWeight={"semibold"}>
                {id}
              </Box>
            </Text>
            <Text>
              Codigo:{" "}
              <Box as="span" fontWeight={"semibold"}>
                {codigo}
              </Box>
            </Text>
            <Text>
              Nombre:{" "}
              <Box as="span" fontWeight={"semibold"}>
                {nombre}
              </Box>
            </Text>
            <Text>
              Precio: ${" "}
              <Box as="span" fontWeight={"semibold"}>
                {precio}
              </Box>
            </Text>
            <Text>
              Stock:{" "}
              <Box as="span" fontWeight={"semibold"}>
                {stock}
              </Box>
            </Text>{" "}
          </Box>
          <Box as="form" onSubmit={handleSubmit} mx={10} mt={4}>
            <Grid templateColumns="repeat(1, 1fr)" gap={6} width={"50%"}>
              <FormControl isRequired>
                <FormLabel>Categoría</FormLabel>
                <Select
                  bg={"background"}
                  placeholder="Selecciona una categoría"
                  value={categoriaActual}
                  onChange={handleCategoriaChange}
                >
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Descripción</FormLabel>
                <Textarea
                  bg={"background"}
                  type="text"
                  defaultValue={descripcion}
                  onChange={(e) => setDescripcionModificada(e.target.value)}
                  h={"150px"}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Imagen</FormLabel>
                <Flex
                  alignItems={"flex-start"}
                  gap={4}
                  flexDirection={"column"}
                >
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt="Vista previa"
                      boxSize="350px"
                      objectFit="contain"
                    />
                  ) : imagen ? (
                    <Image
                      src={`data:image/jpeg;base64,${imagen}`}
                      alt="Imagen actual"
                      boxSize="350px"
                      objectFit="contain"
                    />
                  ) : (
                    <p>No hay imagen disponible</p>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    variant="unstyled"
                  />
                </Flex>
              </FormControl>
              <Flex gap={8}>
                <Button colorScheme={"teal"} type="submit">
                  Guardar cambios
                </Button>
              </Flex>
            </Grid>
          </Box>
        </>
      )}
    </>
  );
};

export default EditarProducto;
