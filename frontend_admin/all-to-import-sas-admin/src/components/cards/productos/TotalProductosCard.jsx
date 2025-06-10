import { useProductos } from "../../../hooks/useProductos";
import { IconCube } from "@tabler/icons-react";
import CardGenericoProducto from "./CardGenericoProductos";


const TotalProductosCard = () => {
  const { productos, loading } = useProductos();


  return (
    <CardGenericoProducto
    loading={loading}
    titulo="Todos los productos"
    cantidad={productos.length}
    items={productos}
    linkTo="/panel-admin/productos"
    textoBoton="Ver todos los productos"
    icono={IconCube}
    noHayDatos="No hay productos registrados"
  />

  );
};

export default TotalProductosCard;
