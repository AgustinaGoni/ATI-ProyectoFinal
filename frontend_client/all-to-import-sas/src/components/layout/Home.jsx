import React from "react";
import Hero from "../Hero";
import { Center, Container, Divider, Flex } from "@chakra-ui/react";
import Slider from "react-slick";
import CardGenerico from "../CardGenerico";
import {
  IconBuildingStore,
  IconCreditCard,
  IconTruck,
} from "@tabler/icons-react";
import ProductosCarrusel from "../producto/ProductosCarrusel";
import CategoriaCarrusel2 from "../categoria/CategoriaCarrusel2";
import ProductosMenorQueMilCarrusel from "../producto/ProductosMenorQueMilCarrusel";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const Home = () => {
  return (
    <>
      <Hero />
      <Container maxW="1280px" px={5} my={8}>
        {/* Slider para la versión móvil */}
        <Flex display={{ base: "block", md: "none" }} p={4}>
          <Slider {...settings}>
            <CardGenerico
              titulo="Envíos a todo el país"
              descripcion="A través de cadeteria dentro de Montevideo y por DAC para el resto del país"
              icono={<IconTruck size={58} strokeWidth={1} />}
            />
            <CardGenerico
              titulo="Paga con tarjeta"
              descripcion="A través de Mercado Pago podes pagar en cuotas sin recargo"
              icono={<IconCreditCard size={58} strokeWidth={1} />}
            />
            <CardGenerico
              titulo="Retiros en persona"
              descripcion="Contamos con retiros en persona en Lezica y Unión "
              icono={<IconBuildingStore size={58} strokeWidth={1} />}
            />
          </Slider>
        </Flex>
        <Flex
          mt={8}
          justifyContent={"space-between"}
          flexDirection={{ base: "column", md: "row" }}
          gap={4}
          p={4}
          display={{ base: "none", md: "flex" }}
        >
          <CardGenerico
            titulo="Envíos a todo el país"
            descripcion="A través de cadeteria dentro de Montevideo y por DAC para el resto del país"
            icono={<IconTruck size={58} strokeWidth={1} />}
          />
          <CardGenerico
            titulo="Paga con tarjeta"
            descripcion="A través de Mercado Pago podes pagar en cuotas sin recargo"
            icono={<IconCreditCard size={58} strokeWidth={1} />}
          />
          <CardGenerico
            titulo="Retiros en persona"
            descripcion="Contamos con retiros en persona en Lezica y Unión "
            icono={<IconBuildingStore size={58} strokeWidth={1} />}
          />
        </Flex>
        <ProductosCarrusel />
        {/* <CategoriaCarrusel2 /> */}
        <ProductosMenorQueMilCarrusel/>
      </Container>
    </>
  );
};

export default Home;
