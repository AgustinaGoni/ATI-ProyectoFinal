using AllToImportSAS.Controllers.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AllToImportSAS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StockController : ControllerBase
    {
        private readonly ServicioStock _servicioStock;
        private readonly ServicioProducto _servicioProducto;
        private readonly ServicioActualizacion _servicioActualizacion;

        public StockController(ServicioStock servicioStock, ServicioProducto servicioProducto, ServicioActualizacion servicioActualizacion)
        {
            _servicioStock = servicioStock;
            _servicioProducto = servicioProducto;
            _servicioActualizacion = servicioActualizacion;
        }

        [HttpGet("ObtenerStockActualizado2")]
        [Authorize]
        public async Task<ActionResult> ObtenerStock()
        {

            try
            {
                //var productos = await _servicioStock.ObtenerStockAsync();
                var productos = await _servicioActualizacion.RealizarTrabajoProductos();
                if (productos == null)
                {
                    return StatusCode(500, "Error obteniendo productos del web service.");
                }
                await _servicioProducto.ActualizarProductosAsync(productos);
               // return Ok("Stock actualizado correctamente.");
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error actualizando productos: {ex.Message}");
            }
        }

        //[HttpGet("ObtenerStockActualizadoGIT")]
        [HttpGet("ObtenerStockActualizado")]
        //[Authorize]
        public async Task<ActionResult> ObtenerStockGIT()
        {

            try
            {

                var productos = await _servicioActualizacion.RealizarTrabajoProductos();
                if (productos == null)
                {
                    return StatusCode(500, "Error obteniendo productos del web service.");
                }
                await _servicioProducto.ActualizarProductosAsync(productos);
                // return Ok("Stock actualizado correctamente.");
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error actualizando productos: {ex.Message}");
            }
        }

        [HttpGet("ObtenerStockActualizadoWS")]
        //[Authorize]
        public async Task<ActionResult> ObtenerStockWS()
        {

            try
            {
                var productos = await _servicioStock.ObtenerStockAsync();

                if (productos == null)
                {
                    return StatusCode(500, "Error obteniendo productos del web service.");
                }
                await _servicioProducto.ActualizarProductosAsync(productos);

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error actualizando productos: {ex.Message}");
            }
        }
    }
}
