import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Skeleton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { obtenerDatosCliente } from "../../js/api/usuarios/obtenerDatosCliente";
import { obtenerComprasDelCliente } from "../../js/api/compras/obtenerComprasDelCliente";

const MisCompras = () => {
  const navigate = useNavigate();
  const [compras, setCompras] = useState([]);
  const [usuario, setUsuario] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const datos = await obtenerDatosCliente();
      setUsuario(datos);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (usuario && usuario.correoElectronico) {
        const c = await obtenerComprasDelCliente(usuario.documentoIdentidad);
        setCompras(c);
        setLoading(false);
      }
    };

    fetchData();
  }, [usuario]);


  return (
    <Container maxW="1280px" px={0} my={8}>
      <Heading
        textAlign={"center"}
        lineHeight={1.1}
        fontWeight={600}
        fontSize={{ base: "xl", sm: "3xl", lg: "5xl" }}
      >
        Historial de compras
      </Heading>
      {loading ? (
        <Stack p={6}>
          <Skeleton height="20px" startColor={"blue.300"} />
          <Skeleton height="20px" startColor={"blue.300"} />
          <Skeleton height="20px" startColor={"blue.300"} />
        </Stack>
      ) : Array.isArray(compras) && compras.length > 0 ? (
        <TableContainer px={{ base: 6, lg: 0 }} mb={8} mt={16}>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th fontWeight={"bold"} fontSize="sm" pl={0}>
                  Fecha
                </Th>
                <Th
                  display={{ base: "none", lg: "block" }}
                  fontWeight={"bold"}
                  fontSize="sm"
                  pl={0}
                >
                  Nro Orden
                </Th>
                <Th fontWeight={"bold"} fontSize="sm" pl={0}>
                  Estado
                </Th>
                <Th
                  display={{ base: "none", lg: "block" }}
                  fontWeight={"bold"}
                  fontSize="sm"
                  pl={0}
                >
                  Tipo envío
                </Th>
                <Th fontWeight={"bold"} fontSize="sm" pl={0}>
                  Total
                </Th>
                <Th
                  display={{ base: "none", lg: "block" }}
                  fontWeight={"bold"}
                  fontSize="sm"
                  pl={0}
                ></Th>
              </Tr>
            </Thead>
            <Tbody>
              {compras.map((compra) => (
                <Tr key={compra.id}>
                  <Td pl={0}>
                    <Link to={`/detalle-pedido/${compra.id}`}>
                      {new Date(compra.fechaCompra).toLocaleString()}
                    </Link>
                  </Td>
                  <Td display={{ base: "none", lg: "block" }} pl={0}>
                    {compra.id}
                  </Td>
                  <Td pl={0}>
                    {compra.estadoCompraNombre === "ListoParaRetirar"
                      ? "Lista para retirar"
                      : compra.estadoCompraNombre}
                  </Td>
                  <Td display={{ base: "none", lg: "block" }} pl={0}>
                    {compra.entrega.tipo === "RetiroCompra"
                      ? "Retiro en persona"
                      : "Envío a domicilio"}
                  </Td>
                  <Td px={0} textAlign={{ base: "end", lg: "start" }}>
                    $ {compra.totalComprado}
                  </Td>
                  <Td
                    display={{ base: "none", lg: "block" }}
                    px={0}
                    textAlign={"end"}
                  >
                    <Link to={`/detalle-pedido/${compra.id}`}>
                      Ver detalles
                    </Link>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Flex align={'center'} flexDirection={'column'}>
          <Heading
            textAlign={"center"}
            lineHeight={1.1}
            fontWeight={600}
            fontSize={{ base: "md", sm: "lg", lg: "xl" }}
            mt={10}
          >
            No tienes compras realizadas.
          </Heading>
          <Box p={6}>
          <Link to={"/"}>Ir a comprar</Link>
          </Box>
        </Flex>
      )}
    </Container>
  );
};

export default MisCompras;
