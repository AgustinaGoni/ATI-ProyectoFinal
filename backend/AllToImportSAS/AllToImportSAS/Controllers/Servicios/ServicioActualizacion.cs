using AccesoDatos.EntityFramework;
using Dominio.Entidades;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace AllToImportSAS.Controllers.Servicios
{
    public class ServicioActualizacion 
    {
        private readonly ILogger<ServicioActualizacion> _logger;
        private readonly ServicioGitHub _servicioGitHub;
        private readonly IServiceScopeFactory _scopeFactory;
        private Timer _temporizador;
        private string imagenPorDefecto = "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";
        //private readonly ServicioLog servicioLog;

        public ServicioActualizacion(ILogger<ServicioActualizacion> logger, ServicioGitHub servicioGitHub, IServiceScopeFactory scopeFactory)
        {
            _logger = logger;
            _servicioGitHub = servicioGitHub;
            _scopeFactory = scopeFactory;
           // this.servicioLog = servicioLog;
        }

        //public Task StartAsync(CancellationToken cancellationToken)
        //{
        //    _logger.LogInformation("El servicio de actualización de stock está iniciando.");
        //    _temporizador = new Timer(RealizarTrabajo, null, TimeSpan.Zero, TimeSpan.FromMinutes(30));
        //    return Task.CompletedTask;
        //}


        //public async Task<List<Producto>> RealizarTrabajoProductos()
        //{
        //    //await servicioLog.GuardarLogAsync("RealizarTrabajoProductos ", "InfoServicio");
        //    var productosActualizados = new List<Producto>();

        //    try
        //    {
        //        var contenido = await _servicioGitHub.DescargarArchivoAsync("productos.json.txt");

        //        //await servicioLog.GuardarLogAsync("Contenido del JSON: {contenido}", contenido);

        //        if (!string.IsNullOrEmpty(contenido))
        //        {
        //            var stockResponse = JsonSerializer.Deserialize<StockResponse>(contenido);

        //            if (stockResponse?.Stock != null)
        //            {
        //                using var scope = _scopeFactory.CreateScope();
        //                var context = scope.ServiceProvider.GetRequiredService<AllToImportContext>();

        //                var imagenesExistentes = context.Productos
        //                    .Where(p => !string.IsNullOrEmpty(p.Imagen))
        //                    .ToDictionary(p => p.Codigo, p => p.Imagen);

        //                var categoriaPorDefecto = await context.Categorias.FirstOrDefaultAsync(c => c.Nombre == "Sin Categoría");
        //                if (categoriaPorDefecto == null)
        //                {
        //                    categoriaPorDefecto = new Categoria
        //                    {
        //                        Nombre = "Sin Categoría",
        //                        Descripcion = "Sin descripción"
        //                    };
        //                    context.Categorias.Add(categoriaPorDefecto);
        //                    await context.SaveChangesAsync();
        //                    //await servicioLog.GuardarLogAsync("Categoría por defecto creada con Id: {Id}", categoriaPorDefecto.Id);
        //                }

        //                foreach (var item in stockResponse.Stock)
        //                {
        //                    var existingProduct = await context.Productos.Include(p => p.Categoria).FirstOrDefaultAsync(p => p.Codigo == item.Codigo);
        //                    if (existingProduct != null)
        //                    {
        //                        //await servicioLog.GuardarLogAsync("Producto existente encontrado. Actualizando producto con CODIGO: {CODIGO}", ""+item.Codigo);

        //                        existingProduct.Nombre = item.Descripcion;
        //                        existingProduct.Descripcion = "";
        //                        existingProduct.Precio = item.Precio;
        //                        existingProduct.Stock = item.Stock;

        //                        if (string.IsNullOrEmpty(existingProduct.Imagen) && imagenesExistentes.TryGetValue(existingProduct.Codigo, out string? value))
        //                        {
        //                            existingProduct.Imagen = value;
        //                        }
        //                        else
        //                        {
        //                            existingProduct.Imagen = existingProduct.Imagen ?? imagenPorDefecto;
        //                        }

        //                        if (existingProduct.Categoria == null || existingProduct.Categoria.Id <= 0)
        //                        {
        //                            existingProduct.Categoria = categoriaPorDefecto;
        //                        }

        //                        productosActualizados.Add(existingProduct);
        //                    }
        //                    else
        //                    {
        //                        //await servicioLog.GuardarLogAsync("Producto no encontrado. Agregando nuevo producto con CODIGO: {Codigo}", "" + item.Codigo);
        //                        var nuevoProducto = new Producto
        //                        {
        //                            Codigo = item.Codigo,
        //                            Nombre = item.Descripcion,
        //                            Descripcion = "",
        //                            Precio = item.Precio,
        //                            Stock = item.Stock,
        //                            Imagen = imagenPorDefecto,
        //                            Categoria = categoriaPorDefecto,
        //                            Habilitado = false
        //                        };
        //                        productosActualizados.Add(nuevoProducto);
        //                        context.Productos.Add(nuevoProducto);
        //                    }
        //                }

        //                await context.SaveChangesAsync();
        //                //await servicioLog.GuardarLogAsync("Productos actualizados: {count}",""+ stockResponse.Stock.Count);
        //            }
        //            else
        //            {
        //                _logger.LogWarning("stockResponse.Stock es nulo.");
        //            }
        //        }
        //        else
        //        {
        //            _logger.LogWarning("El contenido del JSON está vacío o es nulo.");
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "Ocurrió un error al descargar o procesar el archivo.");
        //    }

        //    _logger.LogInformation("Verificación de stock completada a las: {time}", DateTimeOffset.Now);
        //    return productosActualizados;
        //}

        public async Task<List<Producto>> RealizarTrabajoProductos()
        {
            var productosDesdeGitHub = new List<Producto>();

            try
            {
                var contenido = await _servicioGitHub.DescargarArchivoAsync("productos.json.txt");

                if (!string.IsNullOrEmpty(contenido))
                {
                    var stockResponse = JsonSerializer.Deserialize<StockResponse>(contenido);

                    if (stockResponse?.Stock != null)
                    {
                        // Mapear los items del stock a la lista de productos
                        productosDesdeGitHub = stockResponse.Stock.Select(item => new Producto
                        {
                            Codigo = item.Codigo,
                            Nombre = item.Descripcion,
                            Descripcion = "",
                            Precio = item.Precio,
                            Stock = item.Stock,
                            Imagen = imagenPorDefecto,
                            Categoria = null // Se asignará más tarde si es necesario
                        }).ToList();

                        // Ordenar la lista de productos por código
                        productosDesdeGitHub = productosDesdeGitHub.OrderBy(p => p.Codigo).ToList();
                    }
                    else
                    {
                        _logger.LogWarning("stockResponse.Stock es nulo.");
                    }
                }
                else
                {
                    _logger.LogWarning("El contenido del JSON está vacío o es nulo.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ocurrió un error al descargar o procesar el archivo.");
            }

            _logger.LogInformation("Productos obtenidos desde GitHub y ordenados por código a las: {time}", DateTimeOffset.Now);
            return productosDesdeGitHub;
        }


        private async void RealizarTrabajo(object estado)
        {
            _logger.LogInformation("Verificando actualizaciones de stock...");

            try
            {
                var contenido = await _servicioGitHub.DescargarArchivoAsync("productos.json.txt");

                _logger.LogInformation("Contenido del JSON: {contenido}", contenido);

                if (!string.IsNullOrEmpty(contenido))
                {
                    var stockResponse = JsonSerializer.Deserialize<StockResponse>(contenido);

                    if (stockResponse?.Stock != null)
                    {
                        using var scope = _scopeFactory.CreateScope();
                        var context = scope.ServiceProvider.GetRequiredService<AllToImportContext>();

                        var imagenesExistentes = context.Productos
                            .Where(p => !string.IsNullOrEmpty(p.Imagen))
                            .ToDictionary(p => p.Codigo, p => p.Imagen);

                        var categoriaPorDefecto = await context.Categorias.FirstOrDefaultAsync(c => c.Nombre == "Sin Categoría");
                        if (categoriaPorDefecto == null)
                        {
                            categoriaPorDefecto = new Categoria
                            {
                                Nombre = "Sin Categoría",
                                Descripcion = "Sin descripción"
                            };
                            context.Categorias.Add(categoriaPorDefecto);
                            await context.SaveChangesAsync();
                            _logger.LogInformation("Categoría por defecto creada con Id: {Id}", categoriaPorDefecto.Id);
                        }

                        foreach (var item in stockResponse.Stock)
                        {
                            var existingProduct = await context.Productos.Include(p => p.Categoria).FirstOrDefaultAsync(p => p.Codigo == item.Codigo);
                            if (existingProduct != null)
                            {
                                _logger.LogInformation("Producto existente encontrado. Actualizando producto con CODIGO: {CODIGO}", item.Codigo);

                                existingProduct.Nombre = item.Descripcion;  
                                existingProduct.Descripcion = "";  
                                existingProduct.Precio = item.Precio;
                                existingProduct.Stock = item.Stock;

                                if (string.IsNullOrEmpty(existingProduct.Imagen) && imagenesExistentes.TryGetValue(existingProduct.Codigo, out string? value))
                                {
                                    existingProduct.Imagen = value;
                                }
                                else
                                {
                                    existingProduct.Imagen = existingProduct.Imagen ?? imagenPorDefecto;
                                }

                                if (existingProduct.Categoria == null || existingProduct.Categoria.Id <= 0)
                                {
                                    existingProduct.Categoria = categoriaPorDefecto;
                                }

                                context.Productos.Update(existingProduct);
                            }
                            else
                            {
                                _logger.LogInformation("Producto no encontrado. Agregando nuevo producto con CODIGO: {Codigo}", item.Codigo);
                                context.Productos.Add(new Producto
                                {
                                    Codigo = item.Codigo,
                                    Nombre = item.Descripcion,  
                                    Descripcion = "",  
                                    Precio = item.Precio,
                                    Stock = item.Stock,
                                    Imagen = imagenPorDefecto,
                                    Categoria = categoriaPorDefecto,
                                    Habilitado = false
                                });
                            }
                        }
                        await context.SaveChangesAsync();
                        _logger.LogInformation("Productos actualizados: {count}", stockResponse.Stock.Count);
                    }
                    else
                    {
                        _logger.LogWarning("stockResponse.Stock es nulo.");
                    }
                }
                else
                {
                    _logger.LogWarning("El contenido del JSON está vacío o es nulo.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ocurrió un error al descargar o procesar el archivo.");
            }

            _logger.LogInformation("Verificación de stock completada a las: {time}", DateTimeOffset.Now);
        }


        private async void RealizarTrabajoAntes(object estado)
        {
            _logger.LogInformation("Verificando actualizaciones de stock...");

            try
            {
                var contenido = await _servicioGitHub.DescargarArchivoAsync("productos.json.txt");

                // Log para ver el contenido del JSON
                _logger.LogInformation("Contenido del JSON: {contenido}", contenido);

                if (!string.IsNullOrEmpty(contenido))
                {
                    var productosResponse = JsonSerializer.Deserialize<ProductosResponse>(contenido);

                    //if (productosResponse != null)
                    //{
                    if (productosResponse?.productos != null)
                    {

                        using var scope = _scopeFactory.CreateScope();

                        var context = scope.ServiceProvider.GetRequiredService<AllToImportContext>();


                        var imagenesExistentes = context.Productos
                        .Where(p => !string.IsNullOrEmpty(p.Imagen))
                        .ToDictionary(p => p.Codigo, p => p.Imagen);

                        //var categoriaExistentes = context.Productos
                        //.Where(p => p.Categoria != null && p.Categoria.Id > 0)
                        //.ToDictionary(p => p.Codigo, p => p.Categoria.Id);


                        // Busco la categoria Sin Nombre que es una por defecto, si no existe se crea.
                        var categoriaPorDefecto = await context.Categorias.FirstOrDefaultAsync(c => c.Nombre == "Sin Categoría");
                        if (categoriaPorDefecto == null)
                        {
                            categoriaPorDefecto = new Categoria
                            {
                                Nombre = "Sin Categoría",
                                Descripcion = "Sin descripción"
                            };
                            context.Categorias.Add(categoriaPorDefecto);
                            await context.SaveChangesAsync();
                            _logger.LogInformation("Categoría por defecto creada con Id: {Id}", categoriaPorDefecto.Id);
                        }

                        foreach (var producto in productosResponse.productos)
                        {
                            var existingProduct = await context.Productos.Include(p => p.Categoria).FirstOrDefaultAsync(p => p.Codigo == producto.Codigo);
                            if (existingProduct != null)
                            {
                                _logger.LogInformation("Producto existente encontrado. Actualizando producto con CODIGO: {CODIGO}", producto.Codigo);
                                //existingProduct.Codigo = producto.Codigo;
                                existingProduct.Nombre = producto.Nombre;
                                existingProduct.Descripcion = producto.Descripcion;
                                existingProduct.Precio = producto.Precio;
                                existingProduct.Stock = producto.Stock;


                                if (string.IsNullOrEmpty(producto.Imagen) && imagenesExistentes.TryGetValue(existingProduct.Codigo, out string? value))
                                {
                                    existingProduct.Imagen = value;
                                }
                                else
                                {
                                    //existingProduct.Imagen = producto.Imagen ?? string.Empty;
                                    existingProduct.Imagen = producto.Imagen ?? imagenPorDefecto;

                                }

                                // Asignar categoría por defecto si el producto no tiene una categoría válida
                                if (existingProduct.Categoria == null || existingProduct.Categoria.Id <= 0)
                                {
                                    existingProduct.Categoria = categoriaPorDefecto;
                                }
                                //else
                                //{
                                //    existingProduct.Categoria = await context.Categorias.FindAsync(producto.Categoria.Id);
                                //}


                                //existingProduct.Imagen = producto.Imagen ?? string.Empty;
                                // No actualizar la imagen en este momento, se actualizará por separado
                                context.Productos.Update(existingProduct);
                            }
                            else
                            {
                                _logger.LogInformation("Producto no encontrado. Agregando nuevo producto con Id: {Id}", producto.Id);
                                context.Productos.Add(new Producto
                                {
                                    Codigo = producto.Codigo,
                                    Nombre = producto.Nombre,
                                    Descripcion = producto.Descripcion,
                                    Precio = producto.Precio,
                                    Stock = producto.Stock,
                                    //Imagen = producto.Imagen ?? string.Empty
                                    Imagen = producto.Imagen ?? imagenPorDefecto,
                                    Categoria = producto.Categoria ?? categoriaPorDefecto


                                });
                            }
                        }
                        await context.SaveChangesAsync();
                        _logger.LogInformation("Productos actualizados: {count}", productosResponse.productos.Count);
                    }
                    else
                    {
                        _logger.LogWarning("productosResponse.productos es nulo.");
                    }
                    //}

                }
                else
                {
                    _logger.LogWarning("El contenido del JSON está vacío o es nulo.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ocurrió un error al descargar o procesar el archivo.");
            }

            _logger.LogInformation("Verificación de stock completada a las: {time}", DateTimeOffset.Now);
        }


        //public Task StopAsync(CancellationToken cancellationToken)
        //{
        //    _logger.LogInformation("El servicio de actualización de stock está deteniéndose.");
        //    _temporizador?.Change(Timeout.Infinite, 0);
        //    return Task.CompletedTask;
        //}

        //public void Dispose()
        //{
        //    _temporizador?.Dispose();
        //}

        public class StockResponse
        {
            [JsonPropertyName("stock")]
            public List<StockItem> Stock { get; set; }
        }

        public class StockItem
        {
            [JsonPropertyName("codigo")]
            public int Codigo { get; set; }

            [JsonPropertyName("descripcion")]
            public string Descripcion { get; set; }

            [JsonPropertyName("stock")]
            public int Stock { get; set; }

            [JsonPropertyName("precio")]
            public double Precio { get; set; }
        }
    }
}
