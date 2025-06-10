using Dominio.Entidades;
using Observer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Dominio.Interfaces
{
    public interface IRepoCompra
    {
        //Task<bool> Alta(Compra obj);
        Task Alta(Compra obj);
        Task<bool> Eliminar(int id);
        Task<IEnumerable<object>> BuscarTodo();
        Task<object> BuscarPorId(int id);
        Task<IEnumerable<object>> BuscarComprasPorCliente(string documentoIdentidad);
        Task<Compra> ActualizarEstado(int id, EstadoCompra nuevoEstado);
        Task<IEnumerable<object>> BuscarCompraPorEstado(EstadoCompra estado);
        Task<string> GetCorreoElectronico(int id);
        //Task<Compra> BuscarPorPaymentId(long paymentId);
        Task<bool> BuscarPorPaymentId(long paymentId);

        #region Paginación
        Task<int> ContarTotalCompras();
        IQueryable<object> BuscarTodasLasCompras();
        #endregion
    }
}
