import React from "react";
import { Box, keyframes } from "@chakra-ui/react";


const cargarColor = keyframes`
  0% {
    width: 0;
  }
  90%, 100% {
    width: 100%;
  }
`;

const SpinnerComponent = () => {
  return (
      <Box
        bg="#FFFAF0"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          as="h1"
          data-text="cargando..."
          position="relative"
          fontSize="14vw"
          color="#FFFAF0"
          textTransform="uppercase"
          fontWeight="500"
          sx={{
            WebkitTextStroke: "1px #d6d6d5",
            "&::before": {
              content: "attr(data-text)",
              position: "absolute",
              top: 0,
              left: 0,
              width: 0,
              height: "100%",
              color: "#1675A1",
              WebkitTextStroke: "0 #d6d6d5",
              borderRight: "1px solid #1675A1",
              overflow: "hidden",
              animation: `${cargarColor} 5s linear alternate infinite`,
            },
          }}
        >
          cargando...
        </Box>
      </Box>
  );
};

export default SpinnerComponent;
