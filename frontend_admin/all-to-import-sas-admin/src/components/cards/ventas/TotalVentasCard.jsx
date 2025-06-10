import { useEffect, useState } from "react";
import { obtenerCompras } from "../../../js/api/compras/obtenerCompras";
import { IconShoppingCart } from "@tabler/icons-react";
import CardGenerico from "../CardGenerico";

const TotalVentas = () => {
  const [compras, setCompras] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const compras = await obtenerCompras();
      setCompras(compras);
      setLoading(false);
    };

    fetchData();
  }, []);

  console.log(compras);
  return (
    <CardGenerico
      loading={loading}
      titulo="Todas las ventas"
      cantidad={compras.length}
      items={compras}
      linkItem="/panel-admin/ventas/detalle-venta/"
      linkTo="/panel-admin/ventas"
      textoBoton="Ver todas las ventas"
      icono={IconShoppingCart}
      noHayDatos="No hay ventas realizadas"
    />
  );
};

export default TotalVentas;
