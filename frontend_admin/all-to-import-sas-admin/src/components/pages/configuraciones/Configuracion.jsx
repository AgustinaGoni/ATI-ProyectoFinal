import {
  Box,
  Button,
  Flex,
  Heading,
  List,
  ListItem,
  ListIcon,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import {
  IconTruck,
  IconUser,
  IconUsersGroup,
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, Link as RouterLink } from "react-router-dom";
import { obtenerFuncionarios } from "../../../js/api/usuarios/funcionario/obtenerFuncionarios";
import { obtenerDatosNegocio } from "../../../js/api/obtenerDatosNegocio";

const Configuracion = () => {
  const navigate = useNavigate();
  const [funcionarios, setFuncionarios] = useState([]);
  const [datosNegocio, setDatosNegocio] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [funcionariosData, datosNegocioData] = await Promise.all([
          obtenerFuncionarios(),
          obtenerDatosNegocio(),
        ]);
        setFuncionarios(funcionariosData);
        setDatosNegocio(datosNegocioData);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log(datosNegocio);
  return (
    <>
      <Box mb={8}>
        <Heading>Configuraciones</Heading>
      </Box>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <GridItem colSpan={1}>
          <Flex
            flexDirection={"column"}
            bg={"gray.100"}
            boxShadow="md"
            p={3}
            justifyContent={"start"}
          >
            <Flex columnGap={4} mb={4}>
              <IconUsersGroup />
              <Heading as={"h2"} size={"md"}>
                Funcionarios
              </Heading>
            </Flex>

            <List spacing={1}>
              {funcionarios.slice(-3).map((funcionario) => (
                <ListItem key={funcionario.id}>
                  <ListIcon as={IconUser} color="green.500" />
                  {funcionario.nombre} {funcionario.apellido}
                </ListItem>
              ))}
            </List>
            <Flex columnGap={4} mt={6}>
              <Button
                as={RouterLink}
                textDecoration={"none"}
                variant={"link"}
                to="/panel-admin/configuracion/funcionarios"
              >
                Ver mas detalles
              </Button>
              <Button
                as={RouterLink}
                textDecoration={"none"}
                variant={"link"}
                to="/panel-admin/configuracion/registrar-funcionario"
              >
                Nuevo funcionario
              </Button>
            </Flex>
          </Flex>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex
            flexDirection={"column"}
            bg={"gray.100"}
            boxShadow="md"
            p={3}
            justifyContent={"start"}
          >
            <Flex columnGap={4} mb={4}>
              <IconUsersGroup />
              <Heading as={"h2"} size={"md"}>
                Lugares de retiro
              </Heading>
            </Flex>

            <List spacing={1}>
              {datosNegocio.slice(-3).map((funcionario) => (
                <ListItem key={funcionario.id}>
                  <ListIcon as={IconTruck} color="green.500" />
                  {funcionario.nombre}
                </ListItem>
              ))}
            </List>
            <Flex columnGap={4} mt={6}>
              <Button
                as={RouterLink}
                textDecoration={"none"}
                variant={"link"}
                to="/panel-admin/configuracion/ver-direcciones-retiro"
              >
                Ver lugares de retiro
              </Button>
              <Button
                as={RouterLink}
                textDecoration={"none"}
                variant={"link"}
                to="/panel-admin/configuracion/agregar-direccion-retiro"
              >
                Agregar nuevo lugar de retiro
              </Button>
            </Flex>
          </Flex>
        </GridItem>
      </Grid>
      <Outlet />
    </>
  );
};

export default Configuracion;
