import { createContext, useEffect, useState } from "react";
import { obtenerProductos } from "../js/api/productos/obtenerProductos";
import { capitalizarPrimeraLetraPalabra } from "../utils/custom-theme/capitalizarPrimeraLetraPalabra";
import { obtenerProductosMenoresQueMil } from "../js/api/productos/obtenerProductosMenoresQueMil";

export const ProductosContext = createContext();

const ProductosProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [productosMenoresMil, setProductosMenoresMil] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductos();
    fetchProductosMenoresMil();
  }, []);


  const fetchProductos = async () => {
    try {
      const productos = await obtenerProductos();
      // Formatear los nombres de los productos
      const productosFormateados = productos.map(producto => ({
        ...producto,
        nombre: capitalizarPrimeraLetraPalabra(producto.nombre)
      }));
      setProductos(productosFormateados);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductosMenoresMil = async () => {
    try {
      const productos = await obtenerProductosMenoresQueMil();
      const productosFormateados = productos.map(producto => ({
        ...producto,
        nombre: capitalizarPrimeraLetraPalabra(producto.nombre)
      }));
      setProductosMenoresMil(productosFormateados);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductosContext.Provider value={{ productos, productosMenoresMil, loading, error }}>
      {children}
    </ProductosContext.Provider>
  );
};

export default ProductosProvider;
