using Microsoft.Extensions.Options;
using SendGrid.Helpers.Mail;
using SendGrid;
using Dominio.Entidades;
using AllToImportSAS.Controllers.DTO;
using System.Threading.Channels;
using Microsoft.Extensions.DependencyInjection;
using Observer;
using AccesoDatos.EntityFramework;
using Dominio.Interfaces;

namespace AllToImportSAS.Controllers.Servicios
{
    public class ServicioEmail
    {
        private readonly SendGridConfiguracion sendGridSettings;
        private readonly ServicioLog servicioLog;
        private IRepoCompra repoCompras;
        private readonly IRepoUsuario repoUsuario;
        private readonly IRepoDatoNegocio repoNegocio;
        private readonly IServiceScopeFactory scopeFactory;


        public ServicioEmail(IOptions<SendGridConfiguracion> sendGridSettings, ServicioLog servicioLog, IRepoCompra repoCompras, IServiceScopeFactory scopeFactory, IRepoUsuario repoUsuario, IRepoDatoNegocio repoNegocio)
        {
            this.sendGridSettings = sendGridSettings.Value;
            this.servicioLog = servicioLog;
            this.repoCompras = repoCompras;
            this.scopeFactory = scopeFactory;
            //this.repoCompras.Subscribir(this);
            this.repoUsuario = repoUsuario;
            this.repoNegocio = repoNegocio;
        }


        public async Task EnviarCorreoBajoStock(List<Producto> productosConBajoStock)
        {
            var apiKey = sendGridSettings.ApiKey;
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress(sendGridSettings.SenderEmail, sendGridSettings.SenderName);
            var subject = "Alerta de bajo stock: varios productos";
            var to = new EmailAddress("agusgoni@mailinator.com"); // Cambia a la dirección de correo de la empresa

            var plainTextContent = "Los siguientes productos tienen un stock bajo:\n";
            var htmlContent = @"
                                <html>
                                    <body>
                                        <h1>Alerta de bajo stock</h1>
                                        <p>Los siguientes productos tienen un stock bajo:</p>
                                        <ul>";

                                        foreach (var producto in productosConBajoStock)
                                        {
                                            plainTextContent += $"{producto.Nombre}: {producto.Stock} unidades\n";
                                            htmlContent += $"<li>{producto.Nombre}: {producto.Stock} unidades</li>";
                                        }

                                        htmlContent += @"
                                        </ul>
                                        <p>Por favor, considere realizar un nuevo pedido para reponer el stock.</p>
                                    </body>
                                </html>";

            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);
        }


        public async Task SendLowStockEmail(string productName, int stock)
        {
            var apiKey = sendGridSettings.ApiKey;
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress(sendGridSettings.SenderEmail, sendGridSettings.SenderName);
            var subject = $"Alerta de bajo stock: {productName}";
            var to = new EmailAddress("agusgoni@mailinator.com"); // Cambia a la dirección de correo de la empresa
            var plainTextContent = $"El stock del producto {productName} es bajo: quedan {stock} unidades.";
            var htmlContent = $@"
            <html>
                <body>
                    <h1>Alerta de bajo stock</h1>
                    <p>El stock del producto <strong>{productName}</strong> es bajo: quedan <strong>{stock}</strong> unidades.</p>
                    <p>Por favor, considere realizar un nuevo pedido para reponer el stock.</p>
                </body>
            </html>";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            //var client = new SendGridClient(sendGridSettings.ApiKey);
            //var from = new EmailAddress(sendGridSettings.SenderEmail, sendGridSettings.SenderName);
            //var to = new EmailAddress(toEmail);
            //var msg = MailHelper.CreateSingleEmail(from, to, subject, null, body);
            //var response = await client.SendEmailAsync(msg);

            var apiKey = sendGridSettings.ApiKey;
            var client = new SendGridClient(apiKey);
            //var from = new EmailAddress("agusgc11@gmail.com", "Send");
            var from = new EmailAddress(sendGridSettings.SenderEmail, sendGridSettings.SenderName);
            //var subject = subject1;
            //var to = new EmailAddress("alltoimportsas@gmail.com", "");
            var to = new EmailAddress(toEmail);
            var plainTextContent = "probando sgc";
            var htmlContent = "<strong>and easy to do anywhere, even with C#</strong>";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, body);
            var response = await client.SendEmailAsync(msg);


            if (response.StatusCode != System.Net.HttpStatusCode.OK && response.StatusCode != System.Net.HttpStatusCode.Accepted)
            {
                throw new Exception("No se pudo enviar el correo electrónico.");
            }
        }


        //TODO DE DONDE MANDAR EL MAIL 
        public async Task EnviarCorreoConfirmacionCompra(Compra compra, string correoComprador, string correoVendedor)
        {
            try
            {
                await servicioLog.GuardarLogAsync($"Llego a metodo EnviarCorreoConfirmacionCompra. Correo: {correoComprador} - Fecha: {compra.FechaCompra}", "InfoServicioEmail");

                var tipoEntrega = compra.TipoEntrega.GetType().Name switch
                {
                    "RetiroCompra" => "Retiro en persona",
                    "EnvioDomicilio" => "Envío a domicilio",
                    _ => "Otro tipo de entrega"
                };

                // Inicializa la variable para la dirección de entrega
                string datosEnvio = "";

                // Verifica si el tipo de entrega es EnvioDomicilio y asigna la dirección
                if (compra.TipoEntrega is EnvioDomicilio envioDomicilio)
                {
                    Direccion? direccion = await repoUsuario.BuscarDireccion(envioDomicilio.IdDireccion);

                    datosEnvio = $@"
                    <p><b>Departamento:</b> {direccion.Departamento}</p>
                    <p><b>Ciudad:</b> {direccion.Ciudad}</p>
                    <p><b>Calle:</b> {direccion.Calle}</p>
                    <p><b>Nro. de puerta:</b> {direccion.NroPuerta}</p>
                    {(string.IsNullOrEmpty(direccion.NroApartamento) ? "" : $"<b><p>Nro. de apartamento:</b> {direccion.NroApartamento}</p>")}
                    <p><b>Código Postal:</b> {direccion.CodigoPostal}</p>
                    {(string.IsNullOrEmpty(direccion.Comentario) ? "" : $"<b><p>Comentario:</b> {direccion.Comentario}</p>")}
                    ";
                }
                else if (compra.TipoEntrega is RetiroCompra retiroCompra)
                {
                    DatosNegocio? datosNegocio = await repoNegocio.BuscarPorId(retiroCompra.DatosNegocioId);
                    datosEnvio = $@"
                    <p><b>Nombre de quien retira:</b> {retiroCompra.NombreApellido}</p>
                    <p><b>Documento de identidad:</b> {retiroCompra.DocumentoCliente}</p>
                    <p><b>Lugar de retiro:</b></p>
                    <ul>
                    <li><b>Lugar:</b> {datosNegocio.Nombre}</li>                    
                    <li><b>Horario:</b> {datosNegocio.Horario}</li>
                    <li><b>Teléfono:</b> {datosNegocio.Telefono}</li>
                    <li><b>Dirección retiro:</b> {datosNegocio.Direccion.Calle} {datosNegocio.Direccion.NroPuerta}, 
                                  {datosNegocio.Direccion.Ciudad} {datosNegocio.Direccion.CodigoPostal}, 
                                  {datosNegocio.Direccion.Departamento}</li>
                    {(string.IsNullOrEmpty(retiroCompra.Comentario) ? "" : $"<b><li>Comentario:</b> {retiroCompra.Comentario}</li>")}
                    </ul>
                    ";
                }

                //string contenido = $@"

                //                        <p><b>Detalles de la compra</b></p>
                //                        <p><b>Nro de orden:</b> {compra.Id}</p>
                //                        <p><b>Fecha de compra:</b> {compra.FechaCompra}</p>
                //                        <p><b>Datos de facturación</b></p>
                //                        <p><b>Nombre:</b> {compra.Cliente.Nombre} {compra.Cliente.Apellido}</p>
                //                        <p><b>Teléfono:</b> {compra.Cliente.Telefono}</p>
                //                        <p><b>Documento de identidad:</b> {compra.Cliente.DocumentoIdentidad}</p>
                //                        {(string.IsNullOrEmpty(compra.RazonSocial) ? "" : $"<b><p>Razon Social:</b> {compra.RazonSocial}</p>")}
                //                         {(string.IsNullOrEmpty(compra.Rut) ? "" : $"<b><p>RUT:</b> {compra.Rut}</p>")}

                //                        <p><b>Productos</b></p>
                //                        <table cellpadding='5' cellspacing='0'>
                //                        <thead>
                //                            <tr>
                //                                <th>Producto</th>                                                
                //                                <th>Precio</th>
                //                                <th>Cantidad</th>
                //                            </tr>
                //                        </thead>
                //                        <tbody>
                //                            {string.Join("", compra.ItemsCompra
                //                            .Select(item =>
                //                            $"<tr>" +
                //                            $"<td>{item.Producto.Nombre}</td>" +
                //                            $"<td>{item.Producto.Precio}</td>" +
                //                            $"<td>{item.Cantidad} unidades</td>" +
                //                            $"</tr>")
                //                            )}
                //                        </tbody>
                //                         </table>
                //                         <p>Importe total: ${compra.TotalComprado}</p>

                //                         <p><b>Datos de envío</b></p>
                //                        <p><b>Tipo de entrega:</b> {tipoEntrega}</p>
                //                        {datosEnvio}

                //                ";

                string contenido = $@"
                                    <style>
                                        p {{
                                            margin: 5px 0;
                                        }}
                                        b {{
                                            color: #555;
                                        }}
                                        table {{
                                            width: 100%;
                                            border-collapse: collapse;
                                            margin-top: 10px;
                                        }}
                                        th, td {{
                                            border: 1px solid #ddd;
                                            padding: 8px;
                                            text-align: left;
                                        }}
                                        th {{
                                            background-color: #f2f2f2;
                                            font-weight: bold;
                                        }}
                                        tr:nth-child(even) {{
                                            background-color: #f9f9f9;
                                        }}
                                        .total {{
                                            font-weight: bold;
                                            font-size: 16px;
                                            margin-top: 10px;
                                        }}
                                        .header {{
                                            background-color: #333;
                                            color: white;
                                            padding: 10px;
                                            text-align: center;
                                            font-size: 18px;
                                        }}
                                        ul {{
                                            padding-left: 20px;
                                            margin: 5px 0;
                                        }}
                                        ul li {{
                                            margin: 3px 0;
                                        }}
                                    </style>

                                    <div style='padding: 16px;'>
                                        <div class='header'>Detalles de la compra #{compra.Id}</div>

                                        <p><b>Fecha de compra:</b> {compra.FechaCompra}</p>

                                        <div style='margin-top: 20px;'>
                                            <p><b>Datos de facturación</b></p>
                                            <p><b>Nombre:</b> {compra.Cliente.Nombre} {compra.Cliente.Apellido}</p>
                                            <p><b>Teléfono:</b> {compra.Cliente.Telefono}</p>
                                            <p><b>Documento de identidad:</b> {compra.Cliente.DocumentoIdentidad}</p>
                                            {(string.IsNullOrEmpty(compra.RazonSocial) ? "" : $"<p><b>Razón Social:</b> {compra.RazonSocial}</p>")}
                                            {(string.IsNullOrEmpty(compra.Rut) ? "" : $"<p><b>RUT:</b> {compra.Rut}</p>")}
                                        </div>
                                        <div style='margin-top: 20px;'>
                                            <p><b>Datos de envío</b></p>
                                            <p><b>Tipo de entrega:</b> {tipoEntrega}</p>
                                            {datosEnvio}
                                        </div>
                                        <div style='margin-top: 20px;'>
                                            <p><b>Productos</b></p>
                                            <table cellpadding='5' cellspacing='0'>
                                                <thead>
                                                    <tr>
                                                        <th>Producto</th>                                                
                                                        <th>Precio</th>
                                                        <th>Cantidad</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {string.Join("", compra.ItemsCompra
                                                        .Select(item =>
                                                        $"<tr>" +
                                                        $"<td>{item.Producto.Nombre}</td>" +
                                                        $"<td>${item.Producto.Precio}</td>" +
                                                        $"<td>{item.Cantidad} unidades</td>" +
                                                        $"</tr>")
                                                    )}
                                                </tbody>
                                            </table>
                                            <p class='total'>Importe total: ${compra.TotalComprado}</p>
                                        </div>
                                    </div>
                                ";


                var apiKey = sendGridSettings.ApiKey;
                var client = new SendGridClient(apiKey);
                var from = new EmailAddress(sendGridSettings.SenderEmail, sendGridSettings.SenderName);
                var subject = "Confirmación de compra All To Import";
                var plainTextContentComprador = $"Gracias por su compra. Su pedido ha sido recibido.";
                var htmlContentComprador = $@"
                                <html>
                                    <body style='color: #333; background: #f7fafc; padding: 16px;'>
                                        <h1 style='color: #333; padding: 16px;'>Su compra a sido confirmada correctamente.</h1>
                                        {contenido}
                                        <div style='margin-top: 20px; color: #333; padding: 16px;'>
                                            <p style=' margin: 5px 2px;'>Si tienes alguna duda sobre el pedido puede comunicarte por whatsapp al <b style='color: #555;'>098633195</b> o enviar un mail a <b style='color: #555;'>alltoimportsas@gmail.com</b></p>
                                             <div style='background-color: #333; color: white; padding: 10px;text-align: center; font-size: 18px;'>
                                              <p >ALL TO IMPORT SAS</p>
                                             </div>
                                        </div
                                    </body>
                                </html>";


                var plainTextContentVendedor = $"Se ha realizado una nueva compra";
                var htmlContentVendedor = $@"
                                <html>
                                    <body style='color: #333; background: #f7fafc;'>
                                        <h1 style='color: #333; padding: 16px;'>Se realizo una nueva compra realizada</h1>
                                       {contenido}
                                    </body>
                                </html>";

                // Enviar correo al comprador
                var msg = MailHelper.CreateSingleEmail(from, new EmailAddress(correoComprador), subject, plainTextContentComprador, htmlContentComprador);
                await client.SendEmailAsync(msg);

                // Enviar correo al vendedor
                var clientMsg = MailHelper.CreateSingleEmail(from, new EmailAddress(correoVendedor), subject, plainTextContentVendedor, htmlContentVendedor);
                await client.SendEmailAsync(clientMsg);
            }
            catch (Exception ex)
            {
                await servicioLog.GuardarLogAsync($"Error EnviarCorreoConfirmacionCompra: {ex.Message}", "ErrorServicioEmail");

            }
        }


        public async Task EnviarCorreoConfirmacionCompraComprador(Compra compra, string correoComprador)
        {
            try
            {
                await servicioLog.GuardarLogAsync($"Llego a metodo EnviarCorreoConfirmacionCompraComprador. Correo: {correoComprador}", "InfoServicioEmail");
                var apiKey = sendGridSettings.ApiKey;
                var client = new SendGridClient(apiKey);
                var from = new EmailAddress(sendGridSettings.SenderEmail, sendGridSettings.SenderName);
                var subject = "Confirmación de compra";

                var tipoEntrega = compra.TipoEntrega.GetType().Name switch
                {
                    "RetiroCompra" => "Retiro en persona",
                    "EnvioDomicilio" => "Envío a domicilio",
                    _ => "Otro tipo de entrega"
                };

                // Inicializa la variable para la dirección de entrega
                string datosEnvio = "";

                // Verifica si el tipo de entrega es EnvioDomicilio y asigna la dirección
                if (compra.TipoEntrega is EnvioDomicilio envioDomicilio)
                {
                   Direccion? direccion = await repoUsuario.BuscarDireccion(envioDomicilio.IdDireccion);

                    datosEnvio = $@"
                    <p><b>Departamento:</b> {direccion.Departamento}</p>
                    <p><b>Ciudad:</b> {direccion.Ciudad}</p>
                    <p><b>Calle:</b> {direccion.Calle}</p>
                    <p><b>Nro. de puerta:</b> {direccion.NroPuerta}</p>
                    {(string.IsNullOrEmpty(direccion.NroApartamento) ? "" : $"<b><p>Nro. de apartamento:</b> {direccion.NroApartamento}</p>")}
                    <p><b>Código Postal:</b> {direccion.CodigoPostal}</p>
                    {(string.IsNullOrEmpty(direccion.Comentario) ? "" : $"<b><p>Comentario:</b> {direccion.Comentario}</p>")}
                    ";
                }
                else if (compra.TipoEntrega is RetiroCompra retiroCompra)
                {
                    DatosNegocio? datosNegocio = await repoNegocio.BuscarPorId(retiroCompra.DatosNegocioId);
                    datosEnvio = $@"
                    <p><b>Nombre de quien retira:</b> {retiroCompra.NombreApellido}</p>
                    <p><b>Documento de identidad:</b> {retiroCompra.DocumentoCliente}</p>
                    <p><b>Lugar de retiro:</b></p>
                    <ul>
                    <li><b>Lugar:</b> {datosNegocio.Nombre}</li>                    
                    <li><b>Horario:</b> {datosNegocio.Horario}</li>
                    <li><b>Teléfono:</b> {datosNegocio.Telefono}</li>
                    <li><b>Dirección retiro:</b> {datosNegocio.Direccion.Calle} {datosNegocio.Direccion.NroPuerta}, 
                                  {datosNegocio.Direccion.Ciudad} {datosNegocio.Direccion.CodigoPostal}, 
                                  {datosNegocio.Direccion.Departamento}</li>
                    {(string.IsNullOrEmpty(retiroCompra.Comentario) ? "" : $"<b><li>Comentario:</b> {retiroCompra.Comentario}</li>")}
                    </ul>
                    ";
                }
            

                var plainTextContent = $"Gracias por su compra. Su pedido ha sido recibido.";
                var htmlContent = $@"
                                <html>
                                    <body>
                                        <h1>Confirmación de compra</h1>                                        
                                        <p><b>Detalles de la compra</b></p>
                                        <p><b>Nro de orden:</b> {compra.Id}</p>
                                        <p><b>Fecha de compra:</b> {compra.FechaCompra}</p>

                                        <p><b>Datos de facturación</b></p>
                                        <p><b>Nombre:</b> {compra.Cliente.Nombre} {compra.Cliente.Apellido}</p>
                                        <p><b>Teléfono:</b> {compra.Cliente.Telefono}</p>
                                        <p><b>Documento de identidad:</b> {compra.Cliente.DocumentoIdentidad}</p>
                                        {(string.IsNullOrEmpty(compra.RazonSocial) ? "" : $"<b><p>Razon Social:</b> {compra.RazonSocial}</p>")}
                                         {(string.IsNullOrEmpty(compra.Rut) ? "" : $"<b><p>RUT:</b> {compra.Rut}</p>")}

                                        <p><b>Productos</b></p>
                                        <table cellpadding='5' cellspacing='0'>
                                        <thead>
                                            <tr>
                                                <th>Producto</th>                                                
                                                <th>Precio</th>
                                                <th>Cantidad</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {string.Join("", compra.ItemsCompra
                                            .Select(item =>
                                            $"<tr>" +
                                            $"<td>{item.Producto.Nombre}</td>" +
                                            $"<td>{item.Producto.Precio}</td>" +
                                            $"<td>{item.Cantidad} unidades</td>" +
                                            $"</tr>")
                                            )}
                                        </tbody>
                                         </table>
                                         <p>Importe total: ${compra.TotalComprado}</p>

                                         <p><b>Datos de envío</b></p>
                                        <p><b>Tipo de entrega:</b> {tipoEntrega}</p>
                                        {datosEnvio}
                                        <p>Si tienes alguna duda sobre el pedido puede comunicarte por whatsapp al <b>098633195</b></p>
                                        <p><b>ALL TO IMPORT SAS</b></p>
                                    </body>
                                </html>";

                var msg = MailHelper.CreateSingleEmail(from, new EmailAddress(correoComprador), subject, plainTextContent, htmlContent);
                await client.SendEmailAsync(msg);
            }
            catch (Exception ex) {
                await servicioLog.GuardarLogAsync($"Error en el metodo EnviarCorreoConfirmacionCompraComprador. Error: {ex.Message}", "ErrorServicioEmail");

            }
        }


        public async Task EnviarCorreoConfirmacionCompraVendedor(Compra compra, string correoVendedor)
        {
            try
            {
            //await servicioLog.GuardarLogAsync($"Llego a metodo EnviarCorreoConfirmacionCompraVendedor. Correo: {correoVendedor}", "InfoServicioEmail");


            var apiKey = sendGridSettings.ApiKey;
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress(sendGridSettings.SenderEmail, sendGridSettings.SenderName);
            var subject = "Nueva compra realizada";
                var tipoEntrega = compra.TipoEntrega.GetType().Name switch
                {
                    "RetiroCompra" => "Retiro en persona",
                    "EnvioDomicilio" => "Envío a domicilio",
                    _ => "Otro tipo de entrega"
                };

                // Inicializa la variable para la dirección de entrega
                string datosEnvio = "";

                // Verifica si el tipo de entrega es EnvioDomicilio y asigna la dirección
                if (compra.TipoEntrega is EnvioDomicilio envioDomicilio)
                {
                    Direccion? direccion = await repoUsuario.BuscarDireccion(envioDomicilio.IdDireccion);

                    datosEnvio = $@"
                    <p><b>Departamento:</b> {direccion.Departamento}</p>
                    <p><b>Ciudad:</b> {direccion.Ciudad}</p>
                    <p><b>Calle:</b> {direccion.Calle}</p>
                    <p><b>Nro. de puerta:</b> {direccion.NroPuerta}</p>
                    {(string.IsNullOrEmpty(direccion.NroApartamento) ? "" : $"<b><p>Nro. de apartamento:</b> {direccion.NroApartamento}</p>")}
                    <p><b>Código Postal:</b> {direccion.CodigoPostal}</p>
                    {(string.IsNullOrEmpty(direccion.Comentario) ? "" : $"<b><p>Comentario:</b> {direccion.Comentario}</p>")}
                    ";
                }
                else if (compra.TipoEntrega is RetiroCompra retiroCompra)
                {
                    DatosNegocio? datosNegocio = await repoNegocio.BuscarPorId(retiroCompra.DatosNegocioId);
                    datosEnvio = $@"
                    <p><b>Nombre de quien retira:</b> {retiroCompra.NombreApellido}</p>
                    <p><b>Documento de identidad:</b> {retiroCompra.DocumentoCliente}</p>
                    <p><b>Lugar de retiro:</b></p>
                    <ul>
                    <li><b>Lugar:</b> {datosNegocio.Nombre}</li>                    
                    <li><b>Horario:</b> {datosNegocio.Horario}</li>
                    <li><b>Teléfono:</b> {datosNegocio.Telefono}</li>
                    <li><b>Dirección retiro:</b> {datosNegocio.Direccion.Calle} {datosNegocio.Direccion.NroPuerta}, 
                                  {datosNegocio.Direccion.Ciudad} {datosNegocio.Direccion.CodigoPostal}, 
                                  {datosNegocio.Direccion.Departamento}</li>
                    {(string.IsNullOrEmpty(retiroCompra.Comentario) ? "" : $"<b><li>Comentario:</b> {retiroCompra.Comentario}</li>")}
                    </ul>
                    ";
                }

            var plainTextContent = $"Se ha realizado una nueva compra. Detalles del pedido:";
            var htmlContent = $@"
                                <html>
                                    <body>
                                        <h1>Nueva compra realizada</h1>
                                        <p><b>Detalles de la compra</b></p>
                                        <p><b>Nro de orden:</b> {compra.Id}</p>
                                        <p><b>Fecha de compra:</b> {compra.FechaCompra}</p>

                                        <p><b>Datos de facturación</b></p>
                                        <p><b>Nombre:</b> {compra.Cliente.Nombre} {compra.Cliente.Apellido}</p>
                                        <p><b>Teléfono:</b> {compra.Cliente.Telefono}</p>
                                        <p><b>Documento de identidad:</b> {compra.Cliente.DocumentoIdentidad}</p>
                                        {(string.IsNullOrEmpty(compra.RazonSocial) ? "" : $"<b><p>Razon Social:</b> {compra.RazonSocial}</p>")}
                                         {(string.IsNullOrEmpty(compra.Rut) ? "" : $"<b><p>RUT:</b> {compra.Rut}</p>")}

                                        <p><b>Productos</b></p>
                                        <table cellpadding='5' cellspacing='0'>
                                        <thead>
                                            <tr>
                                                <th>Producto</th>                                                
                                                <th>Precio</th>
                                                <th>Cantidad</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {string.Join("", compra.ItemsCompra
                                            .Select(item =>
                                            $"<tr>" +
                                            $"<td>{item.Producto.Nombre}</td>" +
                                            $"<td>{item.Producto.Precio}</td>" +
                                            $"<td>{item.Cantidad} unidades</td>" +
                                            $"</tr>")
                                            )}
                                        </tbody>
                                         </table>
                                         <p>Importe total: ${compra.TotalComprado}</p>

                                         <p><b>Datos de envío</b></p>
                                        <p><b>Tipo de entrega:</b> {tipoEntrega}</p>
                                        {datosEnvio}
                                    </body>
                                </html>";

            var msg = MailHelper.CreateSingleEmail(from, new EmailAddress(correoVendedor), subject, plainTextContent, htmlContent);
            await client.SendEmailAsync(msg);
            //this.repoCompras.Desubscribir(this);
        }
            catch (Exception ex) {
                await servicioLog.GuardarLogAsync($"Error en el metodo EnviarCorreoConfirmacionCompraVendedor. Error: {ex.Message}", "ErrorServicioEmail");

    }
}


        public async Task EnviarCorreoCambioEstadoCompra(Compra compra)
        {
            try
            {
                var apiKey = sendGridSettings.ApiKey;
                var client = new SendGridClient(apiKey);
                var from = new EmailAddress(sendGridSettings.SenderEmail, sendGridSettings.SenderName);
                var subject = "Estado de tu compra ha cambiado";

                //var tipoEntrega = compra.TipoEntrega.GetType().Name switch
                //{
                //    "RetiroCompra" => "Retiro en persona",
                //    "EnvioDomicilio" => "Envío a domicilio",
                //    _ => "Otro tipo de entrega"
                //};

                //// Inicializa la variable para la dirección de entrega
                //string datosEnvio = "";

                //// Verifica si el tipo de entrega es EnvioDomicilio y asigna la dirección
                //if (compra.TipoEntrega is EnvioDomicilio envioDomicilio)
                //{
                //    Direccion? direccion = await repoUsuario.BuscarDireccion(envioDomicilio.IdDireccion);

                //    datosEnvio = $@"
                //        <p><b>Departamento:</b> {direccion.Departamento}</p>
                //        <p><b>Ciudad:</b> {direccion.Ciudad}</p>
                //        <p><b>Calle:</b> {direccion.Calle}</p>
                //        <p><b>Nro. de puerta:</b> {direccion.NroPuerta}</p>
                //        {(string.IsNullOrEmpty(direccion.NroApartamento) ? "" : $"<b><p>Nro. de apartamento:</b> {direccion.NroApartamento}</p>")}
                //        <p><b>Código Postal:</b> {direccion.CodigoPostal}</p>
                //        {(string.IsNullOrEmpty(direccion.Comentario) ? "" : $"<b><p>Comentario:</b> {direccion.Comentario}</p>")}
                //        ";
                //}
                //else if (compra.TipoEntrega is RetiroCompra retiroCompra)
                //{
                //    DatosNegocio? datosNegocio = await repoNegocio.BuscarPorId(retiroCompra.DatosNegocioId);
                //    datosEnvio = $@"
                //        <p><b>Nombre de quien retira:</b> {retiroCompra.NombreApellido}</p>
                //        <p><b>Documento de identidad:</b> {retiroCompra.DocumentoCliente}</p>
                //        <p><b>Lugar de retiro:</b></p>
                //        <ul>
                //        <li><b>Lugar:</b> {datosNegocio.Nombre}</li>                    
                //        <li><b>Horario:</b> {datosNegocio.Horario}</li>
                //        <li><b>Teléfono:</b> {datosNegocio.Telefono}</li>
                //        <li><b>Dirección retiro:</b> {datosNegocio.Direccion.Calle} {datosNegocio.Direccion.NroPuerta}, 
                //                      {datosNegocio.Direccion.Ciudad} {datosNegocio.Direccion.CodigoPostal}, 
                //                      {datosNegocio.Direccion.Departamento}</li>
                //        {(string.IsNullOrEmpty(retiroCompra.Comentario) ? "" : $"<b><li>Comentario:</b> {retiroCompra.Comentario}</li>")}
                //        </ul>
                //        ";
                //}
                var plainTextContent = $"El estado de tu compra ha cambiado a: {compra.EstadoCompraNombre}'.";
                var htmlContent = $@"
                                <html>
                                <body style='color: #333; background: #f7fafc; padding: 16px;'>
                                        <h1 style='color: #333; padding: 16px;'>Estado de tu compra</h1>
                                        <div style='background-color: #333; color: white; padding: 10px;text-align: center; font-size: 18px;'>Detalles de la compra #{compra.Id}</div>
                                        <p style='margin: 5px 0;'>El estado de tu compra ha cambiado a <b>{compra.EstadoCompraNombre}</b>.</p>


                                        <p style='margin: 5px 0;'><b>Fecha de compra:</b> {compra.FechaCompra}</p>

                                        <div style='margin-top: 20px; color: #333; padding: 16px;'>
                                            <p style=' margin: 5px 0;'>Si tienes alguna duda sobre el pedido puede comunicarte por whatsapp al <b style='color: #555;'>098633195</b> o enviar un mail a <b style='color: #555;'>alltoimportsas@gmail.com</b></p>
                                             <div style='background-color: #333; color: white; padding: 10px;text-align: center; font-size: 18px;'>
                                                   <p ><b >ALL TO IMPORT SAS</b></p>
                                             </div>
                                        </div
                                    </body>
                                </html>";

                var msg = MailHelper.CreateSingleEmail(from, new EmailAddress(compra.Cliente.CorreoElectronico), subject, plainTextContent, htmlContent);
                await client.SendEmailAsync(msg);
            }
            catch(Exception ex)
            {
                throw new Exception($"Error enviar mail cambio estado:{ex.Message}");
            }
        }

    }
    
}
