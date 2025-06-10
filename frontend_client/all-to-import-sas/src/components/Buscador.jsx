import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useDisclosure,
} from "@chakra-ui/react";
import { IconSearch } from "@tabler/icons-react";
import React, { useState } from "react";
import { useFilter } from "../hooks/useFilter";
import { useNavigate } from "react-router-dom";

const Buscador = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filtro, setFiltro] = useState("");
  const { setFiltros } = useFilter();
  const navigate = useNavigate()

  const handleClick = () => {
    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      nombre: filtro,
    }));
    navigate('/productos');
  };
  
  return (
    <>
      <Box>
        <Box display={{ base: "block", lg: "none" }}>
          <IconSearch onClick={onOpen} />
        </Box>
        <Flex display={{ base: "none", lg: "flex" }}>
          <InputGroup size="md">
            <Input
              onChange={e => setFiltro(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleClick();
                  onClose();
                }
              }}
              variant="flushed"
              width="390px"
              pr="4.5rem"
              type={"text"}
              placeholder="Buscar un producto"
              _placeholder={{ opacity: 0.85, color: "inherit" }}
            />
            <InputRightElement>
              <IconButton
                bg={"none"}
                size="sm"
                onClick={handleClick}
                icon={<IconSearch />}
              ></IconButton>
            </InputRightElement>
          </InputGroup>
        </Flex>
      </Box>
      <Drawer placement="top" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent py={6}>
          <DrawerCloseButton
            color="black"
            border="2px"
            borderColor="black"
            borderRadius="50%"
          />
          <DrawerBody>
            <InputGroup alignContent="center">
              <Input
                onChange={(e) => setFiltro(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleClick();
                    onClose();
                  }
                }}
                variant="flushed"
                _focus={{ boxShadow: "none", borderColor: "black" }}
                size="lg"
                type="text"
                placeholder="Buscar un producto"
              />
            </InputGroup>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Buscador;
