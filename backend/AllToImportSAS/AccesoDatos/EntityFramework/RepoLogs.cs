using Dominio.Entidades;
using Dominio.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccesoDatos.EntityFramework
{
    public class RepoLogs : IRepoLog
    {
        private readonly AllToImportContext context;

        public RepoLogs(AllToImportContext context)
        {
            this.context = context;
        }

        public async Task GuardarLogAsync(LogWebhook log)
        {
            context.LogsWebhook.Add(log);
            await context.SaveChangesAsync();
        }

    }
}
