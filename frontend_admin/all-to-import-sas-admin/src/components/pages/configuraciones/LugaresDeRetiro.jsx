import {
  Box,
  Flex,
  Heading,
  Link as ChakraLink,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Cargando from "../../Cargando";
import { Link as RouterLink } from "react-router-dom";
import { obtenerDatosNegocio } from "../../../js/api/obtenerDatosNegocio";

const LugaresDeRetiro = () => {
  const [datosNegocio, setDatosNegocio] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  const fetchFuncionarios = async () => {
    try {
      setLoading(true);

      const datos = await obtenerDatosNegocio();
      setDatosNegocio(datos);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  console.log(datosNegocio);
  return (
    <>
      <Heading mb={8}>Lugares de retiro de productos</Heading>

      {loading ? (
        <>
          <Box my={4}>
            <Cargando columns={6} rows={1} startColor="blue.600" />
          </Box>
          <Cargando columns={6} rows={5} startColor="blue.300" />
        </>
      ) : datosNegocio.length === 0 ? (
        <Text>No hay funcionarios registrados.</Text>
      ) : (
        <TableContainer>
          <Table variant="striped">
            <Thead bg={"gray.500"}>
              <Tr>
                <Th color={"white"}>Nombre</Th>
                <Th color={"white"}>Departamento</Th>
                <Th color={"white"}>Barrio</Th>
                <Th color={"white"}>Calle</Th>
                <Th color={"white"}>Nro. Puerta</Th>
                <Th color={"white"}>Nro. Apartamento</Th>
                <Th color={"white"}>Código Postal</Th>
                <Th color={"white"}>Teléfono</Th>
                <Th color={"white"}>Horario</Th>
                <Th color={"white"}></Th>
              </Tr>
            </Thead>
            <Tbody>
              {datosNegocio.map((datosRetiro) => (
                <Tr key={datosRetiro.id}>
                  <Td>{datosRetiro.nombre}</Td>
                  <Td>{datosRetiro.direccion.departamento}</Td>
                  <Td>{datosRetiro.direccion.ciudad}</Td>
                  <Td>{datosRetiro.direccion.calle}</Td>
                  <Td>{datosRetiro.direccion.nroPuerta}</Td>
                  <Td>{datosRetiro.direccion.nroApartamento ? datosRetiro.direccion.nroApartamento : ("S/N")}</Td>
                  <Td>{datosRetiro.direccion.codigoPostal}</Td>
                  <Td>{datosRetiro.telefono}</Td>
                  <Td>{datosRetiro.horario}</Td>
                  <Td>
                    <Flex columnGap={6}>
                      <ChakraLink
                        as={RouterLink}
                        to={`/panel-admin/configuracion/modificar-direcciones-retiro/${datosRetiro.id}`}
                      >
                        Modificar
                      </ChakraLink>                    
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default LugaresDeRetiro;
