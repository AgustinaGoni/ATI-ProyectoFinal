using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dominio.Entidades
{
    public class Compra
    {
        public int Id {  get; set; }
        public List<ItemCompra> ItemsCompra { get; set; }
        public DateTime FechaCompra { get; set; }
        public Cliente Cliente{ get; set;}
        public TipoEntrega TipoEntrega { get; set; }
        public double TotalComprado { get; set; }
        public string? Rut {  get; set; }
        public string? RazonSocial {  get; set; }
        public string Telefono {  get; set; }
        public EstadoCompra EstadoCompra { get; set; }
        public long PaymentId { get; set; }
        //[ForeignKey(nameof(DatosNegocio))]
        //public int DatosNegocioId { get; set; }
        //public DatosNegocio DatosNegocio { get; set; }
        // Propiedad que devuelve el nombre del EstadoCompra
        [NotMapped]
        public string EstadoCompraNombre => EstadoCompra.ToString();
    }
}
