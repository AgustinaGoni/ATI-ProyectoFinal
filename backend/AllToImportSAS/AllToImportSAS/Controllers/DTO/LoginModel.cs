using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;
using System.Text;

namespace AllToImportSAS.Controllers.DTO
{
    public class LoginModel
    {
        [Required]
        public string Correo {  get; set; }
        [Required]
        public string Clave { get; set; }
        public string CaptchaToken { get; set; }
    }
}
