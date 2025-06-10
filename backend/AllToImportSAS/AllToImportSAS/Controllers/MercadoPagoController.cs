using MercadoPago.Client.Payment;
using MercadoPago.Client;
using MercadoPago.Config;
using MercadoPago.Resource.Payment;
using MercadoPago.Resource;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Concurrent;
using System.IO;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Threading.Tasks;
using MercadoPago.Http;
using AllToImportSAS.Controllers.DTO;
using Dominio.Interfaces;
using Observer;
using AccesoDatos.EntityFramework;
using Dominio.Entidades;
using static System.Net.WebRequestMethods;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using System.Dynamic;
using MercadoPago.Resource.Preference;
using Dominio.Excepciones;
using AllToImportSAS.Controllers.Servicios;
using AllToImportSAS.Controllers.Validaciones;

using Microsoft.AspNetCore.Authorization;


namespace AllToImportSAS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MercadoPagoController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<MercadoPagoController> _logger;
        private readonly HttpClient _httpClient;
        private readonly string _urlNgrok = "https://d394-2800-a4-23f0-5600-983e-1898-cb79-b7ee.ngrok-free.app/";
        private readonly string _urlDeployWeb = "https://alltoimport.netlify.app/";
        //private readonly string _urlAPI = "https://alltoimportsas.azurewebsites.net/";
        private readonly string _urlAPI = "https://alltoimportsasapi.azurewebsites.net/";

        private readonly IRepoCompra repoCompra;
        private readonly IRepoProducto repoProducto;
        private readonly IRepoUsuario repoUsuario;
        private readonly IRepoCompraPendiente repoCompraPendiente;
        private readonly IRepoLog repoLog;
        private readonly ServicioProducto servicioProducto;
        private readonly ServicioStock servicioStock;
        private readonly ServicioEmail servicioEmail;
        private readonly ServicioLog servicioLog;
        private readonly ServicioActualizacion servicioActualizacion;
        private readonly IRepoCostoDeEnvioDomicilio costoDeEnvioDomicilio;

        // Lista concurrente para almacenar las notificaciones en memoria
        private static ConcurrentBag<WebhookEvent> _notifications = new ConcurrentBag<WebhookEvent>();

        public MercadoPagoController(IConfiguration configuration, ILogger<MercadoPagoController> logger, IRepoCompra repoCompra, IRepoProducto repoProducto, IRepoUsuario repoUsuario, IRepoCompraPendiente repoCompraPendiente, ServicioStock servicioStock, ServicioProducto servicioProducto, ServicioEmail ServicioEmail, ServicioLog servicioLog, IRepoLog repoLog, IRepoCostoDeEnvioDomicilio costoDeEnvioDomicilio, ServicioActualizacion servicioActualizacion)
        {
            _configuration = configuration;
            _logger = logger;
            // Configurar Mercado Pago con tu access token
            MercadoPagoConfig.AccessToken = _configuration["MercadoPago:AccessToken"];
            this.repoCompra = repoCompra;
            this.repoProducto = repoProducto;
            this.repoUsuario = repoUsuario;
            this.repoCompraPendiente = repoCompraPendiente;
            this.servicioProducto = servicioProducto;
            this.servicioStock = servicioStock;
            this.servicioEmail = ServicioEmail;
            this.servicioLog = servicioLog;
            this.repoLog = repoLog;
            this.costoDeEnvioDomicilio = costoDeEnvioDomicilio;
            this.servicioActualizacion = servicioActualizacion;
            //_observable = observable;

        }



        [HttpPost("create_preference")]
        [Authorize]
        public async Task<IActionResult> CreatePreference([FromBody] DTOCarrito carrito)
        {

            try
            {

                var validarCompra = new ValidarCompra(repoProducto, repoUsuario);
                await validarCompra.ValidarDatosDelCarrito(carrito);


                Cliente? cliente = (Cliente)await repoUsuario.BuscarUsuarioParaRealizarCompra(carrito.Cliente.IdCliente);

                if (cliente == null)
                {
                    throw new UsuarioException("No se ha encontrado al usuario.");
                }

                // Actualizar teléfono si es diferente o nulo
                if (cliente.Telefono == null || cliente.Telefono != carrito.Cliente.NumeroTelefono)
                {
                    cliente.Telefono = carrito.Cliente.NumeroTelefono;
                }

                // Actualizar documento de identidad si es diferente o nulo
                if (cliente.DocumentoIdentidad == null || cliente.DocumentoIdentidad != carrito.Cliente.DocumentoIdentidad)
                {
                    cliente.DocumentoIdentidad = carrito.Cliente.DocumentoIdentidad;
                }

                await repoUsuario.ModificarCliente(cliente);

                if (carrito.GuardarDatosExtras)
                {
                    cliente.RazonSocial = carrito.Cliente.RazonSocial;
                    cliente.RUT = carrito.Cliente.Rut;
                    await repoUsuario.ModificarCliente(cliente);
                }


                var items = carrito.Productos.Select(producto => new
                {
                    id = producto.Id,
                    title = producto.Nombre,
                    unit_price = producto.PrecioUnitario,
                    quantity = producto.Cantidad
                }).ToList();


                var payer = new
                {
                    
                    name = cliente.Nombre,
                    surname = cliente.Apellido,
                    email = cliente.CorreoElectronico,
                    phone = new
                    {
                        number = carrito.Cliente.NumeroTelefono
                    },
                   
                };


                double costoEnvio = 0;

                var metadata = new Dictionary<string, object>
                {
                    { "envio_tipo", carrito.OpcionEnvio },
                    { "id_cliente", cliente.Id },
                    { "razon_social", carrito.Cliente.RazonSocial },
                    { "rut", carrito.Cliente.Rut },
                    

                };


                Direccion d = await repoUsuario.BuscarDireccion(carrito.EnvioDomicilio.IdDireccion);

                if (carrito.OpcionEnvio == "domicilio")
                {
                    metadata.Add("id_domicilio", carrito.EnvioDomicilio.IdDireccion);
                    metadata.Add("domicilio_comentario", carrito.EnvioDomicilio.Comentario);
                    if (d.Departamento.ToLower() == "montevideo")
                    {
                        costoEnvio = await costoDeEnvioDomicilio.BuscarCostoEnvio();
                        metadata.Add("costo_envio", costoEnvio);
                    }
                    else
                    {
                        metadata.Add("costo_envio", costoEnvio);
                    }
                }

                if (carrito.OpcionEnvio == "retiro")
                {
                    metadata.Add("retiro_nombre", carrito.RetiroCompra.NombreApellido);
                    metadata.Add("retiro_documento", carrito.RetiroCompra.NumeroDocumento);
                    metadata.Add("retiro_tipo_documento", carrito.RetiroCompra.TipoDocumento);
                    metadata.Add("retiro_comentario", carrito.RetiroCompra.Comentario);
                    metadata.Add("id_datos_negocio", carrito.RetiroCompra.IdDatosNegocio);
                }

                var preference = new
                {
                    items,
                    payer,
                    //shipments,
                    back_urls = new
                    {
                        success = $"{_urlDeployWeb}result/success",
                        failure = $"{_urlDeployWeb}result/failure",
                        pending = $"{_urlDeployWeb}result/pending"
                    },
                    shipments = new
                    {
                        cost = costoEnvio, 
                        mode = "not_specified" 
                    },
                    auto_return = "approved",
                    notification_url = $"{_urlAPI}api/mercadopago/webhook", // URL pública
                    //external_reference = "reference_1234", // Puedes usar un identificador para la compra
                    statement_descriptor = "AllToImport",
                    metadata
                };
                using var httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_configuration["MercadoPago:AccessToken"]}");

                // Envía la solicitud POST a Mercado Pago para crear la preferencia de pago
                var respuesta = await httpClient.PostAsJsonAsync("https://api.mercadopago.com/checkout/preferences", preference);
                respuesta.EnsureSuccessStatusCode();

                // Lee y deserializa la respuesta de Mercado Pago
                var res = await respuesta.Content.ReadFromJsonAsync<PreferenceResponse>();

                //if (!string.IsNullOrEmpty(carrito.Cliente.Rut) && string.IsNullOrEmpty(carrito.Cliente.RazonSocial))
                //{
                //    throw new CompraException("Si se proporciona un RUT, también debe proporcionarse una Razón Social.");
                //}

                //if (!string.IsNullOrEmpty(carrito.Cliente.RazonSocial) && string.IsNullOrEmpty(carrito.Cliente.Rut))
                //{
                //    throw new CompraException("Si se proporciona una Razón Social, también debe proporcionarse un RUT.");
                //}


                return Ok(new { res });
            }
            catch (UsuarioException ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest(ex.Message);
            }
            catch (CompraException ex)
            {
                _logger.LogError($"Error al crear la compra: {ex.Message}");
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al crear la preferencia: {ex.Message}");
                return StatusCode(500, $"Ocurrio un error al crear la preferencia. {ex.Message}");
            }
        }


        [HttpPost("webhook")]
        public async Task<IActionResult> Webhook()
        {

            try
            {
                //await servicioLog.GuardarLogAsync("Inicio del Webhook.", "InfoServicioWebhook");
                var webhookEvent = await HttpContext.Request.ReadFromJsonAsync<WebhookEvent>();

                if (webhookEvent?.Data?.Id == null)
                {
                    //await servicioLog.GuardarLogAsync("El Id del evento Webhook es nulo.", "ErrorServicioWebhook");
                    return Ok("Invalid Webhook Event Id");
                }                    

               // await servicioLog.GuardarLogAsync($"Id del evento Webhook es: {webhookEvent?.Data?.Id}", "InfoServicioWebhook");

                if (webhookEvent.Type == "payment" && webhookEvent.Action == "payment.created")
                {


                    await servicioLog.GuardarLogAsync("Procesando evento de pago creado.", "InfoServicioWebhook");

                    if (!long.TryParse(webhookEvent.Data.Id, out long paymentId))
                    {
                        //await servicioLog.GuardarLogAsync("El Id del pago no es válido.", "ErrorServicioWebhook");
                        return Ok("Invalid Payment Id");
                    }   

                    var paymentClient = new PaymentClient();
                    var payment = await paymentClient.GetAsync(paymentId);


                    if (payment.Status == PaymentStatus.Approved)
                    {
                        var compraExistente = await repoCompra.BuscarPorPaymentId(paymentId);
                        await servicioLog.GuardarLogAsync($"Payment id {paymentId}.", "InfoServicio");
                        if (compraExistente)
                        {
                            await servicioLog.GuardarLogAsync($"La compra con el Id {paymentId} ya fue procesada.", "InfoServicio");
                            return Ok("Compra ya procesada");
                        }

                        await CrearCompra(payment, paymentId);

                       

                        return Ok();


                    }
                    return Ok();
                }

                return Ok();

            }
            catch (CompraException ex)
            {
                //await servicioLog.GuardarLogAsync($"Error al dar de alta la compra. Error: {ex.Message}", "ErrorServicioWebhook");
                return Ok();
            }
            catch (UsuarioException ex)
            {
                //await servicioLog.GuardarLogAsync($"Error en el usuario al dar de alta la compra. Error: {ex.Message}", "ErrorServicioWebhook");
                return Ok();
            }
            catch (System.Text.Json.JsonException ex)
            {
                //_logger.LogError($"Error deserializing webhook payload: {ex.Message}");
                //await servicioLog.GuardarLogAsync($"Error deserializing webhook payload. Error: {ex.Message}", "ErrorServicioWebhook");
                return Ok("Invalid JSON payload");
            }
            catch (Exception ex)
            {
                //_logger.LogError($"Error processing webhook: {ex.Message}");
                //await servicioLog.GuardarLogAsync($"Error processing webhook. Error: {ex.Message}", "ErrorServicioWebhook");
                return Ok("Error processing webhook");
            }
        }

        private async Task CrearCompra(Payment payment, long paymentId)
        {
            var idCliente = int.Parse(payment.Metadata["id_cliente"].ToString());
            Cliente? cliente = (Cliente)await repoUsuario.BuscarUsuarioParaRealizarCompra(idCliente);
            var tipoEnvio = payment.Metadata["envio_tipo"].ToString();



            List<ItemCompra> itemsCompra = new List<ItemCompra>();

            List<int> codigosProductos = new List<int>();

            foreach (var item in payment.AdditionalInfo.Items)
            {
                if (int.TryParse(item.Id, out int productId))
                {
                    var producto = await repoProducto.BuscarPorId(productId);
                    ItemCompra itemCompra = new ItemCompra
                    {
                        Producto = producto,
                        Cantidad = (int)item.Quantity,
                    };
                    itemsCompra.Add(itemCompra);
                    codigosProductos.Add(producto.Codigo);
                }
            }


            TipoEntrega t = new TipoEntrega();
            if (tipoEnvio == "domicilio")

            {
                t = new EnvioDomicilio
                {
                    IdCliente = idCliente,
                    IdDireccion = int.Parse(payment.Metadata["id_domicilio"].ToString()),
                    Comentario = payment.Metadata["domicilio_comentario"].ToString(),
                    CostoEnvio = double.Parse(payment.Metadata["costo_envio"].ToString())
                };
            }
            else
            {
                t = new RetiroCompra
                {
                    NombreApellido = payment.Metadata["retiro_nombre"].ToString(),
                    TipoDocumento = payment.Metadata["retiro_tipo_documento"].ToString(),
                    DocumentoCliente = payment.Metadata["retiro_documento"].ToString(),
                    Comentario = payment.Metadata["retiro_comentario"].ToString(),
                    DatosNegocioId = Int32.Parse(payment.Metadata["id_datos_negocio"].ToString())
                };
            }

            var payer = payment.Payer;

            DateTime utcNow = DateTime.UtcNow;
            TimeZoneInfo localZone = TimeZoneInfo.FindSystemTimeZoneById("America/Montevideo");
            DateTime localTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, localZone);


            Compra c = new Compra
            {
                ItemsCompra = itemsCompra,
                FechaCompra = localTime,
                //Cliente = (Cliente)await repoUsuario.BuscarPorId(compra.IdCliente),
                Cliente = cliente,
                TipoEntrega = t,
                Rut = payment.Metadata.ContainsKey("rut") ? payment.Metadata["rut"].ToString() : null,
                RazonSocial = payment.Metadata.ContainsKey("razon_social") ? payment.Metadata["razon_social"].ToString() : null,
                Telefono = payment.AdditionalInfo.Payer.Phone.Number,
                EstadoCompra = EstadoCompra.Confirmada,
                PaymentId = paymentId
            };

            await repoCompra.Alta(c);

            string correoCliente = cliente.CorreoElectronico;
            await EnviarCorreoDeConfirmacion(c, correoCliente);
            //await servicioEmail.EnviarCorreoConfirmacionCompraComprador(c, correoCliente);
            //await servicioEmail.EnviarCorreoConfirmacionCompraVendedor(c, "alltoimportsas@gmail.com");
            //await servicioEmail.EnviarCorreoConfirmacionCompra(c, correoCliente, "alltoimportsas@gmail.com");
            //await servicioLog.GuardarLogAsync("Compra confirmada exitosamente", "InfoServicio");


            //var productosDelWebService = await servicioStock.ObtenerStockEspecificoAsync(codigosProductos);
            //await serActualizarStockLocalAsync(productosDelWebService);
            await ActualizarStock();
        }

        private async Task ActualizarStock()
        {
            var productos = await servicioActualizacion.RealizarTrabajoProductos();

            await servicioLog.GuardarLogAsync("Paso el RealizarTrabajoProductos", "InfoServicio");
            if (productos != null)
            {
                await servicioProducto.ActualizarProductosAsync(productos);

                await servicioLog.GuardarLogAsync("Paso el ActualizarProductosAsync", "InfoServicio");
            }
            
        }

        private async Task EnviarCorreoDeConfirmacion(Compra c, string correoCliente)
        {
            //await servicioEmail.EnviarCorreoConfirmacionCompraVendedor(c, "alltoimportsas@gmail.com");
            await servicioEmail.EnviarCorreoConfirmacionCompra(c, correoCliente, "alltoimportsas@gmail.com");
            await servicioLog.GuardarLogAsync("Compra confirmada exitosamente", "InfoServicio");
        }

        [HttpGet("obtener_pago/{paymentId}")]
        [Authorize]
        public async Task<IActionResult> ObtenerPago(long paymentId)
        {
            try
            {
                var client = new PaymentClient();
                Payment payment = await client.GetAsync(paymentId);

                if (payment != null)
                {
                    return Ok(payment);
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener el pago: {ex.Message}");
            }
        }

        [HttpGet("todos_los_pagos")]
        [Authorize]
        public async Task<IActionResult> ObtenerPagos()
        {
            try
            {
                var searchRequest = new AdvancedSearchRequest
                {
                    Limit = 30,
                    Offset = 0,
                    Sort = "date_created",
                    Criteria = "desc",
                    Range = "date_created",
                    BeginDate = DateTime.Now.AddYears(-1),
                    EndDate = DateTime.Now.AddDays(1).AddMilliseconds(-1),
                };

                var client = new PaymentClient();
                ResultsResourcesPage<Payment> results = await client.SearchAsync(searchRequest);

                if (results.Results != null)
                {
                    return Ok(results.Results);
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los pagos: {ex.Message}");
            }
        }


        [HttpGet("MetodosDePagos")]
        public async Task<IActionResult> MetodosDePagos()
        {
            try
            {
                using var httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_configuration["MercadoPago:AccessToken"]}");

                HttpResponseMessage response = await httpClient.GetAsync("https://api.mercadopago.com/v1/payment_methods");

                if (response.IsSuccessStatusCode)
                {
                    var paymentMethods = await response.Content.ReadFromJsonAsync<object>(); // Puedes ajustar el tipo según la respuesta esperada
                    return Ok(paymentMethods);
                }
                else
                {
                    return StatusCode((int)response.StatusCode, "Error al consultar métodos de pago");
                }
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(500, $"Error de conexión: {ex.Message}");
            }
        }
    }

    public record PreferenceResponse(string Id);

    #region InnerClass
    public class WebhookEvent
    {
        [JsonPropertyName("id")]
        public long Id { get; set; }

        [JsonPropertyName("live_mode")]
        public bool LiveMode { get; set; }

        [JsonPropertyName("type")]
        public string Type { get; set; }

        [JsonPropertyName("date_created")]
        public DateTime DateCreated { get; set; }

        [JsonPropertyName("application_id")]
        public long ApplicationId { get; set; }

        [JsonPropertyName("user_id")]
        public long UserId { get; set; }

        [JsonPropertyName("version")]
        public int Version { get; set; }

        [JsonPropertyName("api_version")]
        public string ApiVersion { get; set; }

        [JsonPropertyName("action")]
        public string Action { get; set; }
        [JsonProperty("data")]
        public Data Data { get; set; }
    }

    public class Data
    {
        [JsonProperty("id")]
        public string Id { get; set; }
    }

    public class PaymentInfo
    {
        public int Id { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateApproved { get; set; }
        public DateTime DateLastUpdated { get; set; }
        public DateTime MoneyReleaseDate { get; set; }
        public string PaymentMethodId { get; set; }
        public string PaymentTypeId { get; set; }
        public string Status { get; set; }
        public string StatusDetail { get; set; }
        public string CurrencyId { get; set; }
        public string Description { get; set; }
        public int CollectorId { get; set; }
        public PayerInfo Payer { get; set; }
        public object Metadata { get; set; }
        public object AdditionalInfo { get; set; }
        public string ExternalReference { get; set; }
        public decimal TransactionAmount { get; set; }
        public decimal TransactionAmountRefunded { get; set; }
        public decimal CouponAmount { get; set; }
        public TransactionDetails TransactionDetails { get; set; }
        public int Installments { get; set; }
        public object Card { get; set; }
    }

    public class PayerInfo
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public IdentificationInfo Identification { get; set; }
        public string Type { get; set; }
    }

    public class IdentificationInfo
    {
        public string Type { get; set; }
        public long Number { get; set; }
    }

    public class TransactionDetails
    {
        public decimal NetReceivedAmount { get; set; }
        public decimal TotalPaidAmount { get; set; }
        public decimal OverpaidAmount { get; set; }
        public decimal InstallmentAmount { get; set; }
    }

    public class PagingInfo
    {
        public int Total { get; set; }
        public int Limit { get; set; }
        public int Offset { get; set; }
    }

    public class PaymentResponse
    {
        public PagingInfo Paging { get; set; }
        public List<PaymentInfo> Results { get; set; }
    }
    #endregion


}