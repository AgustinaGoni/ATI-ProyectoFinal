using Dominio.Entidades;

namespace AllToImportSAS.Controllers.DTO
{
    public class DTOAltaDatosNegocio
    {
        public string Nombre { get; set; }
        public  DTODireccion Direccion{ get; set; }
        public string Telefono { get; set; }
        public string Horario { get; set; }
    }
}

