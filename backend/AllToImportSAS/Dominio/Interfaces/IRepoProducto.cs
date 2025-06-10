using Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace Dominio.Interfaces
{
    public interface IRepoProducto
    {
        Task<bool> Alta(Producto obj);
        Task<bool> Modificar(Producto obj);
        Task<bool> Eliminar(int id);
        Task<IEnumerable<Producto>> BuscarTodo();
        Task<IEnumerable<Producto>> BuscarTodoHabilitados();
        Task<IEnumerable<Producto>> BuscarProductosMenoresQueMil();
        Task<List<Producto>> BuscarProductoPorCategoria(int id);
        Task<Producto> BuscarPorId(int id);
        Task Actualizar(Producto producto);

        Task<bool> AgregarCategoria(int productoId, Categoria categoria);
        Task ActualizarCategoriaEnProducto(Producto producto);

        Task<IEnumerable<Producto>> ObtenerProductosFiltrados(string nombre);

        Task<Producto> BuscarPorCodigo(int cod);

        Task HabilitarDeshabilitar(int id, bool habilitado);
        //Task<bool> Habilitar(int productoId);
        //Task<bool> Deshabilitar(int productoId);
        Task<IEnumerable<Producto>> BuscarConBajoStock();


        #region Para la paginación
        Task<int> ContarTotalProductos();
        Task<List<Producto>> BuscarTodosLosProductos(int numeroPagina, int totalPaginas, string orden);
        #endregion

    }
}
