using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dominio.Entidades
{
    public class EnvioDomicilio : TipoEntrega
    {
        public int IdCliente { get; set; }
        //public Cliente Cliente { get; set; }
        public int IdDireccion { get; set; }
        //public Direccion Direccion { get; set; }
        //public string? Comentario { get; set; }
        public double CostoEnvio { get; set; }
    }
}
