namespace AllToImportSAS.Controllers.DTO
{
    public class DTOCarrito
    {
        public List<DTOProducto> Productos { get; set; }
        public DTOClienteCompra Cliente { get; set; }
        public string OpcionEnvio { get; set; }
        public bool GuardarDatosExtras { get; set; }
        public DTOEnvioDomicilio EnvioDomicilio { get; set; }
        public DTORetiroCompra RetiroCompra { get; set; }

    }
}
