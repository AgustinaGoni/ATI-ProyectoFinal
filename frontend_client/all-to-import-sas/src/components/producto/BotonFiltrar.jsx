import React, { useRef, useState } from "react";
import Hero from "../Hero";
import {
  Button,
  Flex,

  useDisclosure,

} from "@chakra-ui/react";
import FiltrosDrawer from "../FiltrosDrawer";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";
const BotonFiltrar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  

  return (
    <>
      <Flex  justifyContent={"start"} alignItems={"center"} gap={4}>
        <Button 
        rightIcon={<IconAdjustmentsHorizontal/>} 
        ref={btnRef} 
        variant={"outline"}
                  color={"botonBg"}
                  _hover={{
                    transition: "0.5s ease",
                    bg: "botonBg",
                    color: "botonColor",
                  }}
        onClick={onOpen}>
          Filtrar
        </Button>
      </Flex>
      <FiltrosDrawer isOpen={isOpen} onClose={onClose} btnRef={btnRef} />
    </>
  );
};

export default BotonFiltrar;
