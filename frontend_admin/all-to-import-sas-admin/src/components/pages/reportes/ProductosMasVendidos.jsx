import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import Cargando from "../../Cargando";
import * as XLSX from "xlsx";
import { API_URL } from "../../../js/config";

function ProductosMasVendidos() {
  const [productos, setProductos] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchProductos = () => {
    setProductos([]);
    setLoading(true);
    setError(null);

    fetch(`${API_URL}Reporte/productos-mas-vendidos/${fechaInicio}/${fechaFin}`)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(
              "No se encontraron productos vendidos en el rango de fechas especificado."
            );
          } else {
            throw new Error("Ocurrió un problema al procesar la solicitud.");
          }
        }
        return response.json();
      })
      .then((data) => {
        setProductos(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(productos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos Más Vendidos");
    XLSX.writeFile(
      workbook,
      `ProductosMasVendidos_${fechaInicio}_${fechaFin}.xlsx`
    );
  };

  return (
    <>
      <Flex alignItems={"center"} justifyContent={"space-between"} mb={4}>
        <Heading>Productos Más Vendidos</Heading>
        <Flex gap={2} alignItems="center">
          <Flex alignItems={"center"} gap={4}>
            <Flex alignItems={"center"}>
              <FormLabel>Desde</FormLabel>
              <Input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                placeholder="Fecha Inicio"
              />
            </Flex>
            <Flex alignItems={"center"}>
              <FormLabel>Hasta</FormLabel>
              <Input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                placeholder="Fecha Fin"
              />
            </Flex>
          </Flex>
          <Button
            ml={2}
            variant={"outline"}
            color={"botonBg"}
            _hover={{
              transition: "0.5s ease",
              bg: "botonBg",
              color: "botonColor",
            }}
            onClick={handleFetchProductos}
          >
            Buscar
          </Button>
          <Button
            ml={2}
            variant={"solid"}
            colorScheme={"green"}
            onClick={handleExportExcel}
          >
            Exportar a Excel
          </Button>
        </Flex>
      </Flex>

      {loading ? (
        <>
          <Box my={4}>
            <Cargando columns={6} rows={1} startColor="blue.600" />
          </Box>
          <Cargando columns={6} rows={5} startColor="blue.300" />
        </>
      ) : (
        <>
          {error && <Box color="red.500">{error}</Box>}
          <TableContainer>
            <Table variant="striped">
              <Thead bg={"gray.500"}>
                <Tr>
                  <Th color={"white"}>Producto</Th>
                  <Th color={"white"}>Cantidad Vendida</Th>
                  <Th color={"white"}>Total Generado</Th>
                </Tr>
              </Thead>
              <Tbody>
                {productos.map((producto) => (
                  <Tr key={producto.id}>
                    <Td>{producto.nombre}</Td>
                    <Td>{producto.cantidad}</Td>
                    <Td>${producto.total.toFixed(2)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
}

export default ProductosMasVendidos;
