import React from "react";
import { Box } from "@chakra-ui/react";
import Header from "./Header";
import NavBarInfo from "./NavBarInfo";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box display={{ base: "none", lg: "block" }}>
        <NavBarInfo />
      </Box>
      <Header />
      <Box as="main" flex={1}>{children}</Box>
      <Footer />
    </Box>
  );
};

export default Layout;
