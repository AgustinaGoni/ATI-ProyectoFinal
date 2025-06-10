using AccesoDatos.EntityFramework;
using AllToImportSAS.Controllers.DTO;
using AllToImportSAS.Controllers.ReCAPTCHA;
using Dominio.Entidades;
using Dominio.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AllToImportSAS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class DatosNegocioController : ControllerBase
    {
        private readonly IRepoDatoNegocio repoDatoNegocio;
        private readonly IRepoCostoDeEnvioDomicilio repoCostoDeEnvioDomicilio;

        public DatosNegocioController(IRepoDatoNegocio repoDatoNegocio, IRepoCostoDeEnvioDomicilio repoCostoDeEnvioDomicilio)
        {
            this.repoDatoNegocio = repoDatoNegocio;
            this.repoCostoDeEnvioDomicilio = repoCostoDeEnvioDomicilio;
        }


        [HttpGet("ObtenerDatosNegocio")]
        public async Task<ActionResult<List<DatosNegocio>>> ObtenerDatos()
        {
            try
            {
                var datos = await repoDatoNegocio.BuscarTodo();
                return Ok(datos);
            }
            catch
            {
                return StatusCode(500, "Ha ocurrido un error");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DatosNegocio>> GetDatosById(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return NotFound("Dato no encontrado");
                }

                return await repoDatoNegocio.BuscarPorId(id);
            }
            catch
            {
                return StatusCode(500, "Ha ocurrido un error");
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> EliminarDatosNegocio(int id)
        {
            if (id <= 0)
            {
                return NotFound("Usuario no encontrado");
            }
            try
            {
                if (!await repoDatoNegocio.Eliminar(id))
                {
                    return BadRequest("No se ha podido eliminar.");
                }

                return Ok("Se ha eliminado el usuario.");
            }
            catch
            {
                return StatusCode(500, "Ha ocurrido un error");
            }


        }

        [HttpPost("DatosNegocio")]
        [Authorize]
        public async Task<ActionResult> AltaDatosNegocio([FromBody] DTOAltaDatosNegocio datosNegocio)
        {
            try
            {

                DatosNegocio d = new DatosNegocio
                {
                    Nombre = datosNegocio.Nombre,
                    Direccion = new Direccion
                    {
                        Departamento = datosNegocio.Direccion.Departamento,
                        Ciudad = datosNegocio.Direccion.Ciudad,
                        Calle = datosNegocio.Direccion.Calle,
                        CodigoPostal = datosNegocio.Direccion.CodigoPostal,
                        NroPuerta = datosNegocio.Direccion.NroPuerta,
                        NroApartamento = datosNegocio.Direccion.NroApartamento
                    },
                    Telefono = datosNegocio.Telefono,
                    Horario = datosNegocio.Horario

                };

                if (!await repoDatoNegocio.Alta(d))
                {
                    return BadRequest("No se ha dado de alta el dato del negocio");
                }
                //return Ok(new { message = "Alta exitosa" });
                return Ok("Alta exitosa");
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [HttpPut("DatosNegocio/{id}")]
        [Authorize]
        public async Task<ActionResult> ModificarDatosNegocio(int id, [FromBody] DTOAltaDatosNegocio datos)
        {
            try
            {
                DatosNegocio datosNegocio = await repoDatoNegocio.BuscarPorId(id);

                if (datosNegocio == null)
                {
                    return NotFound(new { mensaje = "Cliente no encontrado." });
                }


                datosNegocio.Nombre = datos.Nombre;
                datosNegocio.Telefono = datos.Telefono;
                datosNegocio.Horario = datos.Horario;
                datosNegocio.Direccion.Departamento = datos.Direccion.Departamento;
                datosNegocio.Direccion.Ciudad = datos.Direccion.Ciudad;
                datosNegocio.Direccion.Calle = datos.Direccion.Calle;
                datosNegocio.Direccion.CodigoPostal = datos.Direccion.CodigoPostal;
                datosNegocio.Direccion.NroPuerta = datos.Direccion.NroPuerta;
                datosNegocio.Direccion.NroApartamento = datos.Direccion.NroApartamento;

                bool resultado = await repoDatoNegocio.Modificar(datosNegocio);

                return Ok(resultado);

            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [HttpGet("ObtenerCostoEnvio")]
        public async Task<ActionResult> ObtenerCostoEnvio()
        {
            try
            {
                var costo = await repoCostoDeEnvioDomicilio.BuscarCostoEnvio();
                return Ok(costo);
            }
            catch
            {
                return StatusCode(500, "Ha ocurrido un error");
            }
        }
    }
}
