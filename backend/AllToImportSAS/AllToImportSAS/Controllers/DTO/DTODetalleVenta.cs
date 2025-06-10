namespace AllToImportSAS.Controllers.DTO
{
    public class DTODetalleVenta
    {
        public DateTime FechaCompra { get; set; }
        public string Cliente { get; set; }
        public double TotalComprado { get; set; }
        public string EstadoCompra { get; set; }
        public List<DTOProductoReporte> ItemsCompra { get; set; }
    }
}
