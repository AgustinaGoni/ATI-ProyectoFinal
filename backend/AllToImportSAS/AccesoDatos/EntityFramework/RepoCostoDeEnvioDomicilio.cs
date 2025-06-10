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
    public class RepoCostoDeEnvioDomicilio : IRepoCostoDeEnvioDomicilio
    {
        AllToImportContext db;

        public RepoCostoDeEnvioDomicilio(AllToImportContext db)
        {
            this.db = db;
        }

        public async Task<double> BuscarCostoEnvio()
        {
            try
            {
                CostoDeEnvioDomicilio costo = await db.CostoDeEnvioDomicilio.FirstOrDefaultAsync();
                if(costo == null)
                {
                    throw new Exception("No hay datos de costo en el sistema");
                }

                double c = costo.EnvioMontevideo;
                return c;
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async void Modificar(double costo)
        {
           
            try
            { 
                CostoDeEnvioDomicilio c = await db.CostoDeEnvioDomicilio.FirstOrDefaultAsync();
                if (c == null)
                {
                    throw new Exception("No hay datos de costo en el sistema");
                }

            
                c.EnvioMontevideo = costo;
                await db.SaveChangesAsync();

            }
            catch(DbUpdateException ex)
            {
                throw new DbUpdateException(ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
