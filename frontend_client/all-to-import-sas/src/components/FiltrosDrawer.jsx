import React, { useRef, useState } from "react";
import { useFilter } from "../hooks/useFilter";
import {
  Box,
  Button,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  HStack,
  Input,
  Select,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
} from "@chakra-ui/react";

import OrdenarProductos from "./producto/OrdenarProductos";

const FiltrosDrawer = ({ isOpen, onClose, btnRef }) => {
  const { filtros, setFiltros } = useFilter();
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const handleFiltrar = () => {
    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      precioDesde: Number(desde),
      precioHasta: Number(hasta),
    }));
    setDesde("");
    setHasta("");
  };

  const handleRemoveFiltro = (key) => {
    setFiltros((prevFiltros) => {
      const newFiltros = { ...prevFiltros };
      delete newFiltros[key];
      return newFiltros;
    });
  };
  const filtrosActivos = Object.keys(filtros).filter(
    (key) =>
      filtros[key] !== undefined && filtros[key] !== "" && filtros[key] !== 0
  );

  const ordenMap = {
    asc: "Menor a mayor",
    desc: "Mayor a menor",
    "a-z": "A - Z",
    "z-a": "Z - a",
  };

  return (
    <>
      {/* Crearme un componente para el drawer */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Filtrar productos</DrawerHeader>

          <DrawerBody>
            <Flex flexDirection={"column"}>
              <Box>
                <Text>Precio</Text>
                <Flex
                  mt={2}
                  alignItems="center"
                  flexDirection="row"
                  columnGap={4}
                >
                  <FormControl>
                    <Input
                      id="desde"
                      name="desde"
                      type="text"
                      placeholder="Desde"
                      variant="outline"
                      value={desde}
                      onChange={(e) => setDesde(e.target.value)}
                    />
                  </FormControl>
                  <Box as="span">-</Box>
                  <FormControl>
                    <Input
                      id="hasta"
                      name="hasta"
                      type="text"
                      placeholder="Hasta"
                      variant="outline"
                      value={hasta}
                      onChange={(e) => setHasta(e.target.value)}
                    />
                  </FormControl>
                </Flex>
                <Button
                  onClick={() => {
                    handleFiltrar();
                  }}
                  variant={"solid"}
                  color={"botonBg"}
                  _hover={{
                    transition: "0.5s ease",
                    bg: "botonBg",
                    color: "botonColor",
                  }}
                  mt={4}
                >
                  Mostrar
                </Button>
              </Box>
              <OrdenarProductos onClose={onClose} />
              {filtrosActivos.length > 0 && (
                <Flex
                  display={{ base: "flex", lg: "none" }}
                  mt={2}
                  gap={2}
                  flexDirection={"column"}
                >
                  {filtrosActivos.map((key) => (
                    <Tag
                      justifyContent={"space-between"}
                      w={"65%"}
                      size={"sm"}
                      key={key}
                      borderRadius={8}
                      variant="outline"
                    >
                      <TagLabel>
                        {key === "precioDesde" && `Desde: $ ${filtros[key]}`}
                        {key === "precioHasta" && `Hasta: $ ${filtros[key]}`}
                        {key === "nombre" && `Nombre: ${filtros[key]}`}
                        {key === "orden" &&
                          `Ordenar: ${ordenMap[filtros[key]]}`}
                      </TagLabel>
                      <TagCloseButton onClick={() => handleRemoveFiltro(key)} />
                    </Tag>
                  ))}
                </Flex>
              )}
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default FiltrosDrawer;
