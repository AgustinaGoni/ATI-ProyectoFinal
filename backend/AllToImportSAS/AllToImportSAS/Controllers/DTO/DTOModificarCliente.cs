using Dominio.Entidades;

namespace AllToImportSAS.Controllers.DTO
{
    public class DTOModificarCliente
    {
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        //public string CorreoElectronico { get; set; }
        public string Telefono { get; set; }
        public string DocumentoIdentidad { get; set; }
        public string? RazonSocial { get; set; }
        public string? Rut { get; set; }
        //public string Contrasenia { get; set; }
    }
}
