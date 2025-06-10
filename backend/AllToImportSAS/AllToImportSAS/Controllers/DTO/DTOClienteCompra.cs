using Dominio.Entidades;

namespace AllToImportSAS.Controllers.DTO
{
    public class DTOClienteCompra
    {
        public int IdCliente { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Email { get; set; }
        //public string CodigoAreaTelefono { get; set; }
        public string NumeroTelefono { get; set; }
        public string RazonSocial { get; set; }
        public string Rut { get; set; }
        //public string TipoDocumento { get; set; }
        public string DocumentoIdentidad { get; set; }
        //public DTODireccion Direccion { get; set; }
    }
}
