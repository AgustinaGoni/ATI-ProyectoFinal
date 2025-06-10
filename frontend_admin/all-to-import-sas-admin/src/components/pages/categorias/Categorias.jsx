import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import Cargando from "../../Cargando";
import { useCategorias } from "../../../hooks/useCategorias";
import { Link, useNavigate } from "react-router-dom";

const Categorias = () => {
  const navigate = useNavigate();
  const { categorias, loading, fetchCategorias } = useCategorias();

  useEffect(() => {
    fetchCategorias();
  }, []);

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
            <Heading mb={4}>Categorías</Heading>
            <Button
              variant={"outline"}
              color={"botonBg"}
              _hover={{
                transition: "0.5s ease",
                bg: "botonBg",
                color: "botonColor",
              }}
              onClick={() =>
                navigate("/panel-admin/categorias/agregar-categoria")
              }
            >
              Nueva categoría
            </Button>
          </Flex>
          <TableContainer>
            <Table variant="striped">
              {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
              <Thead bg={"gray.500"}>
                <Tr>
                  <Th color={"white"}>Id</Th>
                  <Th color={"white"}>Nombre</Th>
                  <Th color={"white"}>Descripción</Th>
                  <Th color={"white"}></Th>
                </Tr>
              </Thead>
              <Tbody>
                {categorias.map((categoria) => (
                  <Tr key={categoria.id}>
                    <Td>{categoria.id}</Td>
                    <Td>{categoria.nombre}</Td>
                    <Td
                      css={{
                        width: "50%",
                        whiteSpace: "break-spaces",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {categoria.descripcion}
                    </Td>
                    <Td>
                      <Link
                        to={`/panel-admin/categorias/editar-categoria/${categoria.id}`}
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
      )}
    </>
  );
};

export default Categorias;
