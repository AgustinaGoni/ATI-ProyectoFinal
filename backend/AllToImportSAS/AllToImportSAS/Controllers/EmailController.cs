using AllToImportSAS.Controllers.Servicios;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AllToImportSAS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly ServicioEmail _servicioEmail;

        public EmailController(ServicioEmail servicioEmail)
        {
            _servicioEmail = servicioEmail;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
        {
            try
            {
                await _servicioEmail.SendEmailAsync(request.ToEmail, "Enviado desde SendGrid con parametros", "Este es un mensaje enviado desde SendGrid. con parametros");
                return Ok(new { Message = "Correo enviado exitosamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = "Error al enviar el correo.", Details = ex.Message });
            }
        }
    }
    //todo hacer un dto
    public class EmailRequest
    {
        public string ToEmail { get; set; }
    }
}
