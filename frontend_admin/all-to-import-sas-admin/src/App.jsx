import { useEffect } from "react";
import { AutenticacionProvider } from "./context/AutenticacionProvider";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { renderizarRutas, rutas } from "./routes/Rutas";
import { getToken } from "./js/config";

const App = () => {

  useEffect(() => {

    if(getToken() === null){
      localStorage.removeItem("token")
      console.log(getToken())
    }
  }, []);


  return (
    <Router>
      <AutenticacionProvider>
              <Routes>
                {renderizarRutas(rutas)}
              </Routes>
      </AutenticacionProvider>
    </Router>
  );
};

export default App;
