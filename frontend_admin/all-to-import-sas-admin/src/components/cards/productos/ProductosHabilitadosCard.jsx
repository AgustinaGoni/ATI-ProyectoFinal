import { useProductos } from "../../../hooks/useProductos";
import { IconCube } from "@tabler/icons-react";
import CardGenericoProducto from "./CardGenericoProductos";


const ProductosHabilitadosCard = () => {
  const { productosHabilitados, loading } = useProductos();


  return (
    <CardGenericoProducto
    loading={loading}
    titulo="Habilitados"
    cantidad={productosHabilitados.length}
    items={productosHabilitados}
    linkTo="/panel-admin/productos"
    textoBoton="Ver todos los productos"
    icono={IconCube}
    noHayDatos="No hay productos habilitados"
  />
   
  );
};

export default ProductosHabilitadosCard;
