import {
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  useColorModeValue,
  useDisclosure,
  Flex,
  Heading,
  IconButton,
  Text,
  useBreakpointValue,
  Icon,
  useMediaQuery,
} from "@chakra-ui/react";
import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import {
  IconCategory,
  IconCube,
  IconLayoutDashboard,
  IconLogout2,
  IconReport,
  IconSettings,
  IconShoppingCart,
  IconTool,
} from "@tabler/icons-react";
import { useUsuario } from "../../hooks/useUsuario";

const Dashboard = ({ children }) => {
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { logout } = useAuth();
  const { usuario } = useUsuario();

  const marginLeft = useBreakpointValue({ base: "0", md: "16rem" });
  const [isMobileOrTablet] = useMediaQuery("(max-width: 1024px)");
  return (
    <>
      {isMobileOrTablet ? (
        <Box
          textAlign="center"
          py={10}
          px={6}
          minHeight="100vh"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={IconTool} boxSize={24} color="gray.600" mb={4} />
          <Heading as="h1" size="xl" mb={4} color="gray.700">
            No disponible para la resolucion de tu dispositivo
          </Heading>
          <Text fontSize="lg" color="gray.500">
            Estamos trabajando para que puedas utilizar la version responsive
            sin problemas en cualquier dispositivo. ¡Gracias por tu paciencia!
          </Text>
        </Box>
      ) : (
        <>
          <Box as="section" bg={"background"} minH="100vh">
            <SidebarContent
              display={{ base: "none", md: "block" }}
              logout={logout}
            />
            <Drawer isOpen={isOpen} onClose={onClose} placement="left">
              <DrawerOverlay />
              <DrawerContent>
                <SidebarContent w="full" borderRight="none" logout={logout} />
              </DrawerContent>
            </Drawer>
            <Box ml={marginLeft} transition=".3s ease">
              <Flex
                as="header"
                align="center"
                justifyContent={{ base: "space-between" }}
                w="calc(100vw - 16rem)"
                px={8}
                py={6}
                borderBottomWidth="1px"
                borderColor={useColorModeValue("inherit", "gray.700")}
                bg={"bgSidebar"}
                color={"primary"}
                position="fixed"
                top="0"
                zIndex="sticky"
              >
                <IconButton
                  aria-label="Menu"
                  display={{ base: "inline-flex", md: "none" }}
                  onClick={onOpen}
                  size="md"
                />
                <Box>
                  <Heading as={"h2"} size={"md"} fontWeight="semibold">
                    Panel Administrador
                  </Heading>
                </Box>
                <Box>
                  <Text fontWeight={600}>
                    {usuario.nombre} {usuario.apellido}
                  </Text>
                </Box>
              </Flex>

              <Box
                as={"main"}
                px={6}
                py={6}
                mt={{ base: "6rem", md: "6rem" }}
                mb={{ base: "6rem", md: "6rem" }}
                minH="25rem"
                width="100%"
                maxWidth="100vw"
                overflowX="hidden"
                overflowY="auto"
              >
                {children}
              </Box>
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default Dashboard;

const SidebarContent = ({ logout, ...props }) => (
  <Box
    as="nav"
    position="fixed"
    top="0"
    left="0"
    zIndex="sticky"
    px={4}
    h="100vh"
    pb={2}
    overflowX="hidden"
    overflowY="auto"
    bg={"bgSidebar"}
    width="16rem"
    color={"primary"}
    {...props}
  >
    <Flex columnGap={2} py={6} align="center">
      <Heading size={"md"}>All To Import</Heading>
    </Flex>
    <Flex
      direction="column"
      justifyContent={"space-between"}
      as="nav"
      fontSize="md"
      color="gray.600"
      height="calc(100vh - 10rem)"
      aria-label="Main Navigation"
    >
      <Box>
        <NavItem icon={IconLayoutDashboard} to="/panel-admin/inicio">
          Inicio
        </NavItem>
        <NavItem icon={IconCube} to="/panel-admin/productos">
          Productos
        </NavItem>
        <NavItem icon={IconCategory} to="/panel-admin/categorias">
          Categoría productos
        </NavItem>
        <NavItem icon={IconShoppingCart} to="/panel-admin/ventas">
          Ventas
        </NavItem>
        <NavItem icon={IconReport} to="/panel-admin/reportes">
          Reportes
        </NavItem>
      </Box>
      <Box>
        <NavItem icon={IconSettings} to="/panel-admin/configuracion">
          Configuración
        </NavItem>
        <NavItem icon={IconLogout2} onClick={logout}>
          Cerrar sesión
        </NavItem>
      </Box>
    </Flex>
  </Box>
);

const NavItem = ({ icon, children, to, onClick }) => {
  const { pathname } = useLocation();
  const inactiveColor = useColorModeValue("primary", "gray.400");
  const hoverColor = useColorModeValue("gray.900", "gray.200");
  const hoverBg = useColorModeValue("gray.100", "gray.900");
  const activeBg = useColorModeValue("gray.200", "gray.700");
  const activeColor = useColorModeValue("gray.900", "gray.200");

  const isActive = pathname === to;

  return (
    <NavLink to={to} style={{ textDecoration: "none" }} onClick={onClick}>
      <Flex
        align="center"
        px={4}
        py={3}
        my={2}
        transition=".15s ease"
        color={isActive ? activeColor : inactiveColor}
        bg={isActive ? activeBg : "transparent"}
        rounded={10}
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
