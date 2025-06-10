using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dominio.Entidades
{
    [Index(nameof(Codigo), IsUnique = true)]
    public class Producto
    {
        public int Id { get; set; }
        public int Codigo { get; set; }
        public string Nombre { get; set;}
        public string Descripcion { get; set;}
        public double Precio { get; set;}
        public int Stock { get; set;}
        public string Imagen {  get; set;}
        public Categoria? Categoria { get; set; }
        public bool Habilitado { get; set; }
    }
}
