import { useProductos } from "../../../hooks/useProductos";
import { IconCube } from "@tabler/icons-react";
import CardGenericoProducto from "./CardGenericoProductos";


const ProductosSinStokCard = () => {
  const { productosBajoStock, loading } = useProductos();


  return (
    <CardGenericoProducto
    loading={loading}
    titulo="Con bajo stock"
    cantidad={productosBajoStock.length}
    items={productosBajoStock}
    linkTo="/panel-admin/productos"
    textoBoton="Ver todos los productos"
    icono={IconCube}
    noHayDatos="No hay productos con stock bajo"
  />
  
  );
};

export default ProductosSinStokCard;
