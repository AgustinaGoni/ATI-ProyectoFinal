using AccesoDatos.EntityFramework;
using AllToImportSAS.Controllers.DTO;
using Dominio.Entidades;
using Dominio.Excepciones;
using Dominio.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Drawing.Printing;

namespace AllToImportSAS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class ProductoController : ControllerBase
    {
        private readonly IRepoProducto repoProducto;
        private readonly IRepoCategoria repoCategoria;
        private readonly ILogger<ProductoController> _logger;
        public ProductoController(IRepoProducto repoProducto, IRepoCategoria repoCategoria, ILogger<ProductoController> logger)
        {
            this.repoProducto = repoProducto;
            this.repoCategoria = repoCategoria;
            _logger = logger;
        }

        /// <summary>
        /// Se muestra un producto en particular según si identificador, en este caso el id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Producto>> GetProductoById(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return NotFound("Producto no encontrado");
                }

                return await repoProducto.BuscarPorId(id);
            }
            catch
            {
                return StatusCode(500, "Ha ocurrido un error");
            }
        }

        /// <summary>
        /// Muestra todos los productos que hay en el sistema, ya sea que esten habilitados o deshabilitados
        /// </summary>
        /// <returns></returns>
        [HttpGet("TodosLosProductos")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Producto>>> TodosLosProductos()
        {
            try
            {
                var productos = await repoProducto.BuscarTodo();
                return Ok(productos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Ocurrió un error en el servidor.", details = ex.Message });
            }
        }


        /// <summary>
        /// Solo muestra los productos habilitados, esto se utiliza principalmente para mostrar a los clientes que navegan por la web
        /// </summary>
        /// <returns></returns>
        [HttpGet("ProductosHabilitados")]
        //[Authorize]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProductosHabilitados()
        {
            try
            {
                var productos = await repoProducto.BuscarTodoHabilitados();
                return Ok(productos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Ocurrió un error en el servidor.", details = ex.Message });
            }
        }

        /// <summary>
        /// Solo muestra los productos con precio menor a $1000, esto se utiliza principalmente para mostrar a los clientes que navegan por la web
        /// </summary>
        /// <returns></returns>
        [HttpGet("ProductosMenoresMil")]
        //[Authorize]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProductosMenoresQueMil()
        {
            try
            {
                var productos = await repoProducto.BuscarProductosMenoresQueMil();
                return Ok(productos);
            }
            catch (ProductoException ex)
            {
                return BadRequest(new { message = "Ocurrió un error.", details = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Ocurrió un error en el servidor.", details = ex.Message });
            }
        }


        //[HttpPut("habilitar/{id}")]
        //public async Task<IActionResult> HabilitarProducto(int id)
        //{
        //    try
        //    {
        //        bool resultado = await repoProducto.Habilitar(id);
        //        if (resultado)
        //        {
        //            return Ok(new { message = "Producto habilitado con éxito" });
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new { message = ex.Message });
        //    }
        //    return NotFound(new { message = "Producto no encontrado" });
        //}

        /// <summary>
        /// Permite al usuario Administrador habilitar o deshabilitar un producto
        /// </summary>
        /// <param name="id"></param>
        /// <param name="habilitado"></param>
        /// <returns></returns>
        [HttpPut("HabilitarDeshabilitar/{id}")]
        [Authorize]
        public async Task<IActionResult> HabilitarProducto(int id, [FromQuery] bool habilitado)
        {
            try
            {
                await repoProducto.HabilitarDeshabilitar(id, habilitado);
                
                
                return Ok(new { message = habilitado ? "Producto habilitado con éxito" : "Producto deshabilitado con éxito" });
                
                
            }
            catch(ProductoException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        //[HttpPut("deshabilitar/{id}")]
        //public async Task<IActionResult> DeshabilitarProducto(int id)
        //{
        //    try
        //    {
        //        bool resultado = await repoProducto.Deshabilitar(id);
        //        if (resultado)
        //        {
        //            return Ok(new { message = "Producto deshabilitado con éxito" });
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new { message = ex.Message });
        //    }
        //    return NotFound(new { message = "Producto no encontrado" });
        //}


        /// <summary>
        /// Metodo para el Administrador
        /// Metódo que devuelve los productos por paginacion, devuelve n productos por página.
        /// </summary>
        /// <param name="numeroPagina"></param>
        /// <param name="totalPaginas"></param>
        /// <param name="orden"></param>
        /// <returns></returns>
        [HttpGet("ProductosPorPaginacion")]
        [Authorize]
        public async Task<ActionResult> ProductosPorPaginacion(int numeroPagina, int totalPaginas, string orden = "")
        {
            // Contar el total de registros en la base de datos
            var totalProductos = await repoProducto.ContarTotalProductos();

            var productos = await repoProducto.BuscarTodosLosProductos(numeroPagina, totalPaginas, orden);

            // Crear la respuesta que incluye los datos paginados y la información de la paginación
            var respuesta = new
            {
                Data = productos,
                TotalRecords = totalProductos,
                NumeroPagina = numeroPagina,
                TotalPaginas = totalPaginas
            };
            return Ok(respuesta);
        }

        /// <summary>
        /// Obtener los productos de una categoría
        /// </summary>
        /// <param name="idCategoria">Identificador de la categoría</param>
        /// <returns></returns>
        [HttpGet("PorductosPorCategoria/{idCategoria}")]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProductosByCategoria(int idCategoria)
        {
            try
            {
                var productos = await repoProducto.BuscarProductoPorCategoria(idCategoria);
                return Ok(productos);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        /// <summary>
        /// Devuelve un número entero con el total de productos en el sistema ya sea que esten habilitados o deshabilitados
        /// </summary>
        /// <returns></returns>
        [HttpGet("TotalDeProductos")]
        [Authorize]
        public async Task<IActionResult> TotalDeProductos()
        {
            try
            {
                _logger.LogInformation("Accediendo a TotalDeProductos");
                var total = await repoProducto.ContarTotalProductos();
                return Ok(total);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error. Error: {ex.Message}");
            }
        }

        /// <summary>
        /// Muestra una lista de los productos que se encuentran con stock bajo, en este caso se determina como stock bajo a los productos que cuentan con un stock menor a 6 unidades.
        /// </summary>
        /// <returns></returns>
        [HttpGet("ProductosConStockBajo")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Producto>>> ProductosConStockBajo()
        {
            try
            {
                var productos = await repoProducto.BuscarConBajoStock();
                return Ok(productos);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        /// <summary>
        /// Permine al usuario Administrador modificar datos del producto, en este caso los datos a modificar son: Imagen, Categoría y Descripción.
        /// </summary>
        /// <param name="solicitud"></param>
        /// <returns></returns>
        [HttpPost("EditarProducto")]
        [Authorize]
        public async Task<IActionResult> Modificar([FromBody] DTOSubirProducto solicitud)
        {            

            try
            {
                if (solicitud == null || string.IsNullOrEmpty(solicitud.ImagenBase64))
                {
                    return BadRequest("Datos de imagen inválidos.");
                }

                var producto = await repoProducto.BuscarPorId(solicitud.IdProducto);
                if (producto == null)
                {
                    return NotFound("Producto no encontrado.");
                }
                var nuevaCategoria = await repoCategoria.BuscarPorId(solicitud.IdCategoria);
                if (nuevaCategoria == null)
                {
                    return NotFound("Categoría no encontrada");
                }
                producto.Descripcion = solicitud.Descripcion;
                producto.Imagen = solicitud.ImagenBase64;
                producto.Categoria = nuevaCategoria;
                await repoProducto.Actualizar(producto);

                return Ok("El producto se ha actualizado correctamente.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ocurrió un error al modificar el producto: {ex.Message}");
            }
        }


        // POST: ProductoController/Edit/5
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

        /// <summary>
        /// Permite agregar una nueva categoría al sistema
        /// </summary>
        /// <param name="categoria"></param>
        /// <returns></returns>
        [HttpPost("AltaCategoria")]
        //[Authorize]
        public async Task<ActionResult> AltaCategoria(DTOCategoria categoria)
        {
            try
            {
                Categoria c = new Categoria
                {
                    Nombre = categoria.Nombre,
                    Descripcion = categoria.Descripcion,
                };


                if (!await repoCategoria.Alta(c))
                {
                    return BadRequest("No se ha dado de alta la categoria");
                }
                return Ok("Alta de categoria exitosa");
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        /// <summary>
        /// Permite agregar una categoria a un producto en particular.
        /// </summary>
        /// <param name="idProducto"></param>
        /// <param name="idCategoria"></param>
        /// <returns></returns>
        [HttpPost("AgregarCategoriaProducto/{idProducto}")]
        [Authorize]
        public async Task<IActionResult> AgregarCategoria(int idProducto, int idCategoria)
        {
            try
            {
                Producto prod = await repoProducto.BuscarPorId(idProducto);
                Categoria cat = await repoCategoria.BuscarPorId(idCategoria);
                if (prod.Categoria == null)
                {
                    try
                    {
                        await repoProducto.AgregarCategoria(idProducto, cat);
                        return Ok(new { message = "Categoria agregada exitosamente" });
                    }
                    catch
                    {
                        throw new Exception("Error al agregar la categoria");
                    }
                }
                else
                {
                    try
                    {
                        prod.Categoria = cat;
                        await repoProducto.ActualizarCategoriaEnProducto(prod);
                        return Ok("Categoria actualizada exitosamente");
                    }
                    catch
                    {
                        throw new Exception("Error al actualizar la categoria");
                    }

                }
            }
            catch
            {
                return StatusCode(500, "Error al agregar una categoria a un producto");
            }
        }

        /// <summary>
        /// Permite buscar una categoría por su identificador, en este caso su id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("CategoriaPorId/{id}")]
        //[Authorize]
        public async Task<ActionResult<Categoria>> GetCategoriaById(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return NotFound("Categoria no encontrada");
                }

                return await repoCategoria.BuscarPorId(id);
            }
            catch
            {
                return StatusCode(500, "Ha ocurrido un error");
            }
        }

        [HttpGet("Categorias")]
        public async Task<ActionResult<IEnumerable<Categoria>>> GetCategorias()
        {
            try
            {
                IEnumerable<Categoria> categorias = await repoCategoria.BuscarTodo();
                return Ok(categorias);
            }
            catch
            {
                return BadRequest("No hay categorias en el sistema");
            }
        }

        /// <summary>
        /// Permite eliminar una categoría
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("Categoria/{id}")]
        [Authorize]
        public async Task<ActionResult> EliminarCategoria(int id)
        {
            try
            {
                var hayProductosConCategoria = await repoProducto.BuscarProductoPorCategoria(id);
                if (hayProductosConCategoria.Count > 0)
                {
                    return BadRequest("No es posible eliminar porque existen productos con esa categoria");
                }
                if (!await repoCategoria.Eliminar(id))
                {
                    return BadRequest("No se ha podido eliminar la categoria");
                }

                return Ok("Se ha eliminado la categoria exitosamente");
            }
            catch
            {
                return StatusCode(500, "Ha ocurrido un error");
            }
        }

        /// <summary>
        /// Permite modificar una categoría
        /// </summary>
        /// <param name="id"></param>
        /// <param name="categoria"></param>
        /// <returns></returns>
        [HttpPut("Categoria/{id}")]
        [Authorize]
        public async Task<ActionResult> ModificarCategoria(int id, DTOCategoria categoria)
        {
            try
            {
                if (id == null)
                    return BadRequest("El id no puede ser nulo.");

                if (categoria == null)
                    return BadRequest("Los datos de la categoria no pueden ser nulos.");


                Categoria c = await repoCategoria.BuscarPorId(id);

                if (c == null)
                    return BadRequest("No existe la categoria.");

                if (categoria.Nombre != "")
                {
                
                    c.Nombre = categoria.Nombre;
                }
                if (categoria.Descripcion != "")
                {

                    c.Descripcion = categoria.Descripcion;
                }
                
                await repoCategoria.Modificar(id, c);

                return Ok(c);
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

       [HttpGet("filtrar/{filtro}")]
       public async Task<IActionResult> FiltrarProductos(string filtro)
       {
           var productos = await repoProducto.ObtenerProductosFiltrados(filtro);
           return Ok(productos);
       }
        
    }
}
