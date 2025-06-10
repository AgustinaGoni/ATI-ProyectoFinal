using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dominio.Entidades
{
    [Index(nameof(DocumentoIdentidad), IsUnique = true)]
    public class Cliente : Usuario
    {
        public string? RUT {  get; set; }
        public string? RazonSocial { get; set; }
        public List<Direccion> Direcciones { get; set; }
        public string? DocumentoIdentidad { get; set; }
        //public List<Compra>? HistorialCompras {  get; set; }


        // Método principal para validar la cédula
        public static bool ValidarCedula(string documentoIdentidad)
        {
            // Eliminar espacios y caracteres no numéricos
            documentoIdentidad = new string(documentoIdentidad.Where(char.IsDigit).ToArray());

            // Verificar si la cédula tiene 8 dígitos
            if (documentoIdentidad.Length != 8)
            {
                return false;
            }

            // Convertir la cédula a un array de enteros
            int[] cedulaNumeros = documentoIdentidad.Select(digito => int.Parse(digito.ToString())).ToArray();

            // Realizar la validación con el algoritmo específico
            int suma = 0;
            int[] factores = { 2, 9, 8, 7, 6, 5, 4, 3 };

            for (int i = 0; i < 8; i++)
            {
                suma += cedulaNumeros[i] * factores[i];
            }

            int modulo = suma % 10;
            int digitoVerificador = (modulo == 0) ? 0 : 10 - modulo;

            // El dígito verificador es el último dígito de la cédula
            return digitoVerificador == cedulaNumeros[7];
        }
    }
}
