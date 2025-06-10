import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Button,
  Stack,
  useColorModeValue,
  Heading,
  Image,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Select,
  Flex,
  Switch,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { API_URL, getToken } from "../../../js/config";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import Cargando from "../../Cargando";
import { Link } from "react-router-dom";
import ProductosSinStokCard from "../../cards/productos/ProductosSinStokCard";
import ProductosHabilitadosCard from "../../cards/productos/ProductosHabilitadosCard";
import ProductosDeshabilitadosCard from "../../cards/productos/ProductosDeshabilitadosCard";
import { actualizarStock } from "../../../js/api/actualizarStock";

const PaginatedProducts = () => {
  const [products, setProducts] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [estado, setEstado] = useState(false);
  const [ordenar, setOrdenar] = useState("");

  useEffect(() => {
    actualizarStock();
    fetchProducts();
  }, [pageNumber, ordenar]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${API_URL}Producto/ProductosPorPaginacion?numeroPagina=${pageNumber}&totalPaginas=${pageSize}&orden=${ordenar}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json", 
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error en la respuesta.");
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Expected JSON response");
      }

      const data = await response.json();
      if (data && data.data) {
        setProducts(data.data);
        setTotalRecords(data.totalRecords);
      } else {
        setProducts([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setProducts([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
  };

  const handleSwitchChange = (id, habilitado) => {
    setProductoSeleccionado(id);
    setEstado(habilitado);
    onOpen();
  };

  const confirmarHabilitarDeshabilitar = async () => {
    try {
      const response = await fetch(
        `${API_URL}Producto/HabilitarDeshabilitar/${productoSeleccionado}?habilitado=${estado}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json", 
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error desconocido");
      }
      const result = await response.json();
      toast({
        position: "top",
        title: result.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchProducts();
    } catch (error) {
      toast({
        position: "top",
        title: "Error",
        description:
          error.message || "No se pudo actualizar el estado del producto.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      onClose();
    }
  };

  console.log(products)
  return (
    <>
      <Flex justifyContent={"space-between"}>
        <Box mb={8}>
          <Heading>Todos los productos</Heading>
        </Box>
        <Box>
          <Select
            borderColor={"black"}
            variant={"outline"}
            placeholder="Ordenar por..."
            onChange={(e) => setOrdenar(e.target.value)}
          >
            <option value="nombre">Por nombre</option>
            <option value="precio_asc">Precio Menor a Mayor</option>
            <option value="precio_desc">Precio Mayor a Menor</option>
            <option value="stock_asc">Stock Menor a Mayor</option>
            <option value="stock_desc">Stock Mayor a Menor</option>
          </Select>
        </Box>
      </Flex>
      <Box>
        {loading ? (
          <>
            <Box my={4}>
              <Cargando columns={6} rows={1} startColor="blue.600" />
            </Box>
            <Cargando columns={6} rows={5} startColor="blue.300" />
          </>
        ) : products.length > 0 ? (
          <>
            <Box px={6} mb={8}>
              <Grid
                templateColumns={{
                  base: "repeat(auto-fill, minmax(150px, 1fr))", 
                  md: "repeat(auto-fill, minmax(200px, 1fr))", 
                  lg: "repeat(auto-fill, minmax(250px, 1fr))", 
                  xl: "repeat(auto-fill, minmax(300px, 1fr))", 
                }}
                gap={8}
                autoRows="minmax(100px, auto)" 
                width="100%" 
                maxWidth="auto"
              >
                <GridItem>
                  <ProductosSinStokCard />
                </GridItem>
                <GridItem>
                  <ProductosHabilitadosCard />
                </GridItem>
                <GridItem>
                  <ProductosDeshabilitadosCard />
                </GridItem>
              </Grid>
            </Box>
            <TableContainer>
              <Table variant="striped">
                <TableCaption>{totalRecords} productos en total</TableCaption>
                <Thead bg={"gray.500"}>
                  <Tr>
                    <Th color={"white"}>Código</Th>
                    <Th color={"white"}>Imagen</Th>
                    <Th color={"white"}>Nombre</Th>
                    <Th color={"white"}>Precio</Th>
                    <Th color={"white"}>Categoría</Th>
                    <Th color={"white"}>Stock</Th>
                    <Th color={"white"}>Habilitado</Th>
                    <Th color={"white"}></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {products.map((producto) => (
                    <Tr key={producto.id}>
                      <Td>{producto.codigo}</Td>
                      <Td>
                        <Image
                          src={`data:image/jpeg;base64,${producto.imagen}`}
                          alt="Imagen actual"
                          boxSize="50px"
                          objectFit="contain"
                        />
                      </Td>
                      <Td
                        overflow={"hidden"}
                        whiteSpace={"break-spaces"}
                        textOverflow={"ellipsis"}
                        w={"15%"}
                      >
                        {producto.nombre}
                      </Td>
                      <Td>$ {producto.precio}</Td>
                      <Td>{producto.categoria?.nombre || "Sin Categoría"}</Td>
                      <Td>{producto.stock}</Td>
                      <Td>
                        <Switch
                          isChecked={producto.habilitado}
                          onChange={(e) =>
                            handleSwitchChange(producto.id, e.target.checked)
                          }
                        />
                      </Td>
                      <Td>
                        <Link
                          to={`/panel-admin/productos/editar-producto/${producto.id}/${producto.nombre}`}
                        >
                          Editar
                        </Link>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <Text>No productos disponibles para mostrar.</Text>
        )}
        
        {/* Modal de Confirmación */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirmar cambio</ModalHeader>
            <ModalBody>
              ¿Estás seguro de que deseas{" "}
              {estado ? "habilitar" : "deshabilitar"} este producto?
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={confirmarHabilitarDeshabilitar}
              >
                Confirmar
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
      <Box py={8}>
        <Pagination
          currentPage={pageNumber}
          totalRecords={totalRecords}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </Box>
    </>
  );
};

// Componente de Paginación
const Pagination = ({ currentPage, totalRecords, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(totalRecords / pageSize);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <Stack
      direction={{ base: "column", sm: "row" }}
      as="nav"
      aria-label="Pagination"
      spacing={2}
      w="full"
      justifyContent="center"
      alignItems="center"
    >
      <Box>
        <PaginationButton
          onClick={handlePrevious}
          isDisabled={currentPage === 1}
        >
          <IconArrowLeft />
        </PaginationButton>
      </Box>
      <Stack direction="row" spacing={2}>
        {[...Array(totalPages)].map((_, index) => (
          <PaginationButton
            key={index}
            onClick={() => onPageChange(index + 1)}
            isActive={index + 1 === currentPage}
          >
            {index + 1}
          </PaginationButton>
        ))}
      </Stack>
      <Box>
        <PaginationButton
          onClick={handleNext}
          isDisabled={currentPage === totalPages}
        >
          <IconArrowRight />
        </PaginationButton>
      </Box>
    </Stack>
  );
};

const PaginationButton = ({ children, isDisabled, isActive, ...props }) => {
  const activeStyle = {
    bg: useColorModeValue("gray.500", "gray.700"),
    color: "white",
  };

  return (
    <Button
      py={1}
      px={3}
      border="1px solid"
      borderColor={useColorModeValue("gray.200", "gray.700")}
      rounded="md"
      _hover={!isDisabled && activeStyle}
      cursor={isDisabled ? "not-allowed" : "pointer"}
      {...(isActive && activeStyle)}
      {...props}
    >
      {children}
    </Button>
  );
};

export default PaginatedProducts;
