using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dominio.Excepciones
{
    public class UsuarioException : Exception
    {
        public UsuarioException() { }
        public UsuarioException(string mensaje)
        : base(mensaje) { }
        public UsuarioException(string mensaje, Exception ex)
        : base(mensaje, ex) { }
    }
}
