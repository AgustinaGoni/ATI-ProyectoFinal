using Dominio.Excepciones;
using Dominio.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dominio.Entidades
{
    [Owned]
    public class Direccion: IValidable<Direccion>
    {
        public int Id { get; set; }
        public string Departamento { get; set; }
        public string Ciudad { get; set; }
        public string Calle { get; set; }
        public string NroPuerta { get; set; }
        public string CodigoPostal { get; set; }
        public string? NroApartamento { get; set; }
        public string? Comentario { get; set; }


        public Direccion()
        {
        }

        public Direccion(string calle, string ciudad, string departamento, string codigoPostal, string nroPuerta)
        {
            Departamento = departamento;
            Ciudad = ciudad;
            Calle = calle;
            NroPuerta = nroPuerta;
            CodigoPostal = codigoPostal;
        }

        public void Validar()
        {
            if (string.IsNullOrWhiteSpace(Departamento))
            {
                throw new DireccionException("El campo 'Departamento' es obligatorio.");
            }

            if (string.IsNullOrWhiteSpace(Ciudad))
            {
                throw new DireccionException("El campo 'Ciudad' es obligatorio.");
            }

            if (string.IsNullOrWhiteSpace(Calle))
            {
                throw new DireccionException("El campo 'Calle' es obligatorio.");
            }

            if (string.IsNullOrWhiteSpace(NroPuerta))
            {
                throw new DireccionException("El campo 'Número de Puerta' es obligatorio.");
            }

            // Validación del Código Postal
            if (string.IsNullOrWhiteSpace(CodigoPostal))
            {
                throw new DireccionException("El campo 'Código Postal' es obligatorio.");
            }
            if (CodigoPostal.Length > 5)
            {
                throw new DireccionException("El 'Código Postal' no puede tener más de 5 dígitos.");
            }
            if (!int.TryParse(CodigoPostal, out _))
            {
                throw new DireccionException("El 'Código Postal' debe ser numérico.");
            }
            if (Comentario != null && Comentario.Length > 500)
            {
                throw new DireccionException("El 'Comentario' no puede tener más de 500 caracteres.");
            }
        }
    }
}
