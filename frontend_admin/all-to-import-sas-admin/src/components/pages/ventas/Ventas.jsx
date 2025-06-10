import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  List,
  ListItem,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cargando from "../../Cargando";
import { obtenerComprasParaPaginar } from "../../../js/api/compras/obtenerComprasParaPaginar";
import {
  IconArrowLeft,
  IconArrowRight,
} from "@tabler/icons-react";
import { formatearFecha } from "../../../js/formatearFecha";
import NuevasVentasCard from "../../cards/ventas/NuevasVentasCard";
import VentasParaEnvioCard from "../../cards/ventas/VentasParaEnvioCard";
import VentasParaRetiroCard from "../../cards/ventas/VentasParaRetiroCard";
import VentasFinalizadasCard from "../../cards/ventas/VentasFinalizadasCard";
import VentasFacturadasCard from "../../cards/ventas/VentasFacturadasCard";
const Ventas = () => {
  const navigate = useNavigate();
  const { estado } = useParams();
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [numeroPagina, setNumeroPagina] = useState(1);
  const [comprasPorPagina] = useState(15);
  const [totalCompras, setTotalCompras] = useState(0);

  useEffect(() => {
    fetchCompras();
  }, [numeroPagina]);

  const fetchCompras = async () => {
    try {
      const respuesta = await obtenerComprasParaPaginar(
        numeroPagina,
        comprasPorPagina
      );
      setVentas(respuesta.data);
      setTotalCompras(respuesta.total);
    } catch (error) {
      console.error("Fetch error:", error);
      setVentas([]);
      setTotalCompras(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePaginaChange = (nuevoNumeroPagina) => {
    setNumeroPagina(nuevoNumeroPagina);
  };

  console.log(ventas);

  return (
    <>
      <Box mb={8}>
        <Heading>Todas las ventas</Heading>
      </Box>
      {loading ? (
        <>
          <Box my={4}>
            <Cargando columns={6} rows={1} startColor="blue.600" />
          </Box>
          <Cargando columns={6} rows={5} startColor="blue.300" />
        </>
      ) : ventas.length === 0 ? (
        <Text>No hay ventas realizadas.</Text>
      ) : (
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
                <NuevasVentasCard />
              </GridItem>
              <GridItem>
                <VentasFacturadasCard />
              </GridItem>
              <GridItem>
                <VentasParaEnvioCard />
              </GridItem>
              <GridItem>
                <VentasParaRetiroCard />
              </GridItem>
              <GridItem>
                <VentasFinalizadasCard />
              </GridItem>
            </Grid>
          </Box>

          <TableContainer>
            <Table variant="striped">
              <TableCaption>{totalCompras} ventas en total</TableCaption>
              <Thead bg={"gray.500"}>
                <Tr>
                  <Th color={"white"}>Nro. Orden</Th>
                  <Th color={"white"}>Fecha de compra</Th>
                  <Th color={"white"}>Tipo de entrega</Th>
                  <Th color={"white"}>Estado</Th>
                  <Th color={"white"}>Productos</Th>
                  <Th color={"white"}></Th>
                </Tr>
              </Thead>
              <Tbody>
                {ventas.map((venta) => (
                  <Tr key={venta.id}>
                    <Td>{venta.id}</Td>
                    <Td>{formatearFecha(venta.fechaCompra)}</Td>
                    <Td>
                      {venta.entrega.tipo === "RetiroCompra"
                        ? "Retiro en persona"
                        : "Envío a domicilio"}
                    </Td>
                    <Td>{venta.estadoCompraNombre}</Td>
                    <Td>
                      <List>
                        {venta.itemsCompra.map((item) => (
                          <Box key={item.producto.id}>
                            <ListItem  >
                              {item.producto.nombre}
                            </ListItem>
                            <ListItem mb={2}>
                              Cantidad: {item.producto.cantidad}
                            </ListItem>
                          </Box>
                        ))}
                      </List>
                    </Td>
                    <Td>
                      <Link
                        to={`/panel-admin/ventas/detalle-venta/${venta.id}`}
                      >
                        Ver más
                      </Link>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </>
      )}

      <Box py={8}>
        <Pagination
          currentPage={numeroPagina}
          totalRecords={totalCompras}
          pageSize={comprasPorPagina}
          onPageChange={handlePaginaChange}
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

export default Ventas;
