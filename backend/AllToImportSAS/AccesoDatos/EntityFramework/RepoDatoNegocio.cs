using Dominio.Entidades;
using Dominio.Excepciones;
using Dominio.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccesoDatos.EntityFramework
{
    public class RepoDatoNegocio : IRepoDatoNegocio

    {

        AllToImportContext db;

        public  RepoDatoNegocio(AllToImportContext db)
        {
            this.db = db;
        }

        public async Task<bool> Alta(DatosNegocio obj)
        {
            bool exito = false;
            try
            {
                obj.Validar();
                await db.DatosNegocios.AddAsync(obj);
                await db.SaveChangesAsync();
                exito = true;
            }
            catch (DatosNegocioException ex)
            {
                throw new DatosNegocioException (ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception("Ha ocurrido un error al dar de alta.");
            }
            return exito;
        }

        public async Task<DatosNegocio> BuscarPorId(int id)
        {
            try
            {
                return await db.DatosNegocios.Include(d => d.Direccion).FirstOrDefaultAsync(d => d.Id == id);
            }
            catch
            {
                throw new Exception("No se encuentra el dato del negocio");
            }
        }

        public async Task<IEnumerable<DatosNegocio>> BuscarTodo()
        {
            try
            {
                return await db.DatosNegocios.Include(d => d.Direccion).ToListAsync();
            }
            catch
            {
                throw new Exception("Error al cargar los datos del negocio");
            }
        }

        public async Task<bool> Eliminar(int id)
        {
            bool exito = false;
            try
            {
                var dato = await db.DatosNegocios.FindAsync(id);
                if (dato == null)
                {
                    return false;
                }
                db.DatosNegocios.Remove(dato);
                await db.SaveChangesAsync();
                exito = true;
            }
            catch (Exception ex)
            {
                throw new Exception("Ha ocurrido un error al eliminar el dato.");
            }
            return exito;
        }

        public async Task<bool> Modificar(DatosNegocio obj)
        {
            bool exito = false;
            try
            {
                obj.Validar();

                if (obj == null)
                    throw new Exception("Los datos a modificar no pueden ser nulos.");

                var datoExistente = await db.DatosNegocios.FindAsync(obj.Id);
                if (datoExistente != null)
                {
                    datoExistente.Horario = obj.Horario;
                    datoExistente.Nombre = obj.Nombre;
                    datoExistente.Direccion = obj.Direccion;
                    datoExistente.Telefono = obj.Telefono;

                    db.DatosNegocios.Update(datoExistente);
                    await db.SaveChangesAsync();
                    exito = true;
                }
            }
            catch (DbUpdateException ex)
            {
                throw new DbUpdateException(ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception("Ha ocurrido un error al modificar el dato del negocio");
            }
            return exito;
        }
    }
}
