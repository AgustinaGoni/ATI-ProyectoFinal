import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerComprasPorEstado } from "../../../js/api/compras/obtenerComprasPorEstado";
import {
  IconShoppingCart
} from "@tabler/icons-react";
import CardGenerico from "../CardGenerico";

const VentasParaEnvioCard = () => {
  const navigate = useNavigate();
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const compras = await obtenerComprasPorEstado(2);
      setCompras(compras);
      setLoading(false);
    };

    fetchData();
  }, []);
  return (
    <CardGenerico
      loading={loading}
      titulo="Enviadas a domicilio"
      cantidad={compras.length}
      items={compras}
      linkItem="/panel-admin/ventas/detalle-venta/"
      linkTo="/panel-admin/ventas/ventas-estado/enviadas/2"
      textoBoton="Ver todas las ventas enviadas"
      icono={IconShoppingCart}
      noHayDatos="No hay ventas para enviar"
    />
  );
};

export default VentasParaEnvioCard;
