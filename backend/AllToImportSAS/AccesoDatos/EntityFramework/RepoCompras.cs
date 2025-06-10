
using Dominio.Entidades;
using Dominio.Excepciones;
using Dominio.Interfaces;
using Microsoft.EntityFrameworkCore;
using Observer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccesoDatos.EntityFramework
{
    public class RepoCompras : IRepoCompra
    {
        AllToImportContext db;
        private readonly IRepoUsuario repoUsuarios;
        private List<IObserver> _listaDeObservadores;
        //private Compra compra;


        public RepoCompras(AllToImportContext db, IRepoUsuario repoUsuarios)
        {
            this.db = db;
            this.repoUsuarios = repoUsuarios;
            _listaDeObservadores = new List<IObserver>();
        }

        //#region Observer
        //public void NotificarTodos(Compra compra)
        //{
        //    foreach (var observador in _listaDeObservadores)
        //    {
        //        observador.Notificar(compra);
        //    }
        //}

        //public void Subscribir(IObserver observer)
        //{
        //    _listaDeObservadores.Add(observer);
        //}

        //public void Desubscribir(IObserver observer)
        //{
        //    _listaDeObservadores.Remove(observer);
        //}
        //#endregion

        public async Task Alta(Compra obj)
        {
            try
            
            {
                double totalCompra = 0;
                foreach (var item in obj.ItemsCompra)
                {
                    totalCompra += item.Producto.Precio * item.Cantidad;
                }

                obj.TotalComprado = totalCompra;

                db.Compras.Add(obj);
                await db.SaveChangesAsync();
                //this.compra = obj;
                //NotificarTodos(obj);
                //return true;
            }
            catch(CompraException ex)
            {
                throw new CompraException($"Error en la compra: {ex.Message}");
            }
            catch (Exception ex)
            {
                throw new Exception($"Error: {ex.Message}");
            }
        }

        //public async Task<Compra> BuscarPorId(int id)
        //{
        //    try
        //    {
        //        return await db.Compras.FindAsync(id);
        //    }
        //    catch (CompraException ex)
        //    {
        //        throw new CompraException(ex.Message);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception(ex.Message);
        //    }
        //}

        //public async Task<Compra> BuscarPorId(int id)
        //{
        //    try
        //    {
        //        var compra = await db.Compras
        //            .Include(c => c.Cliente)
        //            .Include(c => c.ItemsCompra)
        //                .ThenInclude(i => i.Producto)
        //            .Include(c => c.TipoEntrega)
        //            .FirstOrDefaultAsync(c => c.Id == id);

        //        if (compra == null)
        //        {
        //            throw new CompraException("Compra no encontrada.");
        //        }

        //        var mappedCompra = new Compra
        //        {
        //            Id = compra.Id,
        //            FechaCompra = compra.FechaCompra,
        //            Cliente = compra.Cliente != null ? new Cliente
        //            {
        //                Id = compra.Cliente.Id,
        //                Nombre = compra.Cliente.Nombre,
        //                Apellido = compra.Cliente.Apellido,
        //                CorreoElectronico = compra.Cliente.CorreoElectronico,
        //                Telefono = compra.Cliente.Telefono,
        //                DocumentoIdentidad = compra.Cliente.DocumentoIdentidad,                        
        //                RUT = compra.Cliente.RUT,
        //                RazonSocial = compra.Cliente.RazonSocial
        //            } : null,
        //            ItemsCompra = compra.ItemsCompra.Select(item => new ItemCompra
        //            {
        //                Id = item.Id,
        //                Producto = new Producto
        //                {
        //                    Id = item.Producto.Id,
        //                    Codigo = item.Producto.Codigo,
        //                    Nombre = item.Producto.Nombre,
        //                    Precio = item.Producto.Precio
        //                },
        //                Cantidad = item.Cantidad
        //            }).ToList(),
        //            TipoEntrega = compra.TipoEntrega switch
        //            {
        //                EnvioDomicilio envioDomicilio => new EnvioDomicilio
        //                {
        //                    Id = envioDomicilio.Id,                           
        //                    IdDireccion = envioDomicilio.IdDireccion,
        //                    IdCliente = envioDomicilio.IdCliente,
        //                    Comentario = envioDomicilio.Comentario
        //                },
        //                RetiroCompra retiroCompra => new RetiroCompra
        //                {
        //                    Id = retiroCompra.Id,
        //                    TipoDocumento = retiroCompra.TipoDocumento,
        //                    DocumentoCliente = retiroCompra.DocumentoCliente,
        //                    NombreApellido = retiroCompra.NombreApellido,
        //                    Comentario = retiroCompra.Comentario
        //                },
        //                _ => new TipoEntrega
        //                {
        //                    Id = compra.TipoEntrega.Id,
        //                    Comentario = compra.TipoEntrega.Comentario
        //                }
        //            },
        //            TotalComprado = compra.TotalComprado,
        //            Telefono = compra.Telefono,
        //            RazonSocial = compra.RazonSocial,
        //            Rut = compra.Rut,

        //        };

        //        return mappedCompra;
        //    }
        //    catch (CompraException ex)
        //    {
        //        throw new CompraException(ex.Message);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception(ex.Message);
        //    }
        //}
        public async Task<string> GetCorreoElectronico(int id)
        {
            var correo = await db.Clientes
                         .Where(c => c.Id == id)
                         .Select(c => c.CorreoElectronico)
                         .FirstOrDefaultAsync();
            return correo;
        }
        public async Task<object> BuscarPorId(int id)
        {
            var compra = await db.Compras
                .Include(c => c.Cliente)
                .Include(i => i.ItemsCompra)
                    .ThenInclude(i => i.Producto)
                .Include(t => t.TipoEntrega)
                .Where(c => c.Id == id)
                .Select(compra => new
                {
                    compra.Id,
                    compra.FechaCompra,
                    Cliente = compra.Cliente != null ? new
                    {
                        compra.Cliente.Id,
                        compra.Cliente.Nombre,
                        compra.Cliente.Apellido,
                        compra.Cliente.CorreoElectronico,
                        compra.Cliente.Telefono,
                        compra.Cliente.DocumentoIdentidad,
                        compra.Cliente.RUT,
                        compra.Cliente.RazonSocial
                    } : null,
                    ItemsCompra = compra.ItemsCompra.Select(item => new
                    {
                        item.Id,
                        Producto = new
                        {
                            item.Producto.Id,
                            item.Producto.Nombre,
                            item.Producto.Imagen,
                            item.Cantidad,
                            item.Producto.Precio,
                            item.Producto.Codigo
                        }
                    }).ToList(),
                    Entrega = new
                    {
                        compra.TipoEntrega.Id,
                        Tipo = EF.Property<string>(compra.TipoEntrega, "TipoDeEntrega"),
                        EnvioDomicilio = compra.TipoEntrega is EnvioDomicilio ? new
                        {
                            ((EnvioDomicilio)compra.TipoEntrega).IdDireccion,
                            ((EnvioDomicilio)compra.TipoEntrega).IdCliente
                        } : null,
                        RetiroCompra = compra.TipoEntrega is RetiroCompra ? new
                        {
                            ((RetiroCompra)compra.TipoEntrega).TipoDocumento,
                            ((RetiroCompra)compra.TipoEntrega).DocumentoCliente,
                            ((RetiroCompra)compra.TipoEntrega).NombreApellido,
                            ((RetiroCompra)compra.TipoEntrega).DatosNegocioId

                        } : null,
                        compra.TipoEntrega.Comentario,
                    },
                    compra.TotalComprado,
                    compra.Rut,
                    compra.RazonSocial,
                    compra.Telefono,
                    compra.EstadoCompra,
                    compra.EstadoCompraNombre,
                    compra.PaymentId
                })
                .FirstOrDefaultAsync();

            if (compra == null)
            {
                throw new CompraException("Compra no encontrada.");
            }

            return compra;
        }

        public async Task<IEnumerable<object>> BuscarTodo()
        {
            var compras = await db.Compras
            .Include(c => c.Cliente)
            .Include(i => i.ItemsCompra)
                .ThenInclude(i => i.Producto)
            .Include(t => t.TipoEntrega)
            .Select(compra => new
            {
                compra.Id,
                compra.FechaCompra,
                Cliente = compra.Cliente != null ? new
                {
                    compra.Cliente.Id,
                    compra.Cliente.Nombre,
                    compra.Cliente.Apellido,
                    compra.Cliente.CorreoElectronico,
                    //Telefono = compra.Cliente.Telefono ?? "",
                    compra.Cliente.Telefono,
                    compra.Cliente.DocumentoIdentidad,
                    compra.Cliente.RUT,
                    compra.Cliente.RazonSocial
                } : null,
                ItemsCompra = compra.ItemsCompra.Select(item => new
                {
                    item.Id,
                    Producto = new
                    {
                        item.Producto.Id,
                        item.Producto.Nombre,
                        item.Cantidad,
                        item.Producto.Precio
                    }
                }).ToList(),
                Entrega = new
                {
                    compra.TipoEntrega.Id,
                    Tipo = EF.Property<string>(compra.TipoEntrega, "TipoDeEntrega"),
                    EnvioDomicilio = compra.TipoEntrega is EnvioDomicilio ? new
                    {
                        ((EnvioDomicilio)compra.TipoEntrega).IdDireccion,
                        ((EnvioDomicilio)compra.TipoEntrega).IdCliente
                    } : null,
                    RetiroCompra = compra.TipoEntrega is RetiroCompra ? new
                    {
                        ((RetiroCompra)compra.TipoEntrega).TipoDocumento,
                        ((RetiroCompra)compra.TipoEntrega).DocumentoCliente,
                        ((RetiroCompra)compra.TipoEntrega).NombreApellido
                    } : null,
                    compra.TipoEntrega.Comentario,
                },
                compra.TotalComprado,
                compra.Rut,
                compra.RazonSocial,
                compra.Telefono,
            })
                    .ToListAsync();

            return compras;
        }

        #region Para obtener ventas por paginación
        public async Task<int> ContarTotalCompras()
        {
            try
            {
                return await db.Compras.CountAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public IQueryable<object> BuscarTodasLasCompras()
        {
            //return db.Productos.AsQueryable();
            try
            {
                var compras = db.Compras
                    .Include(c => c.Cliente)
                    .Include(i => i.ItemsCompra)
                        .ThenInclude(i => i.Producto)
                    .Include(t => t.TipoEntrega)
                    .Select(compra => new
                    {
                        compra.Id,
                        compra.FechaCompra,
                        Cliente = compra.Cliente != null ? new
                        {
                            compra.Cliente.Id,
                            compra.Cliente.Nombre,
                            compra.Cliente.Apellido,
                            compra.Cliente.CorreoElectronico,
                            //Telefono = compra.Cliente.Telefono ?? "",
                            compra.Cliente.Telefono,
                            compra.Cliente.DocumentoIdentidad,
                            compra.Cliente.RUT,
                            compra.Cliente.RazonSocial
                        } : null,
                        ItemsCompra = compra.ItemsCompra.Select(item => new
                        {
                            item.Id,
                            Producto = new
                            {
                                item.Producto.Id,
                                item.Producto.Nombre,
                                item.Cantidad,
                                item.Producto.Precio
                            }
                        }).ToList(),
                        Entrega = new
                        {
                            compra.TipoEntrega.Id,
                            Tipo = EF.Property<string>(compra.TipoEntrega, "TipoDeEntrega"),
                            EnvioDomicilio = compra.TipoEntrega is EnvioDomicilio ? new
                            {
                                ((EnvioDomicilio)compra.TipoEntrega).IdDireccion,
                                ((EnvioDomicilio)compra.TipoEntrega).IdCliente
                            } : null,
                            RetiroCompra = compra.TipoEntrega is RetiroCompra ? new
                            {
                                ((RetiroCompra)compra.TipoEntrega).TipoDocumento,
                                ((RetiroCompra)compra.TipoEntrega).DocumentoCliente,
                                ((RetiroCompra)compra.TipoEntrega).NombreApellido
                            } : null,
                            compra.TipoEntrega.Comentario,
                        },
                        compra.TotalComprado,
                        compra.Rut,
                        compra.RazonSocial,
                        compra.Telefono,
                        compra.EstadoCompra,
                        compra.EstadoCompraNombre
                    })
                    .AsQueryable();

                return compras;
            }
            catch  (CompraException ex)
            {
                throw new CompraException(ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        #endregion


        public async Task<IEnumerable<object>> BuscarComprasPorCliente(string documentoIdentidad)
        {
            try
            {
                await repoUsuarios.BuscarPorDocumentoIdentidad(documentoIdentidad);
                var compras = await db.Compras
           .Where(c => c.Cliente.DocumentoIdentidad == documentoIdentidad)
           .Include(i => i.ItemsCompra)
           .ThenInclude(i => i.Producto)
           .Include(t => t.TipoEntrega)
           .Select(compra => new
           {
               compra.Id,
               compra.FechaCompra,
               Cliente = compra.Cliente != null ? new
               {
                   compra.Cliente.Id,
                   compra.Cliente.Nombre,
                   compra.Cliente.Apellido,
                   compra.Cliente.CorreoElectronico,
                   compra.Cliente.DocumentoIdentidad,
                   //Telefono = compra.Cliente.Telefono ?? "",
                   compra.Cliente.Telefono,
                   compra.Cliente.RUT,
                   compra.Cliente.RazonSocial
               } : null,
               ItemsCompra = compra.ItemsCompra.Select(item => new
               {
                   item.Id,
                   Producto = new
                   {
                       item.Producto.Id,
                       item.Producto.Nombre,
                       item.Cantidad,
                       item.Producto.Precio
                   }
               }).ToList(),
               Entrega = new
               {
                   compra.TipoEntrega.Id,
                   Tipo = EF.Property<string>(compra.TipoEntrega, "TipoDeEntrega"),
                   EnvioDomicilio = compra.TipoEntrega is EnvioDomicilio ? new
                   {
                       ((EnvioDomicilio)compra.TipoEntrega).IdDireccion,
                       ((EnvioDomicilio)compra.TipoEntrega).IdCliente
                   } : null,
                   RetiroCompra = compra.TipoEntrega is RetiroCompra ? new
                   {
                       ((RetiroCompra)compra.TipoEntrega).TipoDocumento,
                       ((RetiroCompra)compra.TipoEntrega).DocumentoCliente,
                       ((RetiroCompra)compra.TipoEntrega).NombreApellido
                   } : null,
                   compra.TipoEntrega.Comentario,
               },
               compra.TotalComprado,
               compra.EstadoCompraNombre

           })
                   .ToListAsync();

                return compras;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        public async Task<bool> Eliminar(int id)
        {
            try
            {
                Compra compra = (Compra)await BuscarPorId(id);
                if (compra is null)
                {
                    return false;
                }
                db.Remove(compra);
                await db.SaveChangesAsync();
                return true;
            }
            catch
            {
                throw new Exception("No se elimina la compra");
            }
        }

        public async Task<Compra> ActualizarEstado(int id, EstadoCompra nuevoEstado)
        {
            try
            {
                var compra = await db.Compras
                    .Include(c => c.Cliente)
                    .Include(t => t.TipoEntrega)
                    .FirstOrDefaultAsync(c => c.Id == id);
                if (compra == null) throw new CompraException("No existe una compra con ese id.");

                compra.EstadoCompra = nuevoEstado;
                db.Compras.Update(compra);
                await db.SaveChangesAsync();
                return compra;
            }
            catch (CompraException ex)
            {
                throw new CompraException(ex.Message);
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<IEnumerable<object>> BuscarCompraPorEstado(EstadoCompra estado)
        {
            try
            {
                var compras = await db.Compras
               .Where(c => c.EstadoCompra == estado)
               .Include(i => i.ItemsCompra)
               .ThenInclude(i => i.Producto)
               .Include(t => t.TipoEntrega)
               .Select(compra => new
               {
                   compra.Id,
                   compra.FechaCompra,
                   Cliente = compra.Cliente != null ? new
                   {
                       compra.Cliente.Id,
                       compra.Cliente.Nombre,
                       compra.Cliente.Apellido,
                       compra.Cliente.CorreoElectronico,
                       compra.Cliente.Telefono,
                       compra.Cliente.RUT,
                       compra.Cliente.RazonSocial
                   } : null,
                   ItemsCompra = compra.ItemsCompra.Select(item => new
                   {
                       item.Id,
                       Producto = new
                       {
                           item.Producto.Id,
                           item.Producto.Nombre,
                           item.Cantidad,
                           item.Producto.Precio
                       }
                   }).ToList(),
                   Entrega = new
                   {
                       compra.TipoEntrega.Id,
                       Tipo = EF.Property<string>(compra.TipoEntrega, "TipoDeEntrega"),
                       EnvioDomicilio = compra.TipoEntrega is EnvioDomicilio ? new
                       {
                           ((EnvioDomicilio)compra.TipoEntrega).IdDireccion,
                           ((EnvioDomicilio)compra.TipoEntrega).IdCliente
                       } : null,
                       RetiroCompra = compra.TipoEntrega is RetiroCompra ? new
                       {
                           ((RetiroCompra)compra.TipoEntrega).TipoDocumento,
                           ((RetiroCompra)compra.TipoEntrega).DocumentoCliente,
                           ((RetiroCompra)compra.TipoEntrega).NombreApellido
                       } : null,
                       compra.TipoEntrega.Comentario,
                   },
                   compra.TotalComprado,
                   compra.EstadoCompraNombre


               })
                       .ToListAsync();

                return compras;

            }
            catch (CompraException ex)
            {
                throw new CompraException(ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> BuscarPorPaymentId(long paymentId)
        {
            try
            {
                var compra = await db.Compras.FirstOrDefaultAsync(c => c.PaymentId == paymentId);

                if(compra == null)
                {
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error: {ex.Message}");
            }
        }



    }
}
