using Dominio.Excepciones;
using System.Security.Cryptography;
using System.Text;

namespace AllToImportSAS.Controllers.DTO
{
    public class DTOUsuario
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string CorreoElectronico { get; set; }
        public string Contrasenia { get; set; }
        public string? Telefono { get; set; }
        public bool EsAdmin { get; set; }
        public string? Token { get; set; }

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
        internal static void VerificarContraseña(string contrasenia)
        {
            // Verifica que la contraseña no sea nula o vacía
            if (string.IsNullOrWhiteSpace(contrasenia))
                throw new UsuarioException("La contraseña no puede estar vacía.");

            // Verifica la longitud mínima
            if (contrasenia.Length < 8)
                throw new UsuarioException("La contraseña debe tener al menos 8 caracteres.");

            bool tieneMayuscula = false;
            bool tieneMinuscula = false;
            bool tieneDigito = false;
            bool tieneCaracterEspecial = false;

            foreach (char c in contrasenia)
            {
                if (char.IsUpper(c)) tieneMayuscula = true;
                if (char.IsLower(c)) tieneMinuscula = true;
                if (char.IsDigit(c)) tieneDigito = true;
                if (!char.IsLetterOrDigit(c)) tieneCaracterEspecial = true;

                // Si todas las condiciones se cumplen, podemos detener el loop
                if (tieneMayuscula && tieneMinuscula && tieneDigito && tieneCaracterEspecial)
                    return;
            }

            // Si alguna condición no se cumple, lanzar una excepción con un mensaje genérico o detallado
            throw new UsuarioException("La contraseña debe tener al menos una letra mayúscula, una minúscula, un número, y un carácter especial.");
        }

        //internal static bool VerificarContraseña(string contrasenia)
        //{
        //    bool ret = false;
        //    bool tieneMayuscula = false;
        //    bool tieneMinuscula = false;
        //    bool tieneDigito = false;

        //    if (contrasenia.Length > 6)
        //    {
        //        for (int i = 0; i < contrasenia.Length; i++)
        //        {
        //            char c = contrasenia[i];
        //            if (Char.IsUpper(c))
        //            {
        //                tieneMayuscula = true;
        //            }
        //            else if (Char.IsLower(c))
        //            {
        //                tieneMinuscula = true;
        //            }
        //            else if (Char.IsDigit(c))
        //            {
        //                tieneDigito = true;
        //            }
        //        }
        //        if (tieneMayuscula && tieneMinuscula && tieneDigito)
        //        {
        //            ret = true;
        //        }

        //    }
        //    return ret;
        //}
    }

}
