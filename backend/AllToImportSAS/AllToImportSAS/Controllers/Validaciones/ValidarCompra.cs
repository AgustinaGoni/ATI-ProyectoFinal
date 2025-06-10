using AllToImportSAS.Controllers.DTO;
using Dominio.Excepciones;
using Dominio.Interfaces;

namespace AllToImportSAS.Controllers.Validaciones
{
    public class ValidarCompra
    {
        private readonly IRepoProducto repoProducto;
        private readonly IRepoUsuario repoUsuario;

        public ValidarCompra(IRepoProducto repoProducto, IRepoUsuario repoUsuario)
        {
            this.repoProducto = repoProducto;
            this.repoUsuario = repoUsuario;
        }

        public async Task ValidarDatosDelCarrito(DTOCarrito carrito)
        {

            // Validar datos básicos del carrito
            ValidarCarritoBasico(carrito);

            // Validar productos
            await ValidarProductos(carrito.Productos);

            // Validar cliente
            await ValidarCliente(carrito.Cliente.IdCliente);

            // Validar opciones de envío
            await ValidarOpcionEnvio(carrito);

            //Valida que exista Rut y Razon social
            ValidarRutRazonSocial(carrito);

        }

        private static void ValidarRutRazonSocial(DTOCarrito carrito)
        {
            if (!string.IsNullOrEmpty(carrito.Cliente.Rut) && string.IsNullOrEmpty(carrito.Cliente.RazonSocial))
            {
                throw new CompraException("Si se proporciona un RUT, también debe proporcionarse una Razón Social.");
            }

            if (!string.IsNullOrEmpty(carrito.Cliente.RazonSocial) && string.IsNullOrEmpty(carrito.Cliente.Rut))
            {
                throw new CompraException("Si se proporciona una Razón Social, también debe proporcionarse un RUT.");
            }
        }

        private void ValidarCarritoBasico(DTOCarrito carrito)
        {
            if (carrito == null) throw new CompraException("Datos del carrito inválidos.");
            if (carrito.Productos == null || carrito.Productos.Count == 0) throw new CompraException("No hay productos seleccionados.");
            if (carrito.Cliente == null) throw new CompraException("Los datos del cliente son necesarios.");
        }

        private async Task ValidarProductos(List<DTOProducto> productos)
        {
            foreach (var producto in productos)
            {
                if (producto.Id <= 0) throw new CompraException("Id del producto inválido.");
                var p = await repoProducto.BuscarPorId(producto.Id) ?? throw new CompraException("El producto no existe.");
                if (string.IsNullOrEmpty(producto.Nombre)) throw new CompraException("El producto no contiene un nombre.");
                if (producto.PrecioUnitario <= 0) throw new CompraException("Precio del producto no válido.");
                if (producto.Cantidad <= 0) throw new CompraException("Cantidad del producto no válida.");
                if (producto.Cantidad > p.Stock) throw new CompraException("No hay stock disponible.");
            }
        }

        private async Task ValidarCliente(int idCliente)
        {
            var cliente = await repoUsuario.BuscarClientePorId(idCliente) ?? throw new UsuarioException("No se ha encontrado al usuario.");
        }

        private async Task ValidarOpcionEnvio(DTOCarrito carrito)
        {
            if (string.IsNullOrEmpty(carrito.OpcionEnvio)) throw new CompraException("No se ha seleccionado ninguna opción de envío.");
            if (carrito.OpcionEnvio != "domicilio" && carrito.OpcionEnvio != "retiro") throw new CompraException("Opción de envío incorrecta.");

            if (carrito.OpcionEnvio == "domicilio")
            {
                await ValidarEnvioDomicilio(carrito.EnvioDomicilio);
            }
            else if (carrito.OpcionEnvio == "retiro")
            {
                ValidarRetiroCompra(carrito.RetiroCompra);
            }
        }

        private async Task ValidarEnvioDomicilio(DTOEnvioDomicilio envioDomicilio)
        {
            if (envioDomicilio == null) throw new CompraException("Datos de envío a domicilio inválidos.");
            var direccion = await repoUsuario.BuscarDireccion(envioDomicilio.IdDireccion);
            if (direccion == null) throw new CompraException("Dirección de envío no encontrada.");
        }

        private static void ValidarRetiroCompra(DTORetiroCompra retiroCompra)
        {
            if (retiroCompra == null) throw new CompraException("Datos de retiro inválidos.");
            if (string.IsNullOrEmpty(retiroCompra.NumeroDocumento)) throw new CompraException("Número de documento inválido.");
            if (string.IsNullOrEmpty(retiroCompra.NombreApellido)) throw new CompraException("Nombre y apellido son necesarios para el retiro.");
        }
    }
}
