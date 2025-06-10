using Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dominio.Interfaces
{
    public interface IRepoCompraPendiente
    {
        Task AgregarCompraPendiente(CompraPendiente compraPendiente);
        Task<CompraPendiente> ObtenerCompraPendienteByReferencia(string externalReference);
        Task SaveChangesAsync();
        public Task<CompraPendiente> ObtenerCompraPendienteByPaymentId(long paymentId);
    }
}
