import {
  chakra,
  VStack,
  HStack,
  Text,
  Container,
  Box,
  Icon,
  Button,
  SimpleGrid,
  useColorModeValue,
  Heading,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerCompras } from "../../../js/api/compras/obtenerCompras";

const TotalVentas = () => {
  const navigate = useNavigate();
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const compras = await obtenerCompras();
      setCompras(compras);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <Box
      // minW={{ base: "xs", sm: "xs", lg: "sm" }}
      w="md"
      rounded="md"
      bg={useColorModeValue("white", "gray.800")}
      boxShadow="md"
      my={3}
      p={6}
    >
      <Box textAlign="center">
        <Heading fontSize="2xl" fontWeight={"normal"}>
          Ventas totales
        </Heading>
        <Box fontSize="7xl" fontWeight="bold">
          <Text>{compras.length}</Text>
        </Box>
        <Button
          colorScheme="teal"
          variant="solid"
          size="md"
          onClick={() => navigate("/ventas")}
        >
          Ir a las ventas
        </Button>
      </Box>
    </Box>
  );
}

export default TotalVentas