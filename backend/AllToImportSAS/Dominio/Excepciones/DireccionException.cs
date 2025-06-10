using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dominio.Excepciones
{
    public class DireccionException:Exception
    {
        public DireccionException() { }
        public DireccionException(string mensaje)
        : base(mensaje) { }
        public DireccionException(string mensaje, Exception ex)
        : base(mensaje, ex) { }
    }
}
