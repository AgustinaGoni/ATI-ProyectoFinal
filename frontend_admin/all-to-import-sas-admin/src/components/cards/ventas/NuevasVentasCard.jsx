
import { useEffect, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { obtenerComprasPorEstado } from "../../../js/api/compras/obtenerComprasPorEstado";
import {
  IconShoppingCart,
} from "@tabler/icons-react";
import CardGenerico from "../CardGenerico";

const NuevasVentasCard = ({onLoad}) => {
  const navigate = useNavigate();
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const compras = await obtenerComprasPorEstado(0);
        setCompras(compras);
      } catch (error) {
        console.error("Error al obtener las compras:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [onLoad]);

  return (
    <CardGenerico
      loading={loading}
      titulo="Para Procesar"
      cantidad={compras.length}
      items={compras}
      linkItem="/panel-admin/ventas/detalle-venta/"
      linkTo="/panel-admin/ventas/ventas-estado/para-procesar/0"
      textoBoton="Ver todas las ventas para procesar"
      icono={IconShoppingCart}      
      noHayDatos="No hay ventas para procesar"
    />
  );
};

export default NuevasVentasCard;
