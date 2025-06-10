using Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dominio.Interfaces
{
    public interface IRepoUsuario
    {
        Task<bool> Alta(Usuario obj);
        Task ModificarFuncionario(Funcionario funcionario);
        Task ModificarCliente(Cliente cliente);
        Task<bool> Eliminar(int id);
        Task<IEnumerable<Usuario>> BuscarTodo();
        Task<IEnumerable<Cliente>> BuscarTodosLosClientes();
        Task<IEnumerable<Funcionario>> BuscarTodosLosFuncionarios();
        Task<Usuario> BuscarUsuarioParaRealizarCompra(int id);
        Task<Usuario> BuscarPorId(int id);
        Task<Cliente?> BuscarClientePorId(int id);
        Task<Funcionario?> BuscarFuncionarioPorId(int id);
        Task<Usuario> BuscarPorDocumentoIdentidad(string documentoIdentidad);
        Usuario ValidarLogin(string correo, string clave);
        Task<List<Direccion>> BuscarDireccionesPorCliente(int id);
        Task<Direccion> BuscarDireccion(int idDireccion);
        Task<Direccion> AgregarDireccion(int clienteId, Direccion direccion);
        Task<bool> ModificarDireccion(int id, Direccion direccion);
        Task<bool> EliminarDireccion(int idDireccion);
        Task<bool> BuscarSiExisteDocumento(string documentoIdentidad, int idCliente);
    }
}

