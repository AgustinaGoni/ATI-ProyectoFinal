using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dominio.Entidades
{
    public class CompraPendiente
    {
        public int Id { get; set; }
        public int ClienteId { get; set; }
        public string ExternalReference { get; set; }
        public long PaymentId { get; set; }
        public DateTime FechaCreacion { get; set; }
        public string Estado { get; set; }
    }
}
