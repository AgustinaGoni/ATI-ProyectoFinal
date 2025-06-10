using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dominio.Entidades
{
    [Owned]
    public class ItemCompra
    {
        public int Id { get; set; }
        public Producto Producto {  get; set; }
        public int Cantidad {  get; set; }
    }
}
