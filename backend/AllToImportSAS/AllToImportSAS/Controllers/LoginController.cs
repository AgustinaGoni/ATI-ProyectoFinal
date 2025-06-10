using AllToImportSAS.Controllers.DTO;
using AllToImportSAS.Controllers.ReCAPTCHA;
using Dominio.Entidades;
using Dominio.Excepciones;
using Dominio.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AllToImportSAS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class LoginController : Controller
    {
        private readonly IRepoUsuario repoUsuarios;
        private readonly IConfiguration configuration;

        public LoginController(IRepoUsuario repoUsuarios, IConfiguration configuration)
        {
            this.repoUsuarios = repoUsuarios;
            this.configuration = configuration;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<DTORespuestaLogin>> Login(LoginModel usuLogin)
        {
            try
            {
                if (!await CaptchaResponse.VerifyCaptcha(usuLogin.CaptchaToken))
                {
                    return BadRequest("Captcha inválido.");
                }

                Usuario usuario = repoUsuarios.ValidarLogin(usuLogin.Correo, usuLogin.Clave);

                if (usuario == null)
                {
                    return Unauthorized("Credenciales inválidas");
                }

                //// Generar el token JWT
                //var claims = new[]
                //{
                //    new Claim(JwtRegisteredClaimNames.Sub, Convert.ToString(usuario.Id)),
                //    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                //};

                //var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
                //var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                //var token = new JwtSecurityToken(
                //    issuer: configuration["Jwt:Issuer"],
                //    audience: configuration["Jwt:Audience"],
                //    claims: claims,
                //    expires: DateTime.Now.AddMinutes(Convert.ToDouble(configuration["Jwt:ExpireMinutes"])),
                //    signingCredentials: creds);

                //var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

                var tokenString = GenerarToken(usuLogin, usuario);



                var respuestaLogin = new DTORespuestaLogin
                {
                    Token = tokenString,
                    EsAdmin = usuario.EsAdmin
                };

                return Ok(respuestaLogin);
            }
            catch (UsuarioException ex)
            {
                return BadRequest(ex.Message);
            }

            catch (SqlException ex)
            {
                return BadRequest("Ocurrio un error en el servidor.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }


        private string GenerarToken(LoginModel usuLogin, Usuario usuario)
        {
            try
            {
                // Generar el token JWT
                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, Convert.ToString(usuario.Id)),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: configuration["Jwt:Issuer"],
                    audience: configuration["Jwt:Audience"],
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(Convert.ToDouble(configuration["Jwt:ExpireMinutes"])),
                    signingCredentials: creds);

                var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
                return tokenString;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        //[HttpPost]
        //[AllowAnonymous]
        //public async Task<ActionResult<DTORespuestaLogin>> Login(LoginModel loginModel)
        //{


        //    // Aquí deberías validar las credenciales del usuario
        //    Usuario usuario = repoUsuarios.ValidarLogin(loginModel.Correo, loginModel.Clave);

        //    if (usuario == null)
        //    {
        //        return Unauthorized("Credenciales inválidas");
        //    }

        //    // Generar el token JWT
        //    var claims = new[]
        //    {
        //    new Claim(JwtRegisteredClaimNames.Sub, Convert.ToString(usuario.Id)),
        //    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        //    };

        //    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
        //    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        //    var token = new JwtSecurityToken(
        //        issuer: configuration["Jwt:Issuer"],
        //        audience: configuration["Jwt:Audience"],
        //        claims: claims,
        //        expires: DateTime.Now.AddMinutes(Convert.ToDouble(configuration["Jwt:ExpireMinutes"])),
        //        signingCredentials: creds);

        //    var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        //    var respuestaLogin = new DTORespuestaLogin
        //    {
        //        Token = tokenString,
        //        EsAdmin = usuario.EsAdmin
        //    };

        //    return Ok(respuestaLogin);
        //}




        //[HttpGet("verificar_usuario")]
        //public IActionResult VerificarUsuario()
        //{
        //    if (User.Identity != null && User.Identity.IsAuthenticated)
        //    {
        //        return Ok(new { authenticated = true, user = User.Identity.Name });
        //    }
        //    else
        //    {
        //        return Unauthorized(new { authenticated = false });
        //    }
        //}


    }

    //public class CaptchaResponse
    //{
    //    public bool Success { get; set; }
    //    public List<string> ErrorCodes { get; set; }
    //}


}
