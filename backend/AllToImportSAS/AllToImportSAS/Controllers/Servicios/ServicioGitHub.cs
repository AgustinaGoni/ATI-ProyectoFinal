using Octokit;
using System;
using System.IO;
using System.Threading.Tasks;

namespace AllToImportSAS.Controllers.Servicios
{
    public class ServicioGitHub
    {
        private readonly GitHubClient _cliente;
        private readonly string _propietario;
        private readonly string _repositorio;

        public ServicioGitHub(string token, string propietario, string repositorio)
        {
            _cliente = new GitHubClient(new ProductHeaderValue("AllToImportSAS"))
            {
                Credentials = new Credentials(token)
            };
            _propietario = propietario;
            _repositorio = repositorio;
        }

        public async Task<string> DescargarArchivoAsync(string rutaArchivo)
        {
            var contenido = await _cliente.Repository.Content.GetAllContents(_propietario, _repositorio, rutaArchivo);
            var contenidoArchivo = contenido[0].Content;
            return contenidoArchivo;
        }
    }
}
