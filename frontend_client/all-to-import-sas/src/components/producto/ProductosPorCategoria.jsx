import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { obtenerProductoPorCategoria } from "../../js/api/productos/obtenerProductosPorCategoria";
import BotonFiltrar from "./BotonFiltrar";
import { useFilter } from "../../hooks/useFilter";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Tag,
  TagCloseButton,
  TagLabel,
  SimpleGrid,
} from "@chakra-ui/react";
import ProductoCard from "./ProductoCard";
import { obtenerCategoriaPorId } from "../../js/api/categorias/obtenerCategoriaPorId";
import ProductosSkeleton from "./ProductosSkeleton";

const ProductosPorCategoria = () => {
  const { categoriaId } = useParams();
  const [productos, setProductos] = useState([]);
  const [categoria, setCategoria] = useState({});
  const [loading, setLoading] = useState(false);
  const { filtrarProductos, filtros, setFiltros } = useFilter();
  const [firstLoad, setFirstLoad] = useState(false); // Bandera para la primera carga
  const location = useLocation();

  useEffect(() => {
    fetchCategorias();
    fetchData();
  }, [categoriaId]);

  const fetchCategorias = async () => {
    try {
      const datos = await obtenerCategoriaPorId(categoriaId);
      setCategoria(datos);
    } catch (e) {
      console.error("Error obteniendo las categorías:", e);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const productos = await obtenerProductoPorCategoria(categoriaId);
      setProductos(productos);
    } catch (e) {
      console.error("Error obteniendo los productos:", e);
    } finally {
      setLoading(false);
    }
  };

  const productosFiltrados = filtrarProductos(productos);
  const p = productos.filter((producto) => producto.habilitado === true);

  const productosAMostrar = Object.values(filtros).every((filtro) => !filtro)
    ? p
    : productosFiltrados;


  const handleRemoveFiltro = (key) => {
    setFiltros((prevFiltros) => {
      const newFiltros = { ...prevFiltros };
      delete newFiltros[key];
      return newFiltros;
    });
  };
  const filtrosActivos = Object.keys(filtros).filter(
    (key) =>
      filtros[key] !== undefined && filtros[key] !== "" && filtros[key] !== 0
  );

  const ordenMap = {
    asc: "Menor a mayor",
    desc: "Mayor a menor",
    "a-z": "A - Z",
    "z-a": "Z - a",
  };

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
    } else {
      setFiltros({
        nombre: "",
        precioDesde: 0,
        precioHasta: 0,
        categoria: 0,
        orden: "",
      });
    }
  }, [location.pathname]);

  return (
    <Container maxW="1280px" px={5} my={8}>
      <Flex my={10} flexDirection={"column"} gap={2}> 
        <Heading fontSize={{ base: "2xl", lg: "4xl" }}>
          {categoria.nombre}
        </Heading>
        <Text fontWeight={500} color={"gray"}>
          {categoria.descripcion}
        </Text>
        <Box mt={4}>
          <BotonFiltrar />
        </Box>
      </Flex>
      <Box mt={4} mb={8}>
        {filtrosActivos.length > 0 && (
          <Flex display={{ base: "none", lg: "flex" }} gap={2}>
            {filtrosActivos.map((key) => (
              <Tag size={"sm"} key={key} borderRadius={8} variant="solid">
                <TagLabel>
                  {key === "precioDesde" && `Desde: ${filtros[key]}`}
                  {key === "precioHasta" && `Hasta: ${filtros[key]}`}
                  {key === "nombre" && `Nombre: ${filtros[key]}`}
                  {key === "orden" && `Ordenar: ${ordenMap[filtros[key]]}`}
                </TagLabel>
                <TagCloseButton onClick={() => handleRemoveFiltro(key)} />
              </Tag>
            ))}
          </Flex>
        )}
      </Box>
      {loading ? (
        <ProductosSkeleton />
      ) : productosAMostrar.length === 0 ? (
        <Text>
          No hay productos disponibles en la categoría{" "}
          <Box as="span" fontWeight={600}>
            {categoria.nombre}
          </Box>
        </Text>
      ) : (
        <>
          <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4}>
            {productosAMostrar.map((producto) => (
              <ProductoCard productosAMostrar={producto} />
            ))}
          </SimpleGrid>
        </>
      )}
    </Container>
  );
};

export default ProductosPorCategoria;
