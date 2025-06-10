import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
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
import { Link, useNavigate, useParams } from "react-router-dom";
import { obtenerComprasPorEstado } from "../../../js/api/compras/obtenerComprasPorEstado";
import { formatearFecha } from "../../../js/formatearFecha";

const VentasPorEstado = () => {
  const { estado } = useParams();
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(typeof estado);

  useEffect(() => {
    const fetchData = async () => {
      const ventas = await obtenerComprasPorEstado(estado);
      setVentas(ventas);
      setLoading(false);
    };

    fetchData();
  }, []);

  const estadoNombre = {
    0: "Confirmada",
    1: "Facturado",
    2: "Enviando",
    3: "Listas para retirar",
    4: "Completado",
  };
  const nombreEstado = estadoNombre[Number(estado)];
  return (
    <>
      {loading ? (
        <>
          <Box my={4}>
            <Cargando columns={6} rows={1} startColor="blue.600" />
          </Box>
          <Cargando columns={6} rows={5} startColor="blue.300" />
        </>
      ) : (
        <>
          <Flex alignItems={"center"} justifyContent={"space-between"}>
            <Heading mb={4}>Ventas {nombreEstado}</Heading>
          </Flex>
          <TableContainer>
            <Table variant="striped">
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
                            <ListItem>{item.producto.nombre}</ListItem>
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
    </>
  );
};

export default VentasPorEstado;
