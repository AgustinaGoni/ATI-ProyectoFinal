import React, { useEffect, useState } from "react";
import {
  AbsoluteCenter,
  Box,
  Divider,
  Heading,
  Image,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useProductos } from "../../hooks/useProductos";
import Cargando from "../Cargando";

const ListaProductos = () => {


  const { productos, loading } = useProductos();

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
          <Box mb={8}>
            <Heading>Productos</Heading>
          </Box>
          <TableContainer>
            <Table variant="striped">
              <TableCaption>{productos.length} productos</TableCaption>
              <Thead bg={"gray.500"}>
                <Tr>
                  <Th color={"white"}>Código</Th>
                  <Th color={"white"}>Imagen</Th>
                  <Th color={"white"}>Nombre</Th>
                  <Th color={"white"}>Descripción</Th>
                  <Th color={"white"}>Precio</Th>
                  <Th color={"white"}>Categoría</Th>
                  <Th color={"white"}>Stock</Th>
                  <Th color={"white"}></Th>
                </Tr>
              </Thead>
              <Tbody>
                {productos.map((producto) => (
                  <Tr key={producto.id}>
                    <Td>{producto.codigo}</Td>
                    <Td >
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
                    <Td
                      overflow={"hidden"}
                      whiteSpace={"break-spaces"}
                      textOverflow={"ellipsis"}
                      w={"35%"}
                    >
                      {producto.descripcion}
                    </Td>
                    <Td>$ {producto.precio}</Td>
                    <Td>{producto.categoria?.nombre || "Arreglar esto"}</Td>
                    <Td>{producto.stock}</Td>
                    <Td>
                      <Link to={`/editar-producto/${producto.id}`}>Editar</Link>
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

export default ListaProductos;
