import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerComprasPorEstado } from "../../../js/api/compras/obtenerComprasPorEstado";
import {
  IconShoppingCart
} from "@tabler/icons-react";
import CardGenerico from "../CardGenerico";

const VentasParaRetiroCard = () => {
  const navigate = useNavigate();
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const compras = await obtenerComprasPorEstado(3);
      setCompras(compras);
      setLoading(false);
    };

    fetchData();
  }, []);
  return (
    <CardGenerico
      loading={loading}
      titulo="Listas para retirar"
      cantidad={compras.length}
      items={compras}
      linkItem="/panel-admin/ventas/detalle-venta/"
      linkTo="/panel-admin/ventas/ventas-estado/para-retirar/3"
      textoBoton="Ver todas las ventas para retirar"
      icono={IconShoppingCart}
      noHayDatos="No hay ventas para retirar"
    />
  );
};

export default VentasParaRetiroCard;
