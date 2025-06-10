using Dominio.Entidades;
using Dominio.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccesoDatos.EntityFramework
{
    public class RepoReportes : IRepoReportes
    {
        AllToImportContext db;

        public RepoReportes(AllToImportContext db)
        {
            this.db = db;
        }


        public async Task<List<Producto>> ObtenerProductosOrdenadosPorVentas(DateTime? fechaInicio, DateTime? fechaFin)
        {
            return await db.Compras
                .Where(c => c.FechaCompra >= fechaInicio && c.FechaCompra <= fechaFin && c.EstadoCompra > 0)
                .SelectMany(c => c.ItemsCompra)
                .GroupBy(ic => ic.Producto.Id)
                .OrderByDescending(g => g.Sum(ic => ic.Cantidad))
                .Select(g => g.First().Producto)
                .ToListAsync();
        }

        

        public async Task<Dictionary<int, (int CantidadVendida, double TotalGenerado)>> ObtenerTotalesVendidosPorProductos(List<int> productoIds, DateTime? fechaInicio, DateTime? fechaFin)
        {
            return await db.Compras
                .Where(c => c.FechaCompra >= fechaInicio && c.FechaCompra <= fechaFin)
                .SelectMany(c => c.ItemsCompra)
                .Where(ic => productoIds.Contains(ic.Producto.Id))
                .GroupBy(ic => ic.Producto.Id)
                .ToDictionaryAsync(
                    g => g.Key,
                    g => (
                        CantidadVendida: g.Sum(ic => ic.Cantidad),
                        TotalGenerado: g.Sum(ic => ic.Cantidad * ic.Producto.Precio)
                    )
                );
        }

        public async Task<IEnumerable<Compra>> ObtenerComprasPorFechaAsync(DateTime? fechaInicio, DateTime? fechaFin)
        {
            var compras = db.Compras
                    .Include(c => c.Cliente) 
                    .Include(c => c.ItemsCompra)
                        .ThenInclude(ic => ic.Producto) 
                    .Where(c => c.EstadoCompra > 0)
                    .AsQueryable();

            if (fechaInicio.HasValue && fechaFin.HasValue)
            {
                compras = compras.Where(c => c.FechaCompra >= fechaInicio.Value && c.FechaCompra <= fechaFin.Value);
            }
            else if (fechaInicio.HasValue)
            {
                compras = compras.Where(c => c.FechaCompra.Date == fechaInicio.Value.Date);
            }
            else if (fechaFin.HasValue)
            {
                compras = compras.Where(c => c.FechaCompra.Date == fechaFin.Value.Date);
            }
            var resultado = await compras.ToListAsync();

            return resultado.Any() ? resultado : new List<Compra>();
        }


        
    }
}
