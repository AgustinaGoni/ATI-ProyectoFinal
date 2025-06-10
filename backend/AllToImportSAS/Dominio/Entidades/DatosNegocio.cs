using Dominio.Excepciones;
using Dominio.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Dominio.Entidades
{
    public class DatosNegocio: IValidable<DatosNegocio>
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public Direccion Direccion { get; set; }
        public string Telefono {  get; set; }
        //public string Celular {  get; set; }
        public string Horario {  get; set; }




        public void Validar()
        {
            
            if (string.IsNullOrWhiteSpace(Nombre))
            {
                throw new DatosNegocioException("El campo 'Nombre' es obligatorio.");
            }
            if (Nombre.Length < 3 || Nombre.Length > 100)
            {
                throw new DatosNegocioException("El 'Nombre' debe tener entre 3 y 100 caracteres.");
            }

            if (string.IsNullOrWhiteSpace(Telefono))
            {
                throw new DatosNegocioException("El campo 'Telefono' es obligatorio.");
            }
            if (Telefono.Length < 8 || Telefono.Length > 9)
            {
                throw new DatosNegocioException("El 'Telefono' debe tener entre 8 y 9 dígitos.");
            }
            if (!long.TryParse(Telefono, out _))
            {
                throw new DatosNegocioException("El 'Telefono' debe contener solo números.");
            }

            // Validación del Horario
            if (string.IsNullOrWhiteSpace(Horario))
            {
                throw new DatosNegocioException("El campo 'Horario' es obligatorio.");
            }
            
            Direccion.Validar();
        }
    }



    
}
