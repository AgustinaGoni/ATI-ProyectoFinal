import React, { useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { customTheme } from "./utils/custom-theme/theme";
import { ModalProvider } from "./context/ModalProvider";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import { FiltrosProvider } from "./context/FiltrosProvider";
import ProductosProvider from "./context/ProductosProvider";
import CategoriasProvider from "./context/CategoriasProvider";
import { renderizarRutas, rutas } from "./routes/Rutas";
import UsuarioProvider from "./context/UsuarioProvider";
import { getToken } from "./js/config";
import './carrusel.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const App = () => {

  useEffect(() => {

    if(getToken() === null){
      localStorage.removeItem("token")
    }
  }, []);

  return (
    <ChakraProvider theme={customTheme}>
      <Router>
        <UsuarioProvider>
          <ModalProvider>
            <CategoriasProvider>
              <ProductosProvider>
                <FiltrosProvider>
                  <Routes>{renderizarRutas(rutas)}</Routes>
                </FiltrosProvider>
              </ProductosProvider>
            </CategoriasProvider>
          </ModalProvider>
        </UsuarioProvider>
      </Router>
    </ChakraProvider>
  );
};

export default App;
