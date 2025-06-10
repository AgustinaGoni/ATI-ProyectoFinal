using AccesoDatos.EntityFramework;
using AllToImportSAS.Controllers.DTO;
using AllToImportSAS.Controllers.Servicios;
using Dominio.Entidades;
using Dominio.Excepciones;
using Dominio.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Observer;

namespace AllToImportSAS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class CompraController : ControllerBase
    {
        private readonly IRepoCompra repoCompra;
        private readonly IRepoProducto repoProducto;
        private readonly IRepoUsuario repoUsuario;
        private readonly ServicioProducto servicioProducto;
        private readonly ServicioStock servicioStock;
        private readonly ServicioEmail servicioEmail;

        public CompraController(IRepoCompra repoCompra, IRepoProducto repoProducto, IRepoUsuario repoUsuario, ServicioProducto servicioProducto, ServicioStock servicioStock, ServicioEmail servicioEmail)
        {
            this.repoCompra = repoCompra;
            this.repoProducto = repoProducto;
            this.repoUsuario = repoUsuario;
            this.servicioProducto = servicioProducto;
            this.servicioStock = servicioStock;
            this.servicioEmail = servicioEmail;
            //observable.Subscribir(this);
        }

        [HttpGet]
        //[Authorize]
        public async Task<ActionResult<List<Compra>>> GetCompras()
        {
            try
            {
                var compras = await repoCompra.BuscarTodo();
                return Ok(compras);
            }
            catch
            {
                return StatusCode(500, "Ha ocurrido un error");
            }
        }

        [HttpGet("TotalDeCompras")]
        [Authorize]
        public async Task<ActionResult> TotalDeCompras()
        {
            try
            {
                var total = repoCompra.BuscarTodasLasCompras();
                return Ok(total);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error. Error: {ex.Message}");
            }
        }

        /// <summary>
        /// Metodo para el Administrador
        /// Metódo que devuelve las compras por paginacion, devuelve n compras por página.
        /// </summary>
        /// <param name="numeroPagina"></param>
        /// <param name="comprasPorPagina"></param>
        /// <returns></returns>
        [HttpGet("ComprasParaFuncionario")]
        [Authorize]
        public async Task<ActionResult> ComprasPorPaginacion(int numeroPagina, int comprasPorPagina)
        {
            try
            {
                // Contar el total de registros en la base de datos
                var totalCompras = await repoCompra.ContarTotalCompras();

                var compras = await repoCompra.BuscarTodasLasCompras()
                    .Skip((numeroPagina - 1) * comprasPorPagina)
                    .Take(comprasPorPagina)
                    .ToListAsync();

                // Crear la respuesta que incluye los datos paginados y la información de la paginación
                var respuesta = new
                {
                    Data = compras,
                    Total = totalCompras,
                    NumeroPagina = numeroPagina,
                    ComprasPorPagina = comprasPorPagina
                };
                return Ok(respuesta);
            }
            catch (Exception ex)
            {
                // Maneja el error y devuelve un código de estado apropiado
                return StatusCode(500, new { message = "Ocurrio un error.", details = ex.Message});
            }
        }

        [HttpPost]
        public async Task<ActionResult> AltaCompra(DTOCompra compra)
        {
            try
            {
                await ValidarDatosDelCarrito(compra);
                List<ItemCompra> itemsCompra = new List<ItemCompra>();
                foreach (var dtoCompra in compra.Items)
                {
                    ItemCompra itemCompra = new ItemCompra
                    {
                        Producto = await repoProducto.BuscarPorId(dtoCompra.IdProducto),
                        Cantidad = dtoCompra.Cantidad,
                    };
                    itemsCompra.Add(itemCompra);
                }
                TipoEntrega t = new TipoEntrega();
                if (compra.TipoEnvio == "domicilio")
                {
                    t = new EnvioDomicilio
                    {
                        IdCliente = compra.IdCliente,
                        IdDireccion = compra.EnvioDomicilio.IdDireccion,
                        Comentario = compra.EnvioDomicilio.Comentario
                    };
                }
                else
                {
                    t = new RetiroCompra
                    {
                        DocumentoCliente = compra.RetiroCompra.NumeroDocumento,
                        TipoDocumento = compra.RetiroCompra.TipoDocumento,
                        DatosNegocioId = Int32.Parse(compra.RetiroCompra.IdDatosNegocio),
                        NombreApellido = compra.RetiroCompra.NombreApellido,
                        Comentario = compra.RetiroCompra.Comentario
                    };
                }
                Cliente? cliente = (Cliente)await repoUsuario.BuscarUsuarioParaRealizarCompra(compra.IdCliente);

                Compra c = new Compra
                {
                    ItemsCompra = itemsCompra,
                    FechaCompra = DateTime.Now,
                    Cliente = cliente,
                    TipoEntrega = t,
                    Rut = compra.Rut,
                    RazonSocial = compra.RazonSocial,
                    Telefono = compra.Telefono,
                    EstadoCompra = EstadoCompra.Confirmada
                };

                await repoCompra.Alta(c);
                // Clonar los datos necesarios para los correos electrónicos
                //Compra datosCompraCorreo = new Compra
                //{
                //    Id = c.Id,
                //    Cliente = new Cliente { CorreoElectronico = cliente.CorreoElectronico },
                //    ItemsCompra = c.ItemsCompra.ToList(),
                //    FechaCompra = c.FechaCompra,
                //    TipoEntrega = c.TipoEntrega,
                //    Rut = c.Rut,
                //    RazonSocial = c.RazonSocial,
                //    Telefono = c.Telefono,
                //};
                //string correoCliente = cliente.CorreoElectronico;
                //// var productosDelWebService = await servicioStock.ObtenerStockAsync();
                ////await servicioProducto.ActualizarProductosAsync(productosDelWebService);
                //await servicioEmail.EnviarCorreoConfirmacionCompraComprador(datosCompraCorreo, correoCliente);
                //await servicioEmail.EnviarCorreoConfirmacionCompraVendedor(datosCompraCorreo, "rimeh27815@biowey.com");
                return Ok(c);
            }
            catch (CompraException ex) {
                return BadRequest(ex.Message);

            }
            catch(Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error al dar de alta la compra {ex.Message}");
            }
        }

        /// <summary>
        /// Buscar compras por cliente.
        /// </summary>
        /// <param name="documentoIdentidad">Identificador del cliente para buscar una compra</param>
        /// <returns>Devuelve todas las compras realizadas por un cliente en especifico.</returns>
        [HttpGet("ComprasCliente/{documentoIdentidad}")]
        [Authorize]
        public async Task<ActionResult<List<Compra>>> ObtenerComprasDelCliente(string documentoIdentidad)
        {
            try
            {
                var compras = await repoCompra.BuscarComprasPorCliente(documentoIdentidad);
                if(!compras.Any())
                {
                    return Ok("El cliente ingresado no tiene compras realizadas");
                }
                return Ok(compras);
            }
            catch (CompraException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Buscar compras por cliente.
        /// </summary>
        /// <param name="idCompra">Identificador de una compra</param>
        /// <returns>Devuelve la compra.</returns>
        [HttpGet("CompraPorId/{idCompra}")]
        [Authorize]
        public async Task<ActionResult<Compra>> ObtenerCompraPorId(int idCompra)
        {
            try
            {
                var compra = await repoCompra.BuscarPorId(idCompra);
               
                return Ok(compra);
            }
            catch(CompraException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        //[HttpPut("Estado/{id}")]
        //public async Task<IActionResult> ActualizarEstado(int id, [FromBody] EstadoCompra nuevoEstado)
        //{
        //    try
        //    {
        //        var compra = await repoCompra.ActualizarEstado(id, nuevoEstado);
        //        if (compra == null)
        //        {
        //            throw new CompraException("Error al cambiar el estado de la compra.");
        //        }
        //        return Ok(compra);
        //    }
        //    catch(CompraException ex)
        //    {
        //      return  BadRequest(ex.Message);
        //    }

        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}

        [HttpPut("Estado/{idCompra}/{nuevoEstado}")]
        [Authorize]
        public async Task<IActionResult> ActualizarEstado(int idCompra, EstadoCompra nuevoEstado)
        {
            try
            {
                var compra = await repoCompra.ActualizarEstado(idCompra, nuevoEstado);
                if (compra == null)
                {
                    throw new CompraException("Error al cambiar el estado de la compra.");
                }
                if (nuevoEstado != EstadoCompra.Facturada)
                {
                    await servicioEmail.EnviarCorreoCambioEstadoCompra(compra);
                }
                
                return Ok(compra);
            }
            catch (CompraException ex)
            {
                return BadRequest(ex.Message);
            }

            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("Estado/{estado}")]
        [Authorize]
        public async Task<IActionResult> GetComprasPorEstado(EstadoCompra estado)
        {
            var compra = await repoCompra.BuscarCompraPorEstado(estado);
            return Ok(compra);
        }
        private async Task ValidarDatosDelCarrito(DTOCompra carrito)
        {

            // Validar datos básicos del carrito
            //ValidarCarritoBasico(carrito);

            // Validar productos
            await ValidarProductos(carrito.Items);

            // Validar cliente
            //await ValidarCliente(carrito.Cliente.IdCliente);

            // Validar opciones de envío
            //await ValidarOpcionEnvio(carrito);

        }

        private void ValidarCarritoBasico(DTOCarrito carrito)
        {
            if (carrito == null) throw new CompraException("Datos del carrito inválidos.");
            if (carrito.Productos == null || carrito.Productos.Count == 0) throw new CompraException("No hay productos seleccionados.");
            if (carrito.Cliente == null) throw new CompraException("Los datos del cliente son necesarios.");
        }

        private async Task ValidarProductos(List<DTOItemCompra> productos)
        {
            foreach (var producto in productos)
            {
                if (producto.IdProducto <= 0) throw new CompraException("Id del producto inválido.");
                var p = await repoProducto.BuscarPorId(producto.IdProducto) ?? throw new CompraException("El producto no existe.");
                //if (string.IsNullOrEmpty(producto.Nombre)) throw new CompraException("El producto no contiene un nombre.");
                //if (producto.PrecioUnitario <= 0) throw new CompraException("Precio del producto no válido.");
                if (producto.Cantidad <= 0 || producto.Cantidad > p.Stock) throw new CompraException("Cantidad del producto no válida.");
            }
        }

        private async Task ValidarCliente(int idCliente)
        {
            var cliente = await repoUsuario.BuscarClientePorId(idCliente) ?? throw new UsuarioException("No se ha encontrado al usuario.");
        }

        private async Task ValidarOpcionEnvio(DTOCarrito carrito)
        {
            if (string.IsNullOrEmpty(carrito.OpcionEnvio)) throw new CompraException("No se ha seleccionado ninguna opción de envío.");
            if (carrito.OpcionEnvio != "domicilio" && carrito.OpcionEnvio != "retiro") throw new CompraException("Opción de envío incorrecta.");

            if (carrito.OpcionEnvio == "domicilio")
            {
                await ValidarEnvioDomicilio(carrito.EnvioDomicilio);
            }
            else if (carrito.OpcionEnvio == "retiro")
            {
                ValidarRetiroCompra(carrito.RetiroCompra);
            }
        }

        private async Task ValidarEnvioDomicilio(DTOEnvioDomicilio envioDomicilio)
        {
            if (envioDomicilio == null) throw new CompraException("Datos de envío a domicilio inválidos.");
            var direccion = await repoUsuario.BuscarDireccion(envioDomicilio.IdDireccion);
            if (direccion == null) throw new CompraException("Dirección de envío no encontrada.");
        }

        private void ValidarRetiroCompra(DTORetiroCompra retiroCompra)
        {
            if (retiroCompra == null) throw new CompraException("Datos de retiro inválidos.");
            if (string.IsNullOrEmpty(retiroCompra.NumeroDocumento)) throw new CompraException("Número de documento inválido.");
            if (string.IsNullOrEmpty(retiroCompra.NombreApellido)) throw new CompraException("Nombre y apellido son necesarios para el retiro.");
        }

        #region Modificar
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public ActionResult Edit(int id, IFormCollection collection)
        //{
        //    try
        //    {
        //        return RedirectToAction(nameof(Index));
        //    }
        //    catch
        //    {
        //        return View();
        //    }
        //} 
        #endregion

        #region Eliminar
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public ActionResult Delete(int id, IFormCollection collection)
        //{
        //    try
        //    {
        //        return RedirectToAction(nameof(Index));
        //    }
        //    catch
        //    {
        //        return View();
        //    }
        //} 
        #endregion
    }
}
