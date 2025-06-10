using AccesoDatos.EntityFramework;
using Dominio.Entidades;

namespace AllToImportSAS.Controllers.Servicios
{
    public class ServicioLog
    {
            private readonly AllToImportContext context;

            public ServicioLog(AllToImportContext context)
            {
                this.context = context;
            }

            public async Task GuardarLogAsync(string mensaje, string tipoEvento)
            {
            DateTime utcNow = DateTime.UtcNow;
            TimeZoneInfo localZone = TimeZoneInfo.FindSystemTimeZoneById("America/Montevideo");
            DateTime localTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, localZone);
            var log = new LogWebhook
                {
                    Fecha = DateTime.Now,
                    Mensaje = mensaje,
                    TipoEvento = tipoEvento,
                    
                };

                context.LogsWebhook.Add(log);
                await context.SaveChangesAsync();
            }
        
    }
}
