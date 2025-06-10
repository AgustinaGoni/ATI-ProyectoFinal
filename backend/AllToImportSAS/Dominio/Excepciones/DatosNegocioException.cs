using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dominio.Excepciones
{
    public  class DatosNegocioException: Exception
    {
        public DatosNegocioException() { }
        public DatosNegocioException(string mensaje)
        : base(mensaje) { }
        public DatosNegocioException(string mensaje, Exception ex)
        : base(mensaje, ex) { }
    }
}
