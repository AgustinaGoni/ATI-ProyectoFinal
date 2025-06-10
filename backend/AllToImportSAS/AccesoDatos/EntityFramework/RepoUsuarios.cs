using Dominio.Entidades;
using Dominio.Excepciones;
using Dominio.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccesoDatos.EntityFramework
{
    public class RepoUsuarios : IRepoUsuario
    {
        AllToImportContext db;
        public RepoUsuarios(AllToImportContext db)
        { this.db = db; }

        public async Task<bool> Alta(Usuario obj)
        {
            if (obj == null) throw new ArgumentNullException("Error: El usuario no puede ser nulo");
            obj.Validar();
            try
            {
                var usuario = db.Usuarios.Where(t => t.CorreoElectronico.ToLower().Trim() == obj.CorreoElectronico.ToLower().Trim()).SingleOrDefault();
                if (usuario != null)
                    throw new Exception("Ya existe un usuario registrado.");

                //Esto se podria hacer pero para funcionario
                //if (obj is Funcionario)
                //{
                //    Funcionario funcionario = (Funcionario)obj;
                //    //foreach (Direccion dir in cliente.Direcciones)
                //    //{
                //        db.Direcciones.Add(funcionario);
                //    //}
                //}
                db.Usuarios.Add(obj);
                await db.SaveChangesAsync();
                return true;
            }
            catch (UsuarioException ex)
            {
                throw new UsuarioException(ex.Message);
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
                Usuario? usu = await db.Usuarios.FindAsync(id);
                if (usu is null)
                {
                    return false;
                }
                db.Usuarios.Remove(usu);
                await db.SaveChangesAsync();
                return true;
            }
            catch (UsuarioException ex)
            {
                throw new UsuarioException(ex.Message);
            }
            catch (DbUpdateException ex)
            {
                throw new Exception(ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<IEnumerable<Usuario>> BuscarTodo()
        {
            try
            {
                return await db.Usuarios
                    .OfType<Cliente>()
                    .Include(c => c.Direcciones)
                    .Select(c => new Cliente
                    {
                        Id = c.Id,
                        Nombre = c.Nombre,
                        Apellido = c.Apellido,
                        CorreoElectronico = c.CorreoElectronico,
                        RazonSocial = c.RazonSocial,
                        RUT = c.RUT,
                        Direcciones = c.Direcciones
                    })
                    .ToListAsync();
            }
            catch
            {
                throw new Exception("No hay usuarios en el sistema");
            }
        }

        public async Task<IEnumerable<Cliente>> BuscarTodosLosClientes()
        {
            try
            {
                return await db.Usuarios
                    .OfType<Cliente>()
                    .Include(c => c.Direcciones)
                    .Select(c => new Cliente
                    {
                        Id = c.Id,
                        Nombre = c.Nombre,
                        Apellido = c.Apellido,
                        Telefono = c.Telefono,
                        DocumentoIdentidad = c.DocumentoIdentidad,
                        CorreoElectronico = c.CorreoElectronico,
                        RazonSocial = c.RazonSocial,
                        RUT = c.RUT,
                        Direcciones = c.Direcciones,
                        FechaRegistro = c.FechaRegistro
                    })
                    .ToListAsync();
            }
            catch
            {
                throw new Exception("No hay usuarios en el sistema");
            }
        }

        public async Task<IEnumerable<Funcionario>> BuscarTodosLosFuncionarios()
        {
            try
            {
                return await db.Usuarios
                    .OfType<Funcionario>()
                    //.Include(f => f.Direccion)
                    .Select(f => new Funcionario
                    {
                        Id = f.Id,
                        Nombre = f.Nombre,
                        Apellido = f.Apellido,
                        CorreoElectronico = f.CorreoElectronico,
                        //Direccion = f.Direccion,
                        EsAdmin = f.EsAdmin,
                        FechaRegistro = f.FechaRegistro
                    })
                    .ToListAsync();
            }
            catch
            {
                throw new Exception("No hay usuarios en el sistema");
            }
        }

        public async Task<Usuario> BuscarUsuarioParaRealizarCompra(int id)
        {
            try
            {
                return await db.Usuarios.FindAsync(id);
            }
            catch (DbUpdateException ex)
            {
                throw new Exception(ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<Usuario> BuscarPorId(int id)
        {
            try
            {
                if (id == null) throw new UsuarioException("Id null.");

                var usuario = db.Usuarios
                    .Where(u => u.Id == id)
                    .Select(u => new Usuario
                    {
                        Nombre = u.Nombre,
                        Apellido = u.Apellido,
                        CorreoElectronico = u.CorreoElectronico,
                        FechaRegistro = u.FechaRegistro,
                        EsAdmin = u.EsAdmin
                    })
                    .FirstOrDefault();

                if (usuario == null) throw new UsuarioException("No existe el usuario");
                return usuario;
                //return await db.Usuarios.FindAsync(id);
            }
            catch (UsuarioException ex)
            {
                throw new UsuarioException(ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<Cliente?> BuscarClientePorId(int id)
        {
            try
            {
                var cliente = await db.Usuarios
                    .OfType<Cliente>()
                    .Where(c => c.Id == id)
                    .Include(f => f.Direcciones)
                    .Select(c => new Cliente
                    {
                        Id = c.Id,
                        Nombre = c.Nombre,
                        Apellido = c.Apellido,
                        Telefono = c.Telefono,
                        DocumentoIdentidad = c.DocumentoIdentidad,
                        CorreoElectronico = c.CorreoElectronico,
                        RazonSocial = c.RazonSocial,
                        RUT = c.RUT,
                        Direcciones = c.Direcciones,
                        FechaRegistro = c.FechaRegistro
                    })
                    .FirstOrDefaultAsync();

                return cliente == null ? throw new UsuarioException("No se encuentra el cliente") : cliente;
            }
            catch (UsuarioException ex)
            {
                throw new UsuarioException(ex.Message);
            }
        }

        public async Task<Funcionario?> BuscarFuncionarioPorId(int id)
        {
            try
            {
                var funcionario = await db.Usuarios
                    .OfType<Funcionario>()
                    .Where(f => f.Id == id)
                    .Select(f => new Funcionario
                    {
                        Id = f.Id,
                        Nombre = f.Nombre,
                        Apellido = f.Apellido,
                        CorreoElectronico = f.CorreoElectronico,
                        //Direccion = f.Direccion,
                        EsAdmin = f.EsAdmin,
                        FechaRegistro = f.FechaRegistro
                    })
                    .FirstOrDefaultAsync();

                return funcionario;
            }
            catch
            {
                throw new UsuarioException("No se encuentra el cliente");
            }
        }


        public async Task<bool> BuscarSiExisteDocumento(string documentoIdentidad, int idCliente)
        {
            try
            {

                var cliente = await BuscarClientePorId(idCliente);

                var existeDocumentoRegistrado = await db.Clientes
                                                .Where(c => c.DocumentoIdentidad == documentoIdentidad)
                                                .FirstOrDefaultAsync();
                var existeDocumentoConCliente = await db.Clientes
                                                .Where(c => c.DocumentoIdentidad == documentoIdentidad && 
                                                c.Id == idCliente)
                                                .FirstOrDefaultAsync();


                if (cliente != null)
                {
                    if(existeDocumentoConCliente != null)
                    {
                        return false;
                    }

                    if (existeDocumentoRegistrado != null)
                    {
                        return true;
                    }

                    return false;
                }

                return false;
            }
            catch (UsuarioException ex)
            {
                throw new UsuarioException(ex.Message);
            }

            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<Usuario> BuscarPorDocumentoIdentidad(string documentoIdentidad)
        {
            try
            {
                var u = db.Usuarios
                    .OfType<Cliente>()
                    .FirstOrDefault(u => u.DocumentoIdentidad == documentoIdentidad);

                if(u == null)
                {
                    throw new UsuarioException($"No existe un usuario registrado con el documento de identidad ingresado: {documentoIdentidad}");
                }
                return u;
            }
            catch (UsuarioException ex)
            {
                throw new UsuarioException(ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public Usuario ValidarLogin(string correo, string clave)
        {
            try
            {

                Usuario? u = db.Usuarios.FirstOrDefault(u => u.CorreoElectronico == correo);

                if (u == null || u.Contrasenia != Usuario.GetSHA256(clave))
                {
                    throw new UsuarioException("Correo electrónico o contraseña incorrectos. Por favor, verifica tus datos e inténtalo de nuevo");
                }
                //if (u.Contrasenia != Usuario.GetSHA256(clave))
                //{
                //    throw new UsuarioException("La contraseña es incorrecta");
                //}
                return u;
            }
            catch (UsuarioException ex)
            {
                throw new UsuarioException(ex.Message);
            }
        }


        public async Task ModificarFuncionario(Funcionario funcionario)
        {


            try
            {
                if (funcionario == null)
                {
                    throw new ArgumentNullException(nameof(funcionario), "El funcionario no puede ser nulo.");
                }

                funcionario.Validar();
                // Recuperar el cliente existente de la base de datos
                var existeFuncionario = await db.Funcionarios.FindAsync(funcionario.Id);
                if (existeFuncionario == null)
                {
                    throw new UsuarioException("Funcionario no encontrado en la base de datos.");
                }

                // Actualizar solo los campos proporcionados
                if (!string.IsNullOrWhiteSpace(funcionario.Nombre))
                    existeFuncionario.Nombre = funcionario.Nombre;

                if (!string.IsNullOrWhiteSpace(funcionario.Apellido))
                    existeFuncionario.Apellido = funcionario.Apellido;

                if (!string.IsNullOrWhiteSpace(funcionario.CorreoElectronico))
                {
                    // Verificar si el correo electrónico es diferente del actual
                    if (existeFuncionario.CorreoElectronico != funcionario.CorreoElectronico)
                    {
                        // Verificar que el nuevo correo electrónico no esté en uso por otro funcionario
                        if (await db.Funcionarios.AnyAsync(f => f.CorreoElectronico == funcionario.CorreoElectronico))
                        {
                            throw new UsuarioException("El correo electrónico proporcionado ya está en uso.");
                        }

                        existeFuncionario.CorreoElectronico = funcionario.CorreoElectronico;
                    }
                }

                //existeFuncionario.Nombre = funcionario.Nombre;
                //existeFuncionario.Apellido = funcionario.Apellido;
                //existeFuncionario.CorreoElectronico = funcionario.CorreoElectronico;
                await db.SaveChangesAsync();

            }
            catch (UsuarioException ex)
            {
                throw new UsuarioException($"No se actualizo el usuario. {ex.Message}");
            }
            catch (DbUpdateException ex)
            {
                // Manejar excepciones relacionadas con la actualización de la base de datos
                throw new UsuarioException($"No se pudo actualizar el cliente debido a un problema de base de datos. Error: {ex.Message}");
            }


        }

        //public async Task ModificarCliente(string Id)
        //{
        //    try
        //    {
        //        var cliente = await db.Clientes.
        //        var existeDocumentoRegistrado = await db.Clientes
        //                                    .Where(c => c.DocumentoIdentidad == cliente.DocumentoIdentidad && c.Id != cliente.Id)
        //                                    .FirstOrDefaultAsync();
        //        if (existeDocumentoRegistrado != null)
        //        {
        //            throw new UsuarioException("El documento ingresado ya se encuentra registrado.");
        //        }
        //    }
        //    catch(UsuarioException ex)
        //    {
        //        throw new UsuarioException(ex.Message);
        //    }
        //}

        public async Task ModificarCliente(Cliente cliente)
        {
            try
            {
                if (cliente == null)
                {
                    throw new ArgumentNullException(nameof(cliente), "El cliente no puede ser nulo.");
                }

                cliente.Validar();

                var existeDocumentoRegistrado = await db.Clientes
                                            .Where(c => c.DocumentoIdentidad == cliente.DocumentoIdentidad && c.Id != cliente.Id)
                                            .FirstOrDefaultAsync();
                if (existeDocumentoRegistrado != null)
                {
                    throw new UsuarioException("El documento ingresado ya se encuentra registrado.");
                }

                // Recuperar el cliente existente de la base de datos
                var existingCliente = await db.Clientes.FindAsync(cliente.Id);
                if (existingCliente == null)
                {
                    throw new UsuarioException("Cliente no encontrado en la base de datos.");
                }

                if (existingCliente.DocumentoIdentidad == cliente.DocumentoIdentidad)
                {
                    existingCliente.Nombre = cliente.Nombre;
                    existingCliente.Apellido = cliente.Apellido;
                    existingCliente.Telefono = cliente.Telefono;
                    //existingCliente.DocumentoIdentidad = cliente.DocumentoIdentidad;
                    existingCliente.RazonSocial = cliente.RazonSocial;
                    existingCliente.RUT = cliente.RUT;
                }
                else {
                    // Actualizar las propiedades necesarias
                    existingCliente.Nombre = cliente.Nombre;
                    existingCliente.Apellido = cliente.Apellido;
                    existingCliente.Telefono = cliente.Telefono;
                    existingCliente.DocumentoIdentidad = cliente.DocumentoIdentidad;
                    existingCliente.RazonSocial = cliente.RazonSocial;
                    existingCliente.RUT = cliente.RUT;
                }

                // Guardar los cambios en la base de datos
                await db.SaveChangesAsync();
            }

            catch (UsuarioException ex)
            {
                // Manejar excepciones relacionadas con la actualización de la base de datos
                throw new UsuarioException(ex.Message);
            }
            catch (DbUpdateException ex)
            {
                // Manejar excepciones relacionadas con la actualización de la base de datos
                throw new DbUpdateException("No se pudo actualizar el cliente debido a un problema de base de datos.", ex);
            }
            catch (Exception ex)
            {
                // Manejar otras excepciones no previstas
                throw new Exception("Ocurrió un error al intentar actualizar el cliente.", ex);
            }
        }




        #region Agregar, modificar y obtener direcciones
        public async Task<Direccion> AgregarDireccion(int clienteId, Direccion direccion)
        {
            //bool exito = false;
            try
            {
                direccion.Validar();
                var cliente = await db.Clientes.Include(c => c.Direcciones).FirstOrDefaultAsync(c => c.Id == clienteId);
                if (cliente == null) throw new UsuarioException("No se ha encontrado el usuario");

                cliente.Direcciones.Add(direccion);
                await db.SaveChangesAsync();
                return direccion;

            }
            catch (DireccionException ex)
            {
                throw new DireccionException(ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception("Ha ocurrido un error al agregar la dirección");
            }

            //return exito;
        }
        //public async Task<Direccion> AgregarDireccion(int clienteId, Direccion direccion)
        //{
        //    try
        //    {
        //        // Validación de la dirección
        //        direccion.ValidarDireccion();  // Lanza una excepción si la dirección no es válida.

        //        // Búsqueda del cliente en la base de datos
        //        var cliente = await db.Clientes.Include(c => c.Direcciones).FirstOrDefaultAsync(c => c.Id == clienteId);
        //        if (cliente == null)
        //        {
        //            throw new UsuarioException("No se ha encontrado el usuario");
        //        }

        //        // Agregando la dirección al cliente
        //        cliente.Direcciones.Add(direccion);
        //        await db.SaveChangesAsync();

        //        return direccion;
        //    }
        //    catch (UsuarioException ex)
        //    {
        //        // Manejo de excepciones relacionadas con el usuario
        //        throw new UsuarioException(ex.Message);
        //    }
        //    catch (Exception ex)
        //    {
        //        // Manejo de cualquier otra excepción
        //        throw new Exception("Ha ocurrido un error al agregar la dirección", ex);
        //    }
        //}

        public async Task<bool> ModificarDireccion(int id, Direccion direccion)
        {
            bool exito = false;
            try
            {
                direccion.Validar();

                if (direccion == null)
                    throw new Exception("Los datos a modificar no pueden ser nulos.");
                //var cliente = await db.Clientes.Include(c => c.Direcciones).FirstOrDefaultAsync(c => c.Id == clienteId);

                var d = await db.Direcciones.FirstOrDefaultAsync(c => c.Id == id);
                if (d != null)
                {
                    d.Calle = direccion.Calle;
                    d.Ciudad = direccion.Ciudad;
                    d.Departamento = direccion.Departamento;
                    d.NroPuerta = direccion.NroPuerta;
                    d.NroApartamento = direccion.NroApartamento;
                    d.CodigoPostal = direccion.CodigoPostal;
                    await db.SaveChangesAsync();
                    exito = true;
                }
            }
            catch (DbUpdateException ex)
            {
                throw new DbUpdateException(ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception("Ha ocurrido un error al agregar la dirección");
            }

            return exito;
        }

        public async Task<List<Direccion>> BuscarDireccionesPorCliente(int id)
        {
            try
            {
                return db.Direcciones.Where(d => EF.Property<int>(d, "ClienteId") == id)
                              .ToList();
            }
            catch
            {
                throw new Exception("Ha ocurrido un error obteniendo las direcciones");
            }
        }

        public async Task<Direccion> BuscarDireccion(int idDireccion)
        {
            try
            {
                return db.Direcciones.FirstOrDefault(d => d.Id == idDireccion);
            }
            catch
            {
                throw new Exception("Ha ocurrido un error obteniendo la direccione");
            }
        }

        public async Task<bool> EliminarDireccion(int idDireccion)
        {
            try
            {
                Direccion d = await BuscarDireccion(idDireccion);
                if (d is null)
                {
                    return false;
                }
                db.Remove(d);
                await db.SaveChangesAsync();
                return true;
            }
            catch
            {
                throw new Exception("No se elimina la compra");
            }
        }

        #endregion
    }
}
