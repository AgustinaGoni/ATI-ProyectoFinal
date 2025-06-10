using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dominio.Entidades
{    
    public class RetiroCompra : TipoEntrega
    {
        public string DocumentoCliente { get; set; }
        public string NombreApellido { get; set; }
        public string TipoDocumento { get; set; }

        [ForeignKey(nameof(DatosNegocio))]
        public int DatosNegocioId { get; set; }
        public DatosNegocio DatosNegocio { get; set; }
    }
}
