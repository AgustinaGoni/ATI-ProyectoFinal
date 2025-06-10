using Dominio.Excepciones;
using Dominio.Interfaces;
using Dominio.Validaciones;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Dominio.Entidades
{
    [Index(nameof(CorreoElectronico), IsUnique = true)]
    public class Usuario : IValidable<Usuario>
    {
        [Key]
        public int Id { get; set; }

        [Required]
        //[StringLength(50, ErrorMessage = "El nombre no puede tener más de 40 caracteres")]
        public string Nombre { get; set; }

        [Required]
        public string Apellido { get; set; }

        public string? Telefono { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }
        
        [Required]
        //[RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$", ErrorMessage = "La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un número y ser de al menos 6 caracteres")]
        public string Contrasenia { get; set; }

        [Required(ErrorMessage = "El correo electrónico es obligatorio")]
        [EmailAddress(ErrorMessage = "Formato de correo electrónico incorrecto")]
        //[RegularExpression(@"^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$", ErrorMessage = "Formato de correo electrónico incorrecto")]
        public string CorreoElectronico { get; set; }
        public bool EsAdmin { get; set; }

        public static string GetSHA256(string password)
        {
            SHA256 sha256Hash = SHA256.Create();
            // ComputeHash - returns byte array  
            byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));

            // Convert byte array to a string   
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < bytes.Length; i++)
            {
                builder.Append(bytes[i].ToString("x2"));
            }
            return builder.ToString();

        }

        //public bool Validar(Usuario UsuarioInput)
        //{
        //    string mail = UsuarioInput.CorreoElectronico;
        //    string password = UsuarioInput.Contrasenia;
        //    if (EsCorreoValido(CorreoElectronico) &&
        //        ValidarContrasenia(Contrasenia))
        //    {
        //        return true;
        //    }
        //    return false;
        //}

        //private bool EsTextoValido(string texto)
        //{
        //    var r = new Regex(@"^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{6,}$$");
        //    return r.Match(texto).Success ? true : false;
        //}

        //private bool EsCorreoValido(string texto)
        //{
        //    Regex rx = new Regex(
        //@"^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z{|}~])*@[a-zA-Z](-?[a-zA-Z0-9])*(\.[a-zA-Z](-?[a-zA-Z0-9])*)+$");
        //    return rx.Match(texto).Success ? true : false;
        //}

        //private bool ValidarContrasenia(string contrasenia)
        //{
        //    return EsTextoValido(contrasenia);
        //}

        public void Validar()
        {
            try
            {
                bool retEmail = VerificarEmail(this.CorreoElectronico);

                //bool retNombre = VerificarString(this.Nombre);
                //bool retApellido = VerificarString(this.Apellido);

                ValidarTexto.ValidarSoloTexto(Nombre);
                ValidarTexto.ValidarSoloVacio(Nombre);

                ValidarTexto.ValidarSoloTexto(Apellido);
                ValidarTexto.ValidarSoloVacio(Apellido);

                if (!retEmail)
                {
                    throw new UsuarioException("Formato de correo electrónico no válido");
                }

                if (Telefono != null)
                {
                    ValidarTelefono(Telefono);
                }
            }
            catch (Exception ex)
            {
                throw new UsuarioException(ex.Message);
            }
        }

        private void ValidarTelefono(string telefono)
        {
            // Definición del patrón regex
            var regex = new System.Text.RegularExpressions.Regex(@"^(2\d{7}|4\d{7}|09[1-9]\d{6})$");

            // Validación del número telefónico
            if (!regex.IsMatch(telefono.Trim()))
            {
                throw new UsuarioException("El número de teléfono proporcionado no es válido.");
            }
        }

        //private static bool VerificarString(string texto)
        //{
        //    // Verifica que el nombre no sea nulo o vacío
        //    if (string.IsNullOrWhiteSpace(texto))
        //        return false;

        //    // Verifica que el nombre solo contenga letras y espacios
        //    if (!System.Text.RegularExpressions.Regex.IsMatch(texto, @"^[a-zA-Z\s]+$"))
        //       return false;

        //    return true;
        //}

        //Metodo que valida un email, sacado de la página oficial de Microsoft
        /*
         * https://learn.microsoft.com/es-es/dotnet/standard/base-types/how-to-verify-that-strings-are-in-valid-email-format
        */
        public static bool VerificarEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;

            try
            {
                // Normalize the domain
                email = Regex.Replace(email, @"(@)(.+)$", DomainMapper,
                                      RegexOptions.None, TimeSpan.FromMilliseconds(200));

                // Examines the domain part of the email and normalizes it.
                string DomainMapper(Match match)
                {
                    // Use IdnMapping class to convert Unicode domain names.
                    var idn = new IdnMapping();

                    // Pull out and process domain name (throws ArgumentException on invalid)
                    string domainName = idn.GetAscii(match.Groups[2].Value);

                    return match.Groups[1].Value + domainName;
                }
            }
            catch (RegexMatchTimeoutException e)
            {
                return false;
            }
            catch (ArgumentException e)
            {
                return false;
            }

            try
            {
                return Regex.IsMatch(email,
                    @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
                    RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(250));
            }
            catch (RegexMatchTimeoutException)
            {
                return false;
            }
        }
     
    }

}