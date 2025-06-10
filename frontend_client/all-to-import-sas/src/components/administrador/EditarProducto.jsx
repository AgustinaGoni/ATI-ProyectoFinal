import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
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
import { useCategorias } from "../../hooks/useCategorias";
import {
  IconArrowLeft,
} from "@tabler/icons-react";
import { editarProducto } from "../../js/api/productos/editarProducto";
import { obtenerProductoPorId } from "../../js/api/productos/obtenerProductoPorId";

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
    categoria: { nombre: "" }, // Inicializa categoria como un objeto con nombre inicializado
  });
  const [descripcionModificada, setDescripcionModificada] = useState("");
  const [categoriaActual, setcategoriaActual] = useState(0);
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

  const [previewImage, setPreviewImage] = useState(null); // Nueva variable de estado para la imagen de vista previa

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
        description: error.message || "Hubo un error al actualizar el producto.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    // try {
    //   const response = await fetch(
    //     "https://localhost:7079/api/Producto/EditarProducto",
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(solicitud),
    //     }
    //   );

    //   const result = await response.json();
    //   if (!response.ok) {
    //     console.log(result);
    //     throw new Error(result || "Hubo un error al actualizar el producto.");
    //   }

    //   toast({
    //     position: "top",
    //     title: "Producto actualizado",
    //     description: result || "El producto se ha actualizado correctamente.",
    //     status: "success",
    //     duration: 5000,
    //     isClosable: true,
    //   });
    // } catch (error) {
    //   toast({
    //     position: "top",
    //     title: "Error",
    //     description:
    //       error.message || "Hubo un error al actualizar el producto.",
    //     status: "error",
    //     duration: 5000,
    //     isClosable: true,
    //   });
    // }
  };

  return (
    <>
      <Box mx={10}>
        <Flex gap={8} justifyContent={"start"} flexDirection={"column"}>
          <Box>
            <Button
              alignItems={"center"}
              // leftIcon={<IconArrowBigLeft />}
              variant={"link"}
              onClick={() => navigate("/lista-productos")}
            >
              <IconArrowLeft />
              Atrás
            </Button>
          </Box>
          <Box>
            <Heading mb={10}>Editar producto: {nombre}</Heading>
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
            <Flex alignItems={"flex-start"} gap={4} flexDirection={"column"}>
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
          {/* </GridItem> */}
          <Flex gap={8}>
            {/* <Button onClick={() => navigate("/lista-productos")}>Atrás</Button> */}
            <Button colorScheme={"teal"} type="submit">
              Guardar cambios
            </Button>
          </Flex>
        </Grid>
      </Box>
    </>
  );
};

export default EditarProducto;
