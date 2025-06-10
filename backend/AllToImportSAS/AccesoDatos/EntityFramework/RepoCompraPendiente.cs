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
    public class RepoCompraPendiente : IRepoCompraPendiente
    {
        AllToImportContext db;

        public RepoCompraPendiente(AllToImportContext db)
        {
            this.db = db;
        }

        public async Task AgregarCompraPendiente(CompraPendiente compraPendiente)
        {
            try
            {

                db.ComprasPendientes.Add(compraPendiente);
                await db.SaveChangesAsync();
            }
            catch (Exception ex) {
                throw new Exception(ex.Message);
            }
        }

        public async Task<CompraPendiente> ObtenerCompraPendienteByReferencia(string externalReference)
        {
            return await db.ComprasPendientes.FirstOrDefaultAsync(cp => cp.ExternalReference == externalReference);
        }

        public async Task SaveChangesAsync()
        {
            await db.SaveChangesAsync();
        }

        public async Task<CompraPendiente> ObtenerCompraPendienteByPaymentId(long paymentId)
        {
            return await db.ComprasPendientes.FirstOrDefaultAsync(cp => cp.PaymentId == paymentId);
        }
    }
}
