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
import { obtenerFuncionarios } from "../../../../js/api/usuarios/funcionario/obtenerFuncionarios";
import Cargando from "../../../Cargando";
import { formatearFecha } from "../../../../js/formatearFecha";
import { Link as RouterLink } from "react-router-dom";

const Funcionarios = () => {
  const [funcionarios, setfuncionarios] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  const fetchFuncionarios = async () => {
    try {
      setLoading(true);

      const f = await obtenerFuncionarios();
      setfuncionarios(f);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  console.log(funcionarios);
  return (
    <>
      <Heading mb={8}>Funcionarios</Heading>

      {loading ? (
        <>
          <Box my={4}>
            <Cargando columns={6} rows={1} startColor="blue.600" />
          </Box>
          <Cargando columns={6} rows={5} startColor="blue.300" />
        </>
      ) : funcionarios.length === 0 ? (
        <Text>No hay funcionarios registrados.</Text>
      ) : (
        <TableContainer>
          <Table variant="striped">
            <Thead bg={"gray.500"}>
              <Tr>
                <Th color={"white"}>Nombre</Th>
                <Th color={"white"}>Apellido</Th>
                <Th color={"white"}>Correo electrónico</Th>
                <Th color={"white"}>Fecha de registro</Th>
                <Th color={"white"}></Th>
              </Tr>
            </Thead>
            <Tbody>
              {funcionarios.map((funcionario) => (
                <Tr key={funcionario.id}>
                  <Td>{funcionario.nombre}</Td>
                  <Td>{funcionario.apellido}</Td>
                  <Td>{funcionario.correoElectronico}</Td>
                  <Td>{formatearFecha(funcionario.fechaRegistro)}</Td>
                  <Td>
                    <Flex columnGap={6}>
                      <ChakraLink
                        as={RouterLink}
                        to={`/panel-admin/configuracion/funcionarios/modificar-funcionario/${funcionario.nombre}${funcionario.apellido}/${funcionario.id}`}
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

export default Funcionarios;
