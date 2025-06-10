import React from "react";

const Container = ({ children }) => {
  return (
    <Container maxW="1280px" px={5}>
      {children}
    </Container>
  );
};

export default Container;
