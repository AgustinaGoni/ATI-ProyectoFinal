import { useProductos } from "../../../hooks/useProductos";
import { IconCube } from "@tabler/icons-react";
import CardGenericoProducto from "./CardGenericoProductos";


const ProductosDeshabilitadosCard = () => {
  const { productosDeshabilitados, loading } = useProductos();

  return (
    <CardGenericoProducto
    loading={loading}
    titulo="Deshabilitados"
    cantidad={productosDeshabilitados.length}
    items={productosDeshabilitados}
    linkTo="/panel-admin/productos"
    textoBoton="Ver todos los productos"
    icono={IconCube}
    noHayDatos="No hay productos deshabilitados"
  />

  );
};

export default ProductosDeshabilitadosCard;
