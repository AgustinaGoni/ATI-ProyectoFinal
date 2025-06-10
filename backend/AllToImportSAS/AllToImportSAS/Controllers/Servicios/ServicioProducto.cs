using AccesoDatos.EntityFramework;
using Dominio.Entidades;
using Dominio.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AllToImportSAS.Controllers.Servicios
{
    public class ServicioProducto
    {
        private readonly AllToImportContext context;
        private readonly ServicioStock servicioStock;
        private readonly ServicioEmail servicioEmail;
        private readonly ServicioLog servicioLog;

        private readonly ILogger<ServicioProducto> _logger;
        private readonly IRepoProducto repoProducto;
        private string imagenPorDefecto = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw0ODQ8ODw4NDQ4NDxANDw0NDw8NDQ4NFhEWGBUVFRUYHSogGBsnGxcXITQhMSktLi4vGB8zOT8sNygtLisBCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAOEA4QMBIgACEQEDEQH/xAAbAAEAAwEBAQEAAAAAAAAAAAAABAUGAwIBB//EAD0QAAIBAgMFAwYOAQUAAAAAAAABAgMRBBIhBRMxUWEiQXEWMlSBkaEGFTRCUlNicpKjscHR8PEjM0Oisv/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD9hAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKTaW2Kkau5oQVSUfOdnPVK7SS5E7a+OVCk5fPl2YL7XP1cSr2TGGGovE1m81XSK4zceOnV8fYBJ2ft6nU7NS1KfC78xvx7vWXBn3PCY6WW0qVZrsyaScreDs/1OKqYvAu0lvaPBcXFLo+MX04AaYEPAbSpV12HaXfCWkl/JMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZenLFYutVyVnTUHpHNKEVG7S83i9ANQDPfE+O9J/MrfwfJbGxjTTxKaejTqVWmvYBz1x2L79xS9jjf9ZP3eBM+EuDnUhTlCLlu814xV3Z21S6W95FpbCxUPNrxhfjlnUjf2I9/FGN9J/Nq/wAAQNiYKrKvCWWUY05KUpNNLTu8TXtJ6NXT0aeqaM/8UY30r82r/B4wG0J4etUpYiq5Qin2nmnaWlrPj3gScfsCLeeg91NaqN2o36PjH+8Djhts1aMt1ioS0+fbtW58pLqveWGC2xSrVd3BT81yUpJJO1tFqS8ThqdWOWcVJdeKfNPuA9UK0KkVKElOL71/dDoZbH4WeBkqlKr2Zu2WXnO3NcJLr1NLh6meEJ2tnjGVuV1ewHQAAAAAAAAAAAAAAAAAAAAAAABGc+DkrVMS0rtK6XPWRo0Z74M/7uI9X/qQFDWxE5z3kpNzbvmvqvDkbHYtedTDwlPWWqv9K0mrnHE7Ewrk6kk4LWUkpZYdX0J2GlTdOLpuO7t2cukVFAdWQsLtWjVqSpxeq81vRVOeUpNubY3l6VJ/6fCUl/ydF9n9Smi2mmm007prRpgfoRits/Kq33v2RfbE2uqyVOo0qqWj4Koua69Ch218qrfe/ZAeNlVt3iKUu7Ok/uvR/qbdtLV6Jatvgkfn0YuTUUm3JpJLi2+Bpdv42UacMOtatVRz5ddOFl4v3eIEamnjsW5O+4pd3ON9F4t+40xD2VglQpKHzn2pvnN/xwJgAAAAAAAAAAAAAAAAAAAAAAAABGd+DTSq4hvRKzb6ZpGiRmtgWz4qLajmWVXdu+QEbbW1nXeSF1ST8HN8306f1QIYmpGEqam1Cesorgy08nn6RSHk+/SKQFKC78nn6RSPnk+/SKQELY3ymj9/9mScZhJVsbWhFpSd2s2idkiXgdjbqrCo69JqDvZcWRMTRnVxtVUpJTu5RkpW4JcGgO+ycE8PvMRXi47m6hF8XLmvbZePQ67Cw8q1WeKqa6vJyzdOiWn+CPVhjsTko1ISioyvKbjlXi3wdteBpcPRjThGEVaMFZAdAAAAAAAAAAAAAAAAAAAAAAAAAV+0q0ot5ZNWw2Inp9KOSz9V2RnjKjWGjmeZVFGs+9qNRQ18W7+oC5KfF/B+lUm5qUoZndpWcb97XI9LHyVTEPMpRUKjpwunllSSUva2/YfKlR06dS1ecprDTm1PM3vFFPPF2slrwXQDh5MU/rZ/hiPJin9bP8MTviK04wpum67e9V41syc4qnKTir87EvCV88a0lLMs7yP7G7i1b2gVvkxT+tn+GI8mKf1s/wAMT3h8dU3dNyk3OFOpOX21ulODft9qZMw2aFSnF1JzVWjKcs7vacXDVck8z04aAQPJin9bP8MSds3ZNPDtyTlKTVs0raLkkjliak08TUVSa3EouMLrI47qEmmut37T1VnUbqa1XThiHGe6vvFT3UWkra2zPu1AswU9Ss700q1aadKo4yoxblKSmlHMknwWjv3n2pOs4VZynKFTD0oPLF2hvN3nlmXzrvQC3BS18ZUUsQszUW0qT+hJQg5L1qV/UzpXryz2cq2Xf1Y2o3c8qpppK3UC2BXbPrznKnmk3eg5Ph528tr1to+txhZuVapd1241ZxVs25UUuDfACxAAAAAAAAAAAAAAAAAAEbFYRVL3bV6VSjpynlu/+pz+LoZ5TvK8p0p91k4dy8e8mgCGtnwUYR+hmvKyvUUoyUlLxzXOfxbdNSqzmtzPDx0issJW16vRalgAIyw0m4OVRz3c1OPZjH5so20+97hhcJGlGcYt2nOU7fRzJaLpoSQBCWzYXpu7e7pOh3duGW2vv9p7w2EcJKUqkqjjDdwukssLq/Di9Fr0JQAh1MBmlNupLJVlGU6aUbScYxVr2vbso+ywerlGcozdR1U7KS1gotNd6siWAIuHwahJSzSk1GcW3btOc1OTfrPOJwOdy7coxqxUakUk86XJ92mhMAELEbOhUjOLbW8qRq3Vrxkoxjp6l72ep4LtZo1JQlvJ1LpRlrKKTWvgSwBCjgMri4VJRcYuDbjGbleWZt3XG7OlLDShOTVR5ZSc3DLG12ufEkgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/2Q==";


        public ServicioProducto(AllToImportContext context, ILogger<ServicioProducto> logger, ServicioStock servicioStock, ServicioEmail servicioEmail, IRepoProducto repoProducto, ServicioLog servicioLog)
        {
            this.context = context;
            _logger = logger;
            this.servicioEmail = servicioEmail;
            this.servicioStock = servicioStock;
            this.repoProducto = repoProducto;
            this.servicioLog = servicioLog;
        }



        public async Task ActualizarProductosAsync(List<Producto> productosDelWebService)
        {
            //await servicioLog.GuardarLogAsync("Llego a metodo ActualizarProductosAsync", "InfoServicio");
            var productosConBajoStock = new List<Producto>();
            foreach (var productoWS in productosDelWebService)
            {
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
                var productoExistente = await repoProducto.BuscarPorCodigo(productoWS.Codigo);
                if (productoExistente != null)
                {


                    // Actualizar solo los campos relevantes
                    productoExistente.Stock = productoWS.Stock;
                    productoExistente.Precio = productoWS.Precio;
                    productoExistente.Nombre = productoWS.Nombre;
                    //productoExistente.Descripcion = productoExistente.Descripcion;

                    context.Productos.Update(productoExistente);
                    if (productoExistente.Stock < 10)
                    {
                        productosConBajoStock.Add(productoExistente);
                        //await servicioEmail.SendLowStockEmail(productoExistente.Nombre, productoExistente.Stock);
                    }

                }
                else
                {

                    // Crear un nuevo producto
                    context.Productos.Add(new Producto
                    {
                        Codigo = productoWS.Codigo,
                        Nombre = productoWS.Nombre,
                        Descripcion = productoWS.Descripcion,
                        Precio = productoWS.Precio,
                        Stock = productoWS.Stock,
                        Imagen = imagenPorDefecto,
                        Categoria = categoriaPorDefecto,
                        Habilitado = false
                    });


                }


            }
            await context.SaveChangesAsync();
            await ActualizarStockLocalAsync(productosDelWebService);
            if (productosConBajoStock.Any())
            {
                await servicioEmail.EnviarCorreoBajoStock(productosConBajoStock);
            }
        }

        public async Task ActualizarStockLocalAsync(List<Producto> productosDelWebService)
        {
            try
            {
                await servicioLog.GuardarLogAsync("Llego a metodo ObtenerStockEspecificoAsync", "InfoServicio");
                var codigosProductosWS = productosDelWebService.Select(p => p.Codigo).ToList();

                var productosLocales = await context.Productos
                    .Where(p => codigosProductosWS.Contains(p.Codigo))
                    .ToListAsync();

                var comprasPreparando = await context.Compras
                    .Where(c => c.EstadoCompra == EstadoCompra.Confirmada)
                    .SelectMany(c => c.ItemsCompra)
                    .Where(ic => codigosProductosWS.Contains(ic.Producto.Codigo))
                    .GroupBy(ic => ic.Producto.Codigo)
                    .Select(g => new { CodigoProducto = g.Key, CantidadTotal = g.Sum(ic => ic.Cantidad) })
                    .ToListAsync();

                var comprasPreparandoDic = comprasPreparando.ToDictionary(cp => cp.CodigoProducto, cp => cp.CantidadTotal);

                foreach (var productoLocal in productosLocales)
                {
                    var productoWS = productosDelWebService.FirstOrDefault(p => p.Codigo == productoLocal.Codigo);
                    if (productoWS != null)
                    {
                        var cantidadPreparando = comprasPreparandoDic.ContainsKey(productoLocal.Codigo)
                            ? comprasPreparandoDic[productoLocal.Codigo]
                            : 0;

                        productoLocal.Stock = productoWS.Stock - cantidadPreparando;
                        if (productoLocal.Stock < 5)
                        {
                            productoLocal.Habilitado = false;
                        }
                        context.Productos.Update(productoLocal);
                    }
                }

                await context.SaveChangesAsync();

                await servicioLog.GuardarLogAsync("Finalizo correctamente el metodo ActualizarStockLocalAsync", "InfoServicio");
            }
            catch(Exception ex)
            {
                await servicioLog.GuardarLogAsync($"Catch metodo ActualizarStockLocalAsync. Error: {ex.Message}", "InfoServicio");
                throw new Exception("Error deserializing response", ex);
            }
        }
    }
    
}
