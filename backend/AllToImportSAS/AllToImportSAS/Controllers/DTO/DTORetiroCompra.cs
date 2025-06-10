namespace AllToImportSAS.Controllers.DTO
{
    public class DTORetiroCompra
    {
        public string NumeroDocumento { get; set; }
        public string? TipoDocumento { get; set; } = "CI";
        public string NombreApellido { get; set; }
        public string? Comentario { get; set; }
        public string IdDatosNegocio { get; set; }
    }
}
