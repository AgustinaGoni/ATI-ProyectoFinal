using AccesoDatos.EntityFramework;

using AllToImportSAS.Controllers.DTO;
using AllToImportSAS.Controllers.ReCAPTCHA;
using Dominio.Entidades;
using Dominio.Excepciones;
using Dominio.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AllToImportSAS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class UsuarioController : ControllerBase
    {
        private readonly IRepoUsuario repoUsuarios;

        public UsuarioController(IRepoUsuario repoUsuarios)
        {
            this.repoUsuarios = repoUsuarios;
        }


        [HttpGet]
        public async Task<ActionResult<List<Usuario>>> GetUsuarios()
        {
            try
            {
                var usuarios = await repoUsuarios.BuscarTodo();
                return Ok(usuarios);
            }
            catch
            {
                return StatusCode(500, "Ha ocurrido un error");
            }
        }

        [HttpGet("ObtenerClientes")]
        [Authorize]
        public async Task<ActionResult<List<Cliente>>> ObtenerClientes()
        {
            try
            {
                var clientes = await repoUsuarios.BuscarTodosLosClientes();
                return Ok(clientes);
            }
            catch
            {
                return StatusCode(500, "Ha ocurrido un error");
            }
        }

        [HttpGet("ObtenerFuncionarios")]
        [Authorize]
        public async Task<ActionResult<List<Cliente>>> ObtenerFuncionarios()
        {
            try
            {
                var funcionarios = await repoUsuarios.BuscarTodosLosFuncionarios();
                return Ok(funcionarios);
            }
            catch
            {
                return StatusCode(500, "Ha ocurrido un error");
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Usuario>> GetUsuarioById(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return NotFound("Usuario no encontrado");
                }

                return await repoUsuarios.BuscarPorId(id);
            }
            catch (UsuarioException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            catch
            {
                return StatusCode(500, "Ha ocurrido un error");
            }
        }

        [HttpGet("BuscarCliente/{idCliente}")]
        [Authorize]
        public async Task<ActionResult<Cliente>> ObtenerClientePorId(int idCliente)
        {
            try
            {
                if (idCliente <= 0)
                {
                    return NotFound("Usuario no encontrado");
                }

                return await repoUsuarios.BuscarClientePorId(idCliente);
            }
            catch
            {
                return StatusCode(500, "Ha ocurrido un error");
            }
        }


        //Revisar esto
        [HttpGet("BuscarPorDocumentoIdentidad/{documentoIdentidad}")]
       // [Authorize]
        public async Task<ActionResult<Usuario>> BuscarPorDocumentoIdentidad(string documentoIdentidad)
        {
            try
            {
                if (documentoIdentidad == null)
                {
                    return NotFound("Usuario no encontrado");
                }

                var usuario = await repoUsuarios.BuscarPorDocumentoIdentidad(documentoIdentidad);
                return(usuario);
            }
            catch (UsuarioException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Ha ocurrido un error");
            }
        }

        [HttpGet("BuscarSiExisteDocumento/{documentoIdentidad}/{idCliente}")]
        // [Authorize]
        public async Task<ActionResult<bool>> BuscarSiExisteDocumento(string documentoIdentidad, int idCliente)
        {
            try
            {
                if (documentoIdentidad == null)
                {
                    return NotFound("Usuario no encontrado");
                }
                                
                return (await repoUsuarios.BuscarSiExisteDocumento(documentoIdentidad, idCliente));
            }
            catch (UsuarioException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Ha ocurrido un error");
            }
        }

        [HttpPost("Cliente")]
        public async Task<ActionResult> AltaCliente([FromBody] DTOAltaCliente cliente)
        {
            try
            {

                ArgumentNullException.ThrowIfNull(cliente);

                DTOUsuario.VerificarContraseña(cliente.Contrasenia);

                if (!await CaptchaResponse.VerifyCaptcha(cliente.CaptchaToken))
                {
                    return BadRequest("Captcha inválido.");
                }

                Usuario c = new Cliente
                {
                    Nombre = cliente.Nombre,
                    Apellido = cliente.Apellido,
                    CorreoElectronico = cliente.CorreoElectronico,
                    Contrasenia = DTOUsuario.GetSHA256(cliente.Contrasenia),
                    FechaRegistro = DateTime.Now,
                    EsAdmin = false
                };

                if (!await repoUsuarios.Alta(c))
                {
                    return BadRequest("No se ha dado de alta el usuario");
                }
                return Ok("Alta de usuario exitosa");
            }
            catch (UsuarioException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }
       
        [HttpPost("Funcionario")]
        //[Authorize]
        public async Task<ActionResult> AltaFuncionario([FromBody] DTOAltaFuncionario funcionario)
        {
            try
            {
                ArgumentNullException.ThrowIfNull(funcionario);

                DTOUsuario.VerificarContraseña(funcionario.Contrasenia);

                Usuario f = new Funcionario
                {
                    Nombre = funcionario.Nombre,
                    Apellido = funcionario.Apellido,
                    CorreoElectronico = funcionario.CorreoElectronico,
                    Contrasenia = DTOUsuario.GetSHA256(funcionario.Contrasenia),
                    FechaRegistro = DateTime.Now,
                    EsAdmin = true
                };

                if (!await repoUsuarios.Alta(f))
                {
                    return BadRequest("No se ha dado de alta el usuario");
                }
                return Ok("Alta de usuario exitosa");
            }
            catch (UsuarioException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("BuscarFuncionario/{idFuncionario}")]
        [Authorize]
        public async Task<ActionResult<Funcionario>> ObtenerFuncionarioPorId(int idFuncionario)
        {
            try
            {
                if (idFuncionario <= 0)
                {
                    return NotFound("Usuario no encontrado");
                }

                return await repoUsuarios.BuscarFuncionarioPorId(idFuncionario);
            }
            catch
            {
                return StatusCode(500, "Ha ocurrido un error");
            }
        }

        
        [HttpGet("verificar-admin")]
        [Authorize]
        public async Task<IActionResult> VerificarAdmin()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var usuario = await repoUsuarios.BuscarPorId(int.Parse(userId));

                if (usuario == null)
                {
                    return Unauthorized(new { error = "Usuario no encontrado" });
                }

                return Ok(new { esAdmin = usuario.EsAdmin });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error interno del servidor", details = ex.Message });
            }
        }


        [HttpDelete("{idUsuario}")]
        [Authorize]
        public async Task<ActionResult> EliminarUsuario(int idUsuario)
        {
            if (idUsuario <= 0)
            {
                return NotFound("Usuario no encontrado");
            }
            try
            {
                if (!await repoUsuarios.Eliminar(idUsuario))
                {
                    return BadRequest("No se ha podido eliminar el usuario");
                }

                return Ok("Se ha eliminado el usuario exitosamente");
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, $"Error en el servidor: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error. Error {ex.Message}");
            }


        }

        //[HttpPut("Cliente")]
        //public async Task<ActionResult> ModificarCliente(int id, Cliente cliente)
        //{
        //    try
        //    {
        //        if (cliente== null)
        //        {
        //            return NotFound("Usuario no encontrado");
        //        }

        //        List<Direccion> dir = new List<Direccion>();
        //        foreach (Direccion direccion in cliente.Direcciones)
        //        {
        //            Direccion d = new Direccion
        //            {
        //                Departamento = direccion.Departamento,
        //                Ciudad = direccion.Ciudad,
        //                Calle = direccion.Calle,
        //                NroPuerta = direccion.NroPuerta,
        //                CodigoPostal = direccion.CodigoPostal,
        //            };
        //            dir.Add(d);
        //        }
        //        Usuario clienteMod = new Cliente
        //        {
        //            Nombre = cliente.Nombre,
        //            Apellido = cliente.Apellido,
        //            RUT = cliente.RUT,
        //            RazonSocial = cliente.RazonSocial,
        //            CorreoElectronico = cliente.CorreoElectronico,
        //            Contrasenia = cliente.Contrasenia,
        //            Telefono = cliente.Telefono,
        //            Direcciones = cliente.Direcciones,
        //        };
        //        Usuario cli = await repoUsuarios.BuscarPorId(id);
        //        cli = clienteMod;
        //        bool resultado = await repoUsuarios.ModificarCliente(cli);

        //        if (resultado)
        //        {
        //            return Ok("Se ha modificado el usuario exitosamente");
        //        }
        //        return BadRequest("No se ha podido modificar el usuario");
        //    }
        //    catch (Exception e)
        //    {
        //        return StatusCode(500, e.Message);
        //    }
        //}

        /******/

        //[HttpPut("Cliente/{id}")]
        //public async Task<ActionResult> ModificarCliente(int id, [FromBody] DTOModificarCliente cliente)
        //{
        //    Cliente cli = (Cliente) await repoUsuarios.BuscarPorId(id);
        //    try
        //    {
        //        cli.Nombre = cliente.Nombre;
        //        cli.Apellido = cliente.Apellido;
        //        cli.RUT = cliente.Rut;
        //        cli.RazonSocial = cliente.RazonSocial;
        //        cli.CorreoElectronico = cliente.CorreoElectronico;
        //        cli.Telefono = cliente.Telefono;
        //        await repoUsuarios.ModificarCliente(cli);
        //        return Ok("Cliente actualizado exitosamente");
        //    }
        //    catch (Exception e)
        //    {
        //        return StatusCode(500, e.Message);
        //    }
        //}

        [HttpPut("Cliente/{id}")]
        //[Authorize]
        public async Task<ActionResult> ModificarCliente(int id, [FromBody] DTOModificarCliente cliente, [FromQuery] string contrasenia)
        {
            try
            {
                // Buscar el cliente por ID
                Cliente cli = await repoUsuarios.BuscarClientePorId(id);

                if (cli == null)
                {
                    return NotFound(new { mensaje = "Cliente no encontrado." });
                }

                if (repoUsuarios.ValidarLogin(cli.CorreoElectronico, contrasenia) == null)
                {
                    return Unauthorized(new { mensaje = "Contraseña incorrecta." });
                }

                // Actualizar los datos del cliente
                cli.Nombre = cliente.Nombre;
                cli.Apellido = cliente.Apellido;
                cli.Telefono = cliente.Telefono;
                cli.DocumentoIdentidad = cliente.DocumentoIdentidad;
                cli.RazonSocial = cliente.RazonSocial;
                cli.RUT = cliente.Rut;

                // Llamar al método del repositorio para actualizar el cliente
                await repoUsuarios.ModificarCliente(cli);
                return Ok(cli);
            }
            catch (UsuarioException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = ex.Message });
            }
        }


        [HttpPut("Funcionario/{id}")]
        [Authorize]
        public async Task<ActionResult> ModificarFuncionario(int id, [FromBody] DTOModificarFuncionario funcionario)
        {
            try
            {
                // Buscar el cliente por ID
                Funcionario fun = await repoUsuarios.BuscarFuncionarioPorId(id);

                if (fun == null)
                {
                    return NotFound(new { mensaje = "Funcionario no encontrado." });
                }

                fun.Nombre = funcionario.Nombre;
                fun.Apellido = funcionario.Apellido;
                fun.CorreoElectronico = funcionario.CorreoElectronico;


                await repoUsuarios.ModificarFuncionario(fun);
                return Ok(fun);
            }
            catch (UsuarioException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = ex.Message });
            }
        }

        #region Agregar, modificar y obtener direcciones
        [HttpPost("{clienteId}/direcciones")]
        [Authorize]
        public async Task<IActionResult> AgregarDireccion(int clienteId, [FromBody] Direccion direccion)
        {

            try
            {
                var nuevaDireccion = await repoUsuarios.AgregarDireccion(clienteId, direccion);
                return Ok(nuevaDireccion);
                
               
            }
            catch (UsuarioException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                // Manejo de excepciones en el controlador
                return StatusCode(500, new { message = $"Error al agregar la dirección: {ex.Message}" });
            }
        }

        /// <summary>
        /// Modificar dirección
        /// </summary>
        /// <param name="direccionId">Identificador de la dirección a modificar</param>
        /// <param name="direccion">Objeto JSON con los nuevos datos de la dirección</param>
        /// <returns></returns>
        [HttpPut("ModficarDireccion/{direccionId}")]
        [Authorize]
        public async Task<IActionResult> ModificarDireccion(int direccionId, [FromBody] Direccion direccion)
        {
            try
            {
                var result = await repoUsuarios.ModificarDireccion(direccionId, direccion);
                if (result)
                {
                    return Ok(new { message = "Dirección modificada exitosamente" });
                }
                return NotFound(new { message = "Cliente no encontrado" });
            }
            catch (Exception ex)
            {
                // Manejo de excepciones en el controlador
                return StatusCode(500, new { message = $"Error al modificar la dirección: {ex.Message}" });
            }
        }


        /// <summary>
        /// Buscar direcciones de un cliente
        /// </summary>
        /// <param name="id">Identificador del cliente</param>
        /// <returns></returns>
        [HttpGet("DireccionCliente/{id}")]
        [Authorize]
        public async Task<ActionResult<List<Direccion>>> DireccionesDelCliente(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return NotFound("Usuario no encontrado");
                }

                return await repoUsuarios.BuscarDireccionesPorCliente(id);
            }
            catch
            {
                return StatusCode(500, "Ha ocurrido un error");
            }
        }

        /// <summary>
        /// Buscar una dirección especifica
        /// </summary>
        /// <param name="id">Identificador de la direccón a buscar</param>
        /// <returns></returns>
        [HttpGet("Direccion/{id}")]
        [Authorize]
        public async Task<ActionResult<Direccion>> ObtenerDireccion(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return NotFound("Dirección no encontrado");
                }

                return await repoUsuarios.BuscarDireccion(id);
            }
            catch
            {
                return StatusCode(500, "Ha ocurrido un error");
            }
        }

        [HttpDelete("EliminarDireccion/{idDireccion}")]
        [Authorize]
        public async Task<ActionResult> EliminarDireccion(int idDireccion)
        {
            if (idDireccion <= 0)
            {
                return NotFound("Dirección no encontrado");
            }
            try
            {
                if (!await repoUsuarios.EliminarDireccion(idDireccion))
                {
                    return BadRequest("No se ha podido eliminar la dirección");
                }

                return Ok("Se ha eliminado la dirección exitosamente");
            }
            catch
            {
                return StatusCode(500, "Ha ocurrido un error");
            }


        }
        #endregion
    }
}
