import {
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerCloseButton,
  useColorModeValue,
  useDisclosure,
  Avatar,
  Flex,
  Icon,
  Text,
  Stack,
  Image,
  Button,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import Buscador from "../../Buscador";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  IconCalendarMonth,
  IconCategory,
  IconCube,
  IconInfoCircle,
  IconLayoutDashboard,
  IconLogout2,
  IconMail,
  IconReport,
  IconSettings,
  IconShoppingCart,
  IconUser,
  IconUsersGroup,
} from "@tabler/icons-react";

const PanelAdministrador = ({ children }) => {
  // const { esAdmin } = useAuth();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const fechaActual = new Date().toLocaleDateString();
  const { estaAutenticado, esAdmin, loginModal, logout } = useAuth();

  // useEffect(() => {
  //   if (!esAdmin) {
  //     navigate("/"); // Redirigir a la página de inicio si no es administrador
  //   }
  // }, [esAdmin, navigate]);

  return (
    <Box
      as="section"
      bg={useColorModeValue("gray.50", "gray.700")}
      minH="100vh"
    >
      <SidebarContent display={{ base: "none", lg: "unset" }} />
      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent w="full" borderRight="none" />
        </DrawerContent>
      </Drawer>
      <Box ml={{ base: 0, md: "16rem" }} transition=".3s ease">
        <Flex
          as="header"
          align="center"
          justifyContent={{ base: "space-between", md: "space-between" }}
          w="full"
          px="4"
          py={6}
          borderBottomWidth="1px"
          borderColor={useColorModeValue("inherit", "gray.700")}
          bg={useColorModeValue("white", "gray.800")}
          // boxShadow="sm"
          // h="14"
        >
          <IconButton
            aria-label="Menu"
            display={{ base: "inline-flex", md: "none" }}
            onClick={onOpen}
            // icon={<FiMenu />}
            size="md"
          />
          <Buscador />
          <Flex gap={2}>
            <IconCalendarMonth />
            <Text fontWeight={"semibold"}>{fechaActual}</Text>
          </Flex>
          {/* <Flex align="center">
            <Text>Nombre funcionario</Text>
          </Flex> */}

          <Menu>
            <MenuButton
              as={Button}
              leftIcon={<IconUser />}
              colorScheme="white"
              variant="link"
              // onClick={() => {
              //   if (isMobileOrTablet) {
              //     navigate("/micuenta");
              //     onDrawerMenuClose();
              //   }
              // }}
            >
              Nombre funcionario
            </MenuButton>
            <MenuList py={0} display={{ base: "none", lg: "block" }}>
              {esAdmin ? (
                <MenuItem
                  borderBottom={"1px solid"}
                  borderColor={"bg2"}
                  onClick={() => {
                    localStorage.getItem("token") === null
                      ? navigate("/")
                      : navigate("/panel-administrador");
                  }}
                >
                  Panel administrador
                </MenuItem>
              ) : (
                <>
                  <MenuItem
                    borderBottom={"1px solid"}
                    borderColor={"bg2"}
                    onClick={() => {
                      localStorage.getItem("token") === null
                        ? navigate("/")
                        : navigate("/micuenta");
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
                        : navigate("/miscompras");
                    }}
                  >
                    Mis compras
                  </MenuItem>
                </>
              )}
              <MenuItem onClick={logout}>Cerrar sesión</MenuItem>
            </MenuList>
          </Menu>
        </Flex>

        <Box
          as={"main"}
          p={14}
          minH="25rem"
          bg={useColorModeValue("auto", "gray.800")}
        >
          {/* Otros elementos de diseño o navegación de administrador */}
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default PanelAdministrador;

const SidebarContent = ({ props }) => (
  <Box
    as="nav"
    position="fixed"
    top="0"
    left="0"
    zIndex="sticky"
    h="100vh"
    pb={"2"}
    overflowX="hidden"
    overflowY="auto"
    // bg={useColorModeValue("white", "gray.800")}
    bg={"#C9C5BA"}
    borderColor={useColorModeValue("inherit", "gray.700")}
    borderRightWidth="1px"
    width="16rem"
    {...props}
  >
    <Flex px="4" py={"6"} align="center">
      {/* <Icon as={RiFlashlightFill} h={8} w={8} /> */}
      <Text
        fontSize="2xl"
        ml="2"
        color={useColorModeValue("brand.500", "white")}
        fontWeight="semibold"
      >
        All To Import
      </Text>
    </Flex>
    <Flex
      direction="column"
      justifyContent={"space-between"}
      as="nav"
      fontSize="md"
      color="gray.600"
      height="calc(100vh - 6rem)"
      aria-label="Main Navigation"
    >
      <Box>
        <NavItem icon={IconLayoutDashboard} to="/panel-administrador">
          Inicio
        </NavItem>
        <NavItem icon={IconCube} to="/lista-productos">
          Productos
        </NavItem>
        <NavItem icon={IconCategory} to="/categorias">
          Categoría de productos
        </NavItem>
        <NavItem icon={IconShoppingCart} to="/ventas">
          Ventas
        </NavItem>
        <NavItem icon={IconUsersGroup} to="/Funcionarios">
          Funcionarios
        </NavItem>
        <NavItem icon={IconReport} to="/reportes">
          Reportes
        </NavItem>
        <NavItem icon={IconMail} to="/mensajes">
          Mensajes
        </NavItem>
      </Box>
      <Box>
        <NavItem icon={IconSettings} to="/configuracion">
          Configuración
        </NavItem>
        <NavItem icon={IconInfoCircle} to="/servicio-tecnico">
          Servicio técnico
        </NavItem>
        <NavItem icon={IconLogout2}>
          Cerrar sesión
        </NavItem>
      </Box>
    </Flex>
  </Box>
);

const NavItem = ({ icon, children, to }) => {
  const { pathname } = useLocation();
  const inactiveColor = useColorModeValue("inherit", "gray.400");
  const hoverColor = useColorModeValue("gray.900", "gray.200");
  const hoverBg = useColorModeValue("gray.100", "gray.900");
  const activeBg = useColorModeValue("gray.200", "gray.700");
  const activeColor = useColorModeValue("gray.900", "gray.200");

  const isActive = pathname === to;

  return (
    <NavLink to={to} style={{ textDecoration: "none" }}>
      <Flex
        align="center"
        px="4"
        py="3"
        role="group"
        fontWeight="semibold"
        transition=".15s ease"
        color={isActive ? activeColor : inactiveColor}
        bg={isActive ? activeBg : "transparent"}
        _hover={{
          bg: hoverBg,
          color: hoverColor,
        }}
      >
        {icon && (
          <Icon
            mx="2"
            boxSize="5"
            _groupHover={{
              color: hoverColor,
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </NavLink>
  );
};
