import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Heading,
  Input,
  List,
  ListItem,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Cargando from "../../Cargando";
import * as XLSX from "xlsx";
import { API_URL } from "../../../js/config";

function ReporteVentas() {
  const [ventas, setVentas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchVentas = () => {
    setVentas([]);
    setLoading(true);
    setError(null);

    fetch(`${API_URL}Reporte/reporte-ventas/${fechaInicio}/${fechaFin}`)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(
              "No se encontraron compras en el rango de fechas especificado."
            );
          } else {
            throw new Error("Ocurrió un problema al procesar la solicitud.");
          }
        }
        return response.json();
      })
      .then((data) => {
        setVentas(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };
  const handleExportExcel = () => {
    const dataToExport = ventas.map((venta) => {
      const itemsDetalle = venta.itemsCompra
        .map(
          (item) =>
            ` | ${item.nombre} - Cantidad: ${
              item.cantidad
            }, Total: $${item.total.toFixed(2)}`
        )
        .join("\n");

      return {
        fechaCompra: new Date(venta.fechaCompra).toLocaleDateString(),
        cliente: venta.cliente,
        totalComprado: venta.totalComprado,
        estadoCompra: venta.estadoCompra,
        itemsCompra: itemsDetalle,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte de Ventas");
    XLSX.writeFile(workbook, `ReporteVentas_${fechaInicio}_${fechaFin}.xlsx`);
  };
  return (
    <>
      <Flex alignItems={"center"} justifyContent={"space-between"} mb={4}>
        <Heading>Reporte de Ventas</Heading>
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
            onClick={handleFetchVentas}
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
                  <Th color={"white"}>Fecha</Th>
                  <Th color={"white"}>Cliente</Th>
                  <Th color={"white"}>Total Comprado</Th>
                  <Th color={"white"}>Estado</Th>
                  <Th color={"white"}>Productos</Th>
                </Tr>
              </Thead>
              <Tbody>
                {ventas.map((venta) => (
                  <Tr key={venta.fechaCompra}>
                    <Td>{new Date(venta.fechaCompra).toLocaleDateString()}</Td>
                    <Td>{venta.cliente}</Td>
                    <Td>${venta.totalComprado.toFixed(2)}</Td>
                    <Td>{venta.estadoCompra}</Td>
                    <Td>
                      <List>
                        {venta.itemsCompra.map((item) => (
                          <Box key={item.nombre}>
                          <ListItem >
                            {item.nombre}
                          </ListItem>
                          <ListItem>
                              Cantidad: {item.cantidad}
                            </ListItem>
                            <ListItem mb={2}>
                            Total: $
                            {item.total.toFixed(2)}
                            </ListItem>
                          </Box>
                        ))}
                      </List>
                    </Td>
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

export default ReporteVentas;
