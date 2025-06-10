using Dominio.Entidades;

namespace AllToImportSAS.Controllers.DTO
{
    public class DTOAltaCliente
    {
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string CorreoElectronico { get; set; }
        //public string Telefono { get; set; }
        //public List<Direccion> Direcciones { get; set; }
        public string Contrasenia { get; set; }

        public string CaptchaToken { get; set; }
    }
}
