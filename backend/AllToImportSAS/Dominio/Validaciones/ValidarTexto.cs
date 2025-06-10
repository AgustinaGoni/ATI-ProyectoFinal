using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dominio.Validaciones
{
    public class ValidarTexto
    {
        public static void ValidarSoloTexto(string texto)
        {
            //Verifica que el nombre no contenga numeros.            
            foreach (char c in texto)
            {
                if (!char.IsLetter(c) && c != 32)
                {
                    throw new Exception("Solo puede incluir caracteres alfabéticos");
                }
            }
        }

        public static void ValidarSoloVacio(string texto)
        {
            //Verifica que el nombre no sea nulo
            if (string.IsNullOrEmpty(texto))
                throw new Exception("No puede estar vacío");

        }
    }
}
