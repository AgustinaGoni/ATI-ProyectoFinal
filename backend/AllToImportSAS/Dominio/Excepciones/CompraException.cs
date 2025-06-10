using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dominio.Excepciones
{
    public class CompraException:Exception
    {
        public CompraException() { }
        public CompraException(string mensaje)
        : base(mensaje) { }
        public CompraException(string mensaje, Exception ex)
        : base(mensaje, ex) { }
    }
}
