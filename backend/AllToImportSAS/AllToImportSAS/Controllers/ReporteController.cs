using AccesoDatos.EntityFramework;
using AllToImportSAS.Controllers.DTO;
using Dominio.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static AccesoDatos.EntityFramework.RepoProductos;

namespace AllToImportSAS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReporteController : ControllerBase
    {
        private readonly IRepoReportes repoReportes;

        public ReporteController(IRepoReportes repoReportes)
        {
            this.repoReportes = repoReportes;
        }

        [HttpGet("reporte-ventas/{fechaInicio}/{fechaFin}")]
        public async Task<IActionResult> ObtenerDetalleVentas(DateTime fechaInicio, DateTime fechaFin)
        {
            try
            {
                var compras = await repoReportes.ObtenerComprasPorFechaAsync(fechaInicio, fechaFin);
                if (compras == null || !compras.Any())
                {
                    return NotFound("No se encontraron compras en el rango de fechas especificado.");
                }
                var detalleVentas = compras.Select(c => new DTODetalleVenta
                {
                    FechaCompra = c.FechaCompra,
                    Cliente = c.Cliente != null ? c.Cliente.Nombre : "Cliente no disponible",
                    TotalComprado = c.TotalComprado,
                    EstadoCompra = c.EstadoCompra.ToString(),
                    ItemsCompra = c.ItemsCompra.Select(i => new DTOProductoReporte
                    {
                        Nombre = i.Producto.Nombre,
                        Cantidad = i.Cantidad,
                        Total = i.Producto.Precio,
                    }).ToList()
                }).ToList();
                return Ok(detalleVentas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Se produjo un error en el servidor: {ex.Message}");
            }
        }



        [HttpGet("productos-mas-vendidos/{fechaInicio}/{fechaFin}")]
        public async Task<IActionResult> GetProductosMasVendidosPorRangoFechas(DateTime fechaInicio, DateTime fechaFin)
        {
            try
            {
                var productosOrdenados = await repoReportes.ObtenerProductosOrdenadosPorVentas(fechaInicio, fechaFin);
                var productoIds = productosOrdenados.Select(p => p.Id).ToList();

                if (!productoIds.Any())
                {
                    return NotFound("No se encontraron productos vendidos en el rango de fechas especificado.");
                }

                var totalesVendidos = await repoReportes.ObtenerTotalesVendidosPorProductos(productoIds, fechaInicio, fechaFin);
                var productosReporte = productosOrdenados.Select(p => new DTOProductoReporte
                {
                    Id = p.Id,
                    Nombre = p.Nombre,
                    Cantidad = totalesVendidos[p.Id].CantidadVendida,
                    Total = totalesVendidos[p.Id].TotalGenerado
                }).ToList();

                return Ok(productosReporte);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Se produjo un error en el servidor: {ex.Message}");
            }
        }

    }
}
