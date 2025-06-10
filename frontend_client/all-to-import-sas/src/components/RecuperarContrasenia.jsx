import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  FormControl,
  FormLabel,
  Input,
  Link,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { useModal } from "../context/ModalProvider";

const RecuperarContrasenia = () => {
  const { isRecuperarContrasenia, closeRecuperarContraseniaModal, openLoginModal } = useModal();

  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isRecuperarContrasenia}
        onClose={ () => {closeRecuperarContraseniaModal(); openLoginModal();}}
        isCentered
        motionPreset="scale"
      >
        <ModalOverlay />
        <ModalContent p={4} w={{ base: "85%", lg: "auto" }}>
          <ModalHeader mx="auto">Recuperar la contraseña</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="sm" mb={8}>
              Por favor, ingresa tu dirección de correo electrónico para que
              podamos enviarte un mensaje con las instrucciones necesarias para
              restablecer tu contraseña.
            </Text>
            <VStack spacing={4} width="100%">
              <FormControl isRequired>
                <FormLabel m={0}>Correo Electrónico</FormLabel>
                <Input
                  type="email"
                  placeholder="Ingrese su correo electrónico"
                  variant="flushed"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" width="100%">
              Recuperar contraseña
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RecuperarContrasenia;
