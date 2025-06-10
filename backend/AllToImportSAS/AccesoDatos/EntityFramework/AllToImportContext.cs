using Dominio.Entidades;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace AccesoDatos.EntityFramework
{
    public class AllToImportContext : DbContext
    {
        #region DbSets
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Funcionario> Funcionarios { get; set; }
        public DbSet<Compra> Compras { get; set; }
        public DbSet<Producto> Productos { get; set; }
        //public DbSet<RetiroCompra> RetirosCompra {  get; set; }
        //public DbSet<EnvioDomicilio> EnvioDomicilio { get; set; }
        public DbSet<TipoEntrega> TipoEntregas { get; set; }
        public DbSet<ItemCompra> ItemsCompra { get; set; }
        public DbSet<DatosNegocio> DatosNegocios { get; set; }
        public DbSet<Direccion> Direcciones { get; set; }

        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<LogWebhook> LogsWebhook { get; set; }
        public DbSet<CompraPendiente> ComprasPendientes { get; set; }
        public DbSet<CostoDeEnvioDomicilio> CostoDeEnvioDomicilio { get; set; }

        #endregion

        public AllToImportContext(DbContextOptions<AllToImportContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
            //modelBuilder.Entity<Usuario>();
            modelBuilder.Entity<TipoEntrega>()
       .ToTable("TipoEntregas")
       .HasDiscriminator<string>("TipoDeEntrega")
       .HasValue<EnvioDomicilio>("EnvioDomicilio")
       .HasValue<RetiroCompra>("RetiroCompra");

            modelBuilder.Entity<RetiroCompra>()
           .HasOne(c => c.DatosNegocio)
           .WithMany()
           .HasForeignKey(c => c.DatosNegocioId)
           .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
