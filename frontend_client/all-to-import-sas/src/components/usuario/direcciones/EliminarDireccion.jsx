import {
  Button,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  useToast,
} from "@chakra-ui/react";
import { IconEdit } from "@tabler/icons-react";
import React, { useRef, useState } from "react";
import { API_URL } from "../../../js/config";

const EliminarDireccion = ({ idDireccion, setDirecciones }) => {
  const toast = useToast();
  const initialFocusRef = useRef();
  const [loadingEliminar, setLoadingEliminar] = useState(false);

  const handleEliminarDireccion = async (idDireccion) => {
    try {
      setLoadingEliminar(true);
      const response = await fetch(
        `${API_URL}Usuario/EliminarDireccion/${idDireccion}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        setDirecciones((prevDirecciones) =>
          prevDirecciones.filter((direccion) => direccion.id !== idDireccion)
        );
        toast({
          title: "Dirección eliminada",
          description: "Tu dirección ha sido eliminada con éxito",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } else {
        console.error("Error al eliminar la dirección");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingEliminar(false);
    }
  };
  return (
    <Popover
      initialFocusRef={initialFocusRef}
      placement="bottom"
      closeOnBlur={false}
    >
      <PopoverTrigger>
        <IconButton
          bg={"none"}
          icon={<IconEdit color="#cd6f70" />}
          aria-label="Eliminar dirección"
        />
      </PopoverTrigger>
      <PopoverContent color="black" bg="white" borderColor="#cd6f70">
        <PopoverHeader pt={4} fontWeight="bold" border="0">
          ¿Eliminar está dirección?
        </PopoverHeader>
        <PopoverArrow bg="#cd6f70" />
        <PopoverCloseButton />
        <PopoverBody>
          Una vez eliminada la dirección no se podra recuperar, para vovler a
          tener la misma dirección deberas registrarla de nuevo.
        </PopoverBody>
        <PopoverFooter
          border="0"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          pb={4}
        >
          <Button
            isLoading={loadingEliminar}
            loadingText="Eliminado"
            bg="#cd6f70"
            color={"white"}
            ref={initialFocusRef}
            aria-label="Eliminar dirección"
            onClick={() => handleEliminarDireccion(idDireccion)}
          >
            Confirmar
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default EliminarDireccion;
