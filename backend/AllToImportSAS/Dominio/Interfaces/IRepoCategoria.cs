using Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dominio.Interfaces
{
    public interface IRepoCategoria
    {
        Task<bool> Alta(Categoria obj);
        Task<Categoria> BuscarPorId(int id);
        Task<IEnumerable<Categoria>> BuscarTodo();
        Task Modificar(int id, Categoria obj);
        Task<bool> Eliminar(int id);
    }
}
