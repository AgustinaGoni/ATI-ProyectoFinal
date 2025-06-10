import { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import { obtenerComprasPorEstado } from "../../../js/api/compras/obtenerComprasPorEstado";
import {
  IconShoppingCart
} from "@tabler/icons-react";
import CardGenerico from "../CardGenerico";
// import Cargando from "../Cargando";

const VentasFinalizadasCard = () => {
  const navigate = useNavigate();
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const compras = await obtenerComprasPorEstado(4);
      setCompras(compras);
      setLoading(false);
    };

    fetchData();
  }, []);
  return (
    <CardGenerico
      loading={loading}
      titulo="Finalizadas"
      cantidad={compras.length}
      items={compras}
      linkItem="/panel-admin/ventas/detalle-venta/"
      linkTo="/panel-admin/ventas/ventas-estado/finalizadas/4"
      textoBoton="Ver todas las ventas finalizadas"
      icono={IconShoppingCart}
      noHayDatos="No hay ventas finalizadas"
    />
  );
};

export default VentasFinalizadasCard;
