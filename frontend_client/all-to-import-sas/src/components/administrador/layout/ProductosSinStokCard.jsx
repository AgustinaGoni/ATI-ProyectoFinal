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
import { useProductos } from "../../../hooks/useProductos";

const plansList = [
  {
    title: "Growth",
    price: 79,
    // icon: AiOutlineCloudServer,
    features: [
      "Deploy 10 apps",
      "4 Servers",
      "Push to deploy",
      "Collaborate with your team",
      "Setup load balanced clusters",
    ],
  },
];

const ProductosSinStokCard = () => {
  const navigate = useNavigate();
  const {productos} = useProductos()
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  // const[stockBajo, setStockBajo] = useState(0)

  console.log(productos)
  const stockBajo = productos.filter(producto => producto.stock < 10).length;

  console.log(stockBajo)

  return (
    <Box
      w="md"
      rounded="md"
      bg={useColorModeValue("white", "gray.800")}
      boxShadow="md"
      my={3}
      p={6}
    >
      <Box textAlign="center">
        <Heading fontSize="2xl" fontWeight={"normal"}>
          Productos con bajo stock
        </Heading>
        <Box fontSize="7xl" fontWeight="bold">
          <Text>{stockBajo}</Text>
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
};

export default ProductosSinStokCard;
