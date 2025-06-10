using Dominio.Entidades;

namespace AllToImportSAS.Controllers.DTO
{
    public class DTOCompra
    {
        public List<DTOItemCompra> Items { get; set; }
        public int IdCliente { get; set; }
        //public int IdPagoMercadoPago { get; set; }
        public string TipoEnvio { get; set; }
        public DTOEnvioDomicilio? EnvioDomicilio { get; set; }
        public DTORetiroCompra? RetiroCompra { get; set; }
        public string? Rut { get; set; }
        public string? RazonSocial { get; set; }
        public string Telefono { get; set; }
    }
}
