import { createContext, useEffect, useState } from "react";
import { obtenerProductosBajoStock } from "../js/api/productos/obtenerProductosBajoStock";
import { obtenerTodosLosProductos } from "../js/api/productos/obtenerTodosLosProductos";

export const ProductosContext = createContext();

const ProductosProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [productosBajoStock, setProductosBajoStock] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productos = await obtenerTodosLosProductos();
        setProductos(productos);


        const stockBajo = await obtenerProductosBajoStock()
        setProductosBajoStock(stockBajo)

      } catch (error) {
        setError(error.message);
        console.log(error)
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

const productosHabilitados = productos.filter(producto => producto.habilitado);
const productosDeshabilitados = productos.filter(producto => !producto.habilitado);


  return (
    <ProductosContext.Provider value={{ productos, productosBajoStock, productosHabilitados, productosDeshabilitados, loading, error }}>
      {children}
    </ProductosContext.Provider>
  );
};

export default ProductosProvider;
