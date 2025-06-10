import React, { useEffect, useState } from "react";
import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import VentasPendientesEnvioCard from "./VentasPendientesEnvioCard";
import ProductosSinStokCard from "./ProductosSinStokCard";
import TotalVentas from "./TotalVentas";

const Dashboard = () => {

  return (
    <>

      <Flex gap={8} justifyContent={'space-around'}>
        <VentasPendientesEnvioCard />
        <ProductosSinStokCard />
        <TotalVentas/>
      </Flex>
    </>
  );
};

export default Dashboard;
