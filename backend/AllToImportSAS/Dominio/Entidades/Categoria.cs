using Dominio.Excepciones;
using Dominio.Interfaces;
using Dominio.Validaciones;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dominio.Entidades
{
    public class Categoria: IValidable<Categoria>
    {
        public int Id { get; set; }
        public string Nombre { get; set;}
        public string Descripcion { get; set;}

        public void Validar()
        {
            try
            {
                ValidarTexto.ValidarSoloTexto(Nombre);
                ValidarTexto.ValidarSoloVacio(Nombre);

                ValidarTexto.ValidarSoloVacio(Descripcion);
            }
            catch (Exception ex) {
                throw new CategoriaException(ex.Message);
            }
        }
    }
}
