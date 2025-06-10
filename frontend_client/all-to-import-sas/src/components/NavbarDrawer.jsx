import React from "react";
import {
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerCloseButton,
} from "@chakra-ui/react";
import NavBarInfo from "../components/layout/NavBarInfo";
import NavBar from "./NavBar";
import { useAuth } from "../hooks/useAuth";
import Login from "./Login";
import { IconLogout2 } from "@tabler/icons-react";

const NavbarDrawer = ({
  isDrawerMenuOpen,
  onDrawerMenuClose,
}) => {
  const { estaAutenticado, logout } = useAuth();

  return (
    <>
      <Drawer
        isOpen={isDrawerMenuOpen}
        placement="left"
        onClose={onDrawerMenuClose}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader
          bg={'background'}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={4}
            py={6}
          >
            
            <Login onDrawerMenuClose={onDrawerMenuClose}/>
            <DrawerCloseButton
              position="inherit"
              color="black"
              border="2px"
              borderColor="black"
              borderRadius="50%"
            />
          </DrawerHeader>
          <DrawerBody p={0}>
            <NavBar 
            onCloseDrawer={onDrawerMenuClose}
            />
            <NavBarInfo

              onCloseDrawer={onDrawerMenuClose}
            />
          </DrawerBody>
          {estaAutenticado && (
            <DrawerFooter justifyContent="start" borderTopWidth="1px">
              <Button
                leftIcon={<IconLogout2 />}
                variant="link"
                color="primary"
                onClick={logout}
              >
                Cerrar Sesión
              </Button>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default NavbarDrawer;
