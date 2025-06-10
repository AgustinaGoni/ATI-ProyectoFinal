import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "@fontsource/lato/100.css";
import "@fontsource/lato/300.css";
import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";
import "@fontsource/lato/900.css";

import { AutenticacionProvider } from "./context/autenticacion/AutenticacionProvider.jsx";
import { CarritoProvider } from "./context/CarritoProvider.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { GlobalStyleComponent } from "./utils/custom-theme/GlobalStyleComponent.jsx";
import customTheme from "./utils/custom-theme/theme.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <ChakraProvider
      theme={customTheme}
      toastOptions={{
        defaultOptions: { position: "bottom", isClosable: true },
      }}
    >
      <GlobalStyleComponent />
      <AutenticacionProvider>
        <CarritoProvider>
          <App />
        </CarritoProvider>
      </AutenticacionProvider>
    </ChakraProvider>
  // </React.StrictMode>
);
