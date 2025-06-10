namespace AllToImportSAS.Controllers.DTO
{
    public class DTOSubirProducto
    {
        public int IdProducto { get; set; }
        public string ImagenBase64 { get; set; }
        public int IdCategoria { get; set; }
        public string? Descripcion { get; set; }
    }
}
