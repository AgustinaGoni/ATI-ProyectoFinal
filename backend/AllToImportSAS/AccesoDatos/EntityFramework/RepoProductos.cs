using Dominio.Entidades;
using Dominio.Excepciones;
using Dominio.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace AccesoDatos.EntityFramework
{
    public class RepoProductos : IRepoProducto
    {
        AllToImportContext db;

        public RepoProductos(AllToImportContext db)
        {
            this.db = db;
        }

        public async Task Actualizar(Producto producto)
        {
            try { 
            db.Productos.Update(producto);
            await db.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                throw new DbUpdateException(ex.InnerException.Message);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<Producto> BuscarPorId(int id)
        {
            try
            {
                var producto = await db.Productos.Include(p => p.Categoria).FirstOrDefaultAsync(p => p.Id == id);

                if (producto == null) throw new ProductoException("No existe el producto.");

                return producto;
            }
            catch (ProductoException ex)
            {
                throw new ProductoException(ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error: {ex.Message}");
            }
        }
        public async Task<Producto> BuscarPorCodigo(int cod)
        {
            return await db.Productos
                .Include(p => p.Categoria)
                .FirstOrDefaultAsync(p => p.Codigo == cod);
        }

        //public async Task<Producto> BuscarPorCodigo(int cod)
        //{
        //    try
        //    {
        //        return await db.Productos.Include(p => p.Categoria).FirstOrDefaultAsync(p => p.Codigo == cod);
        //    }
        //    catch
        //    {
        //        throw new Exception("No se encuentra el producto");
        //    }
        //}
        public async Task<IEnumerable<Producto>> BuscarTodo()
        {
            try
            {
                return await db.Productos.Include(p=>p.Categoria).ToListAsync();
            }
            catch
            {
                throw new Exception("Error al cargar los productos");
            }
        }

        public async Task<IEnumerable<Producto>> BuscarTodoHabilitados()
        {
            try
            {
                return await db.Productos.Include(p => p.Categoria).Where(p => p.Habilitado).ToListAsync();
            }
            catch
            {
                throw new Exception("Error al cargar los productos habilitados");
            }
        }

        public async Task<IEnumerable<Producto>> BuscarProductosMenoresQueMil()
        {
            try
            {
                return await db.Productos
                    .Include(p => p.Categoria)
                    .Where(p => p.Precio < 1000 && p.Habilitado == true)
                    .ToListAsync();
            }
            catch(ProductoException ex)
            {
                throw new Exception("Error al cargar los productos menores que mil");
            }
            catch (Exception ex)
            {
                throw new DbUpdateException($"Error: ${ex.Message}");
            }

        }

        public async Task<List<Producto>> BuscarProductoPorCategoria(int id)
        {
            try
            {
                var productos =  db.Productos
                                .Include(p => p.Categoria)
                                .Where(p => p.Categoria.Id == id)
                                .ToList();



                return productos;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<bool> AgregarCategoria(int productoId, Categoria categoria)
        {
            bool exito = false;
            try
            {
                var producto = await db.Productos.Include(c => c.Categoria).FirstOrDefaultAsync(c => c.Id == productoId);
                if (producto != null)
                {
                    producto.Categoria = categoria;
                    await db.SaveChangesAsync();
                    exito = true;
                }
            }
            catch
            {
                throw new Exception("Ha ocurrido un error al agregar la categoria");
            }

            return exito;
        }
        public async Task ActualizarCategoriaEnProducto(Producto producto)
        {
            try
            {
                db.Productos.Update(producto);
                await db.SaveChangesAsync();
            }
            catch
            {
                throw new Exception("Ha ocurrido un error al quitar la categoria del producto");
            }
        }

        public async Task HabilitarDeshabilitar(int id, bool habilitado)
        {
            try
            {
                var producto = await BuscarPorId(id);

                if (producto.Stock < 1 ) throw new ProductoException("No se puede habilitar el producto, el stock es menor a 1.");
                if (producto.Precio < 1) throw new ProductoException("No se puede habilitar el producto, el precio es menor a $1.");

                producto.Habilitado = habilitado;
                db.Productos.Update(producto);
                await db.SaveChangesAsync();
               
            }
            catch(ProductoException ex)
            {
                throw new ProductoException(ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception($"No fue posible actualizar el estado del producto: {ex.Message}", ex);
            }
        }


        //public async Task<bool> Habilitar(int id)
        //{
        //    try
        //    {
        //        var producto = await BuscarPorId(id);
        //        if (producto != null)
        //        {
        //            producto.Habilitado = true;
        //            db.Productos.Update(producto);
        //            await db.SaveChangesAsync();
        //            return true;
        //        }
        //        return false;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception($"No fue posible habilitar el producto: {ex.Message}", ex);
        //    }

        //}
        //public async Task<bool> Deshabilitar(int id)
        //{

        //    try
        //    {
        //        var producto = await BuscarPorId(id);
        //        if (producto != null)
        //        {
        //            producto.Habilitado = false;
        //            db.Productos.Update(producto);
        //            await db.SaveChangesAsync();
        //            return true;
        //        }
        //        return false;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception($"No fue posible deshabilitar el producto{ex.Message}", ex);
        //    }

        //}


        #region Crud Vacio
        public async Task<bool> Alta(Producto obj)
        {
            bool exito = false;
            try
            {
                await db.Productos.AddAsync(obj);
                await db.SaveChangesAsync();
                exito = true;
            }
            catch (Exception ex)
            {
                throw new Exception("Ha ocurrido un error al dar de alta el producto");
            }
            return exito;
        }

        public async Task<bool> Eliminar(int id)
        {
            bool exito = false;
            try
            {
                var producto = await db.Productos.FindAsync(id);
                if (producto == null)
                {
                    return false;
                }
                db.Productos.Remove(producto);
                await db.SaveChangesAsync();
                exito = true;
            }
            catch (Exception ex)
            {
                throw new Exception("Ha ocurrido un error al eliminar el producto");
            }
            return exito;
        }

        public async Task<bool> Modificar(Producto obj)
        {
            bool exito = false;
            try
            {
                var productoExistente = await db.Productos.FindAsync(obj.Id);
                if (productoExistente != null)
                {


                    productoExistente.Codigo = obj.Codigo;
                    productoExistente.Nombre = obj.Nombre;
                    productoExistente.Descripcion = obj.Descripcion;
                    productoExistente.Precio = obj.Precio;
                    productoExistente.Stock = obj.Stock;
                    productoExistente.Imagen = obj.Imagen;
                    productoExistente.Categoria = obj.Categoria;
                    productoExistente.Habilitado = obj.Habilitado; 

                    db.Productos.Update(productoExistente);
                    await db.SaveChangesAsync();
                    exito = true;
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Ha ocurrido un error al modificar el producto");
            }
            return exito;
        }

        public Task<IEnumerable<Producto>> ObtenerProductosFiltrados(string nombre)
        {
            throw new NotImplementedException();
        }
        #endregion

        #region Para la paginación
        public async  Task<int> ContarTotalProductos()
        {
            return await db.Productos.CountAsync();
        }

        public async Task<List<Producto>> BuscarTodosLosProductos(int numeroPagina, int totalPaginas, string orden)
        {
            IQueryable<Producto> query = db.Productos;

            // Aplicar el ordenamiento solo si se proporciona un valor para el parámetro de ordenamiento
            //if (!string.IsNullOrEmpty(orden))
            //{
                switch (orden)
                {
                    case "nombre":
                        query = query.OrderBy(p => p.Nombre);
                        break;
                    case "precio_asc":
                        query = query.OrderBy(p => p.Precio);
                        break;
                    case "precio_desc":
                        query = query.OrderByDescending(p => p.Precio);
                        break;
                    case "stock_asc":
                        query = query.OrderBy(p => p.Stock);
                        break;
                    case "stock_desc":
                        query = query.OrderByDescending(p => p.Stock);
                        break;
                    //case "habilitado_asc":
                    //    query = query.OrderBy(p => p.Habilitado);
                    //    break;
                    //case "habilitado_desc":
                    //    query = query.OrderByDescending(p => p.Habilitado);
                    //    break;
                    default:
                        query = query.OrderByDescending(p => p.Habilitado);
                        break;
                }
            //}
            // Aplicar la paginación
            return await query
                .Skip((numeroPagina - 1) * totalPaginas)
                .Take(totalPaginas)
                .Include(p => p.Categoria)
                .ToListAsync();
        }
        #endregion


        public async Task<IEnumerable<Producto>> BuscarConBajoStock()
        {
            try
            {
                var productos = await db.Productos.Where(p => p.Stock < 6)
                                .Include(p => p.Categoria)
                                .ToListAsync();

                return productos;
            }
            catch (Exception ex)
            {
                throw new Exception($"Ha ocurrido un error obteniendo los productos con stock bajo. Error: {ex.Message}");
            }
        }

    }
}
