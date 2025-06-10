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
    public class RepoCategorias : IRepoCategoria
    {
        AllToImportContext db;

        public RepoCategorias(AllToImportContext db)
        { this.db = db; }

        public async Task<bool> Alta(Categoria obj)
        {
            try
            {
                obj.Validar();
                db.Categorias.Add(obj);
                await db.SaveChangesAsync();
                return true;
            }
            catch(CategoriaException ex)
            {
                throw new CategoriaException(ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<Categoria> BuscarPorId(int id)
        {
            try
            {
                var cat = await db.Categorias.FindAsync(id);
                return cat;
            }
            catch
            {
                throw new Exception("No se encuentra la categoria");
            }
        }

        public async Task<IEnumerable<Categoria>> BuscarTodo()
        {
            try
            {
                return await db.Categorias.ToListAsync();
            }
            catch
            {
                throw new Exception("No hay categorias en el sistema");
            }
        }

        public async Task<bool> Eliminar(int id)
        {
            try
            {
                Categoria cat = await BuscarPorId(id);
                if (cat is null)
                {
                    return false;
                }
                db.Remove(cat);
                await db.SaveChangesAsync();
                return true;
            }
            catch
            {
                throw new Exception("No se elimina el usuario");
            }
        }

        public async Task Modificar(int id,Categoria obj)
        {
            try
            {
                obj.Validar();

                if (obj == null)
                    throw new Exception("Los datos a modificar no pueden ser nulos.");

                Categoria cat = await db.Categorias.FindAsync(id);

                cat.Nombre = obj.Nombre;
                cat.Descripcion = obj.Descripcion;
                await db.SaveChangesAsync();
                //exito = true;
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
