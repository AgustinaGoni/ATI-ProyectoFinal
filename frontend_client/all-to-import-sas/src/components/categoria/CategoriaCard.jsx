import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Stack,
  Text,
  Button,
  Heading,
  Link as ChakraLink,
  Flex,
  Box,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const CategoriaCard = ({ id, nombre }) => {
  return (
    <>
      <Card
        key={id}
        bg={'primary'}
        // bgGradient="linear(to-r, #E2E0DA, #D1E4E6)" 
        // bgGradient="linear-gradient(to left bottom, #fafafa, #d3d3d3, #acacac, #888888, #656565, #565656, #484848, #3a3a3a, #a58080, #945454, #907373, #7f6868)"
        // background-image: linear-gradient(to left bottom, #319795, #2b8081, #266a6d, #225458, #1d4044);
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
        border={"none"}
        h={"100px"}
        color={'background'}
        _hover={{
          cursor: "pointer",
          transform: "scale(1.5)", // Scale effect on hover
          transition: "transform 0.5s ease-in-out", // Smooth transition for scale
        }}
        transition="0.3s ease-in-out" // Ensure transition is smooth
      >
        <CardBody
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          p={2}
          width="150px"
        >
          <Text 
          textAlign={"center"}
          fontWeight={600}
          textShadow={'md'}
           className="card-text ">
            {nombre}
          </Text>
        </CardBody>
      </Card>
    </>
  );
};

export default CategoriaCard;
