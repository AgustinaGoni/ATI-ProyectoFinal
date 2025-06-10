using Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dominio.Interfaces
{
    public interface IRepoReportes
    {
        Task<List<Producto>> ObtenerProductosOrdenadosPorVentas(DateTime? fechaInicio, DateTime? fechaFin);
        Task<Dictionary<int, (int CantidadVendida, double TotalGenerado)>> ObtenerTotalesVendidosPorProductos(List<int> productoIds, DateTime? fechaInicio, DateTime? fechaFin);
        Task<IEnumerable<Compra>> ObtenerComprasPorFechaAsync(DateTime? fechaInicio, DateTime? fechaFin);

    }
}
