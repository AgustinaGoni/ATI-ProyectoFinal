using Dominio.Entidades;

namespace AllToImportSAS.Controllers.DTO
{
    public class DTOAltaFuncionario
    {
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string CorreoElectronico { get; set; }
        //public DTODireccion Direccion { get; set; }
        //public bool EsAdmin { get; set; }
        public string Contrasenia { get; set; }
    }
}
