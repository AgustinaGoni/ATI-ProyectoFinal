import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";

const AuthModal = ({ isOpen, onClose, title, onSubmit, children }) => {
  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      motionPreset="scale"
    >
      <ModalOverlay />
      <ModalContent p={4}>
        <ModalHeader mx="auto">{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} width="100%">
            {children}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" width="100%" onClick={onSubmit}>
            {title === "Recuperar la contraseña"
              ? "Recuperar contraseña"
              : "Ingresar"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AuthModal;;