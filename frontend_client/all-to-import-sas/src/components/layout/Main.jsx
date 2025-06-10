import { Box } from "@chakra-ui/react";
import React from "react";



const SeccionMain = ({children}) => {
  return (
    <Box as="main" gridArea="main">
      {children}
    </Box>
  );
};

export default SeccionMain;
