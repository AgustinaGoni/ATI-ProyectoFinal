import React from "react";
import { useAuth } from "../hooks/useAuth";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useMediaQuery,
  useModal,
} from "@chakra-ui/react";
import { IconUser } from "@tabler/icons-react";
import { useUsuario } from "../hooks/useUsuario";
import { useNavigate } from "react-router-dom";
import { getToken } from "../js/config";

const MenuUsuario = ({openLoginModal, onDrawerMenuClose}) => {
  const { estaAutenticado, esAdmin, loginModal, logout, error } = useAuth();
  const [isMobileOrTablet] = useMediaQuery("(max-width: 900px)");
  const { usuario, actualizarUsuario } = useUsuario();
  const navigate = useNavigate()

  const handleCerrarSesion = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {!estaAutenticado && getToken() === null? (
        <Button
          onClick={() => {
            if (isMobileOrTablet) {
              onDrawerMenuClose();
            }
            openLoginModal();
          }}
          leftIcon={<IconUser />}
          colorScheme="white"
          variant="link"
        >
          Ingresar
        </Button>
      ) : (
        <Menu>
          <MenuButton
            as={Button}
            leftIcon={<IconUser />}
            colorScheme="white"
            variant="link"
            onClick={() => {
              if (isMobileOrTablet) {
                navigate("/mi-cuenta");
                onDrawerMenuClose();
              }
            }}
            textDecoration={"underline"}
          >
            {usuario.nombre} {usuario.apellido}
          </MenuButton>
          <MenuList py={0} display={{ base: "none", lg: "block" }}>
            <MenuItem
              borderBottom={"1px solid"}
              borderColor={"bg2"}
              onClick={() => {
                localStorage.getItem("token") === null
                  ? navigate("/")
                  : navigate("/mi-cuenta");
              }}
            >
              Mis datos
            </MenuItem>
            <MenuItem
              borderBottom={"1px solid"}
              borderColor={"bg2"}
              onClick={() => {
                localStorage.getItem("token") === null
                  ? navigate("/")
                  : navigate("/mis-compras");
              }}
            >
              Mis compras
            </MenuItem>

            <MenuItem onClick={handleCerrarSesion}>Cerrar sesión</MenuItem>
          </MenuList>
        </Menu>
      )}
    </>
  );
};

export default MenuUsuario;
