  import { useEffect, useState } from "react";
  import { useNavigate, Link as RouterLink } from "react-router-dom";
  import { obtenerComprasPorEstado } from "../../../js/api/compras/obtenerComprasPorEstado";
  import {
    IconShoppingCart,
  } from "@tabler/icons-react"; // Puedes cambiar el icono por otro que prefieras
  import CardGenerico from "../CardGenerico";
  
  const VentasFacturadasCard = () => {
    const navigate = useNavigate();
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        const compras = await obtenerComprasPorEstado(1); // Asumiendo que el estado "Facturado" tiene el valor 4
        setCompras(compras);
        setLoading(false);
      };
  
      fetchData();
    }, []);
    return (
      <CardGenerico
        loading={loading}
        titulo="Facturadas"
        cantidad={compras.length}
        items={compras}
        linkItem="/panel-admin/ventas/detalle-venta/"
        linkTo="/panel-admin/ventas/ventas-estado/facturadas/1"
        textoBoton="Ver todas las ventas facturadas"
        icono={IconShoppingCart}
        noHayDatos="No hay ventas facturadas"
      />
    );
  };
  
  export default VentasFacturadasCard;