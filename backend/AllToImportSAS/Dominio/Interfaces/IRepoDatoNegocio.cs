using Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dominio.Interfaces
{
    public interface IRepoDatoNegocio
    {
        Task<bool> Alta(DatosNegocio obj);
        Task<bool> Modificar(DatosNegocio obj);
        Task<bool> Eliminar(int id);
        Task<DatosNegocio> BuscarPorId(int id);
        Task<IEnumerable<DatosNegocio>> BuscarTodo();
    }
}
