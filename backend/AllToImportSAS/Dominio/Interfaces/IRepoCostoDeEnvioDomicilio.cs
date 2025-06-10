using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dominio.Interfaces
{
    public interface IRepoCostoDeEnvioDomicilio
    {
        Task<double> BuscarCostoEnvio();
        void Modificar(double costo);
    }
}
