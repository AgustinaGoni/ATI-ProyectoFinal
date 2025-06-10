using MercadoPago.Config;
using MercadoPago.Resource.Preference;
using MercadoPago.Client.Preference;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using AllToImportSAS.Controllers.DTO;
using MercadoPago.Client.Payment;
using MercadoPago.Resource.Payment;
using Octokit;
using System.Text.Json;
using MercadoPago.Client;
using MercadoPago.Resource;
using System.Collections.Concurrent;
using System.Net.Http.Headers;


namespace AllToImportSAS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PagosController : ControllerBase
    {

        //private readonly IConfiguration _configuration;
        //private readonly ILogger<PagosController> _logger;
        //private readonly HttpClient _httpClient;
        //private readonly string _urlNgrok;

        //// Lista concurrente para almacenar las notificaciones en memoria
        //private static ConcurrentBag<WebhookEvent> _notifications = new ConcurrentBag<WebhookEvent>();

        //public PagosController(IConfiguration configuration, ILogger<PagosController> logger)
        //{
        //    //es el token de una aplicacion dentro de un perfil de prueba de mercado pago, cuando llegue el momento pedir el real.
        //    //MercadoPagoConfig.AccessToken = "APP_USR-5217884254894211-062000-9a184dd9bcccb220ab5d1cab894e574d-1861404666"; 

        //    _configuration = configuration;
        //    _logger = logger;
        //    _urlNgrok = "https://7bfb-179-25-251-76.ngrok-free.app/";

        //    // Configurar Mercado Pago con tu access token
        //    MercadoPagoConfig.AccessToken = _configuration["MercadoPago:AccessToken"];
        //}



        ////[HttpPost("crear-preferencia")]
        ////public async Task<IActionResult> CrearPreferencia([FromBody] DTOCarrito carrito)
        ////{
        ////    if (carrito == null || carrito.ProductosDTO == null || !carrito.ProductosDTO.Any())
        ////    {
        ////        return BadRequest("Datos del carrito inválidos.");
        ////    }

        ////    var items = new List<PreferenceItemRequest>();

        ////    foreach (var producto in carrito.ProductosDTO)
        ////    {
        ////        items.Add(new PreferenceItemRequest
        ////        {
        ////            Title = producto.Nombre,
        ////            Quantity = producto.Cantidad,
        ////            CurrencyId = "UYU",
        ////            UnitPrice = (decimal?)producto.PrecioUnitario

        ////            //Title = "Mi producto",
        ////            //Quantity = 1,
        ////            //UnitPrice = 100,
        ////            //CurrencyId = "UYU"
        ////        });
        ////    }

        ////    var preferenceRequest = new PreferenceRequest
        ////    {
        ////        Items = items,
        ////        BackUrls = new PreferenceBackUrlsRequest
        ////        {
        ////            //Se supone que se redirecciona a la pagina que le digas
        ////           // Success = "https://www.success.com",
        ////           // Failure = "http://www.failure.com",
        ////           // Pending = "http://www.pending.com"
        ////        },
        ////    };

        ////    var client = new PreferenceClient();
        ////    Preference preference = await client.CreateAsync(preferenceRequest);

        ////    return Ok(new { init_point = preference.InitPoint });
        ////}

        ////[HttpPost("create_preference")]
        ////public async Task<IActionResult> CreatePreference([FromBody] DTOCarrito carrito)
        ////{

        ////    if (carrito == null || carrito.ProductosDTO == null || !carrito.ProductosDTO.Any())
        ////    {
        ////        return BadRequest("Datos del carrito inválidos.");
        ////    }

        ////    var items = new List<PreferenceItemRequest>();

        ////    foreach (var producto in carrito.ProductosDTO)
        ////    {
        ////        items.Add(new PreferenceItemRequest
        ////        {
        ////            Title = producto.Nombre,
        ////            Quantity = producto.Cantidad,
        ////            //CurrencyId = "UYU",
        ////            UnitPrice = (decimal?)producto.PrecioUnitario
        ////        });
        ////    }

        ////    var preference = new
        ////    {
        ////        items,
        ////        back_urls = new
        ////        {
                    
        ////            success = $"{_urlNgrok}result/success",
        ////            failure = $"{_urlNgrok}result/failure",
        ////            pending = $"{_urlNgrok}result/pending"
        ////        },
        ////        auto_return = "approved",
        ////        notification_url = $"{_urlNgrok}mercadopago/webhook" // URL pública de ngrok
        ////    };

        ////    try
        ////    {
        ////        using var httpClient = new HttpClient();
        ////        httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_configuration["MercadoPago:AccessToken"]}");

        ////        // Envía la solicitud POST a Mercado Pago para crear la preferencia de pago
        ////        var response = await httpClient.PostAsJsonAsync("https://api.mercadopago.com/checkout/preferences", preference);
        ////        response.EnsureSuccessStatusCode();

        ////        // Lee y deserializa la respuesta de Mercado Pago
        ////        var responseBody = await response.Content.ReadFromJsonAsync<PreferenceResponse>();

        ////        return Ok(new { responseBody });
        ////    }
        ////    catch (Exception ex)
        ////    {
        ////        _logger.LogError($"Error creating preference: {ex.Message}");
        ////        return StatusCode(500, "Error creating preference");
        ////    }

        ////}

        //[HttpPost("create_preference")]
        //public async Task<IActionResult> CreatePreference([FromBody] DTOCarrito carrito)
        //{
        //    if (carrito == null || carrito.ProductosDTO == null || !carrito.ProductosDTO.Any())
        //    {
        //        return BadRequest(new { error = "Datos del carrito inválidos." });
        //    }

        //    var items = carrito.ProductosDTO.Select(producto => new PreferenceItemRequest
        //    {
        //        Title = producto.Nombre,
        //        Quantity = producto.Cantidad,
        //        CurrencyId = "UYU",
        //        UnitPrice = (decimal)producto.PrecioUnitario
        //    }).ToList();

        //    var preference = new
        //    {
        //        items,
        //        back_urls = new
        //        {
        //            success = $"{_urlNgrok}result/success",
        //            failure = $"{_urlNgrok}result/failure",
        //            pending = $"{_urlNgrok}result/pending"
        //        },
        //        auto_return = "approved",
        //        notification_url = $"{_urlNgrok}mercadopago/webhook" // URL pública de ngrok
        //    };

        //    try
        //    {
        //        using var httpClient = new HttpClient();
        //        httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        //        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _configuration["MercadoPago:AccessToken"]);

        //        var response = await httpClient.PostAsJsonAsync("https://api.mercadopago.com/checkout/preferences", preference);

        //        if (response.IsSuccessStatusCode)
        //        {
        //            var responseBody = await response.Content.ReadFromJsonAsync<PreferenceResponse>();
        //            return Ok(new { responseBody });
        //        }
        //        else
        //        {
        //            var errorResponse = await response.Content.ReadAsStringAsync();
        //            _logger.LogError($"Error creating preference: {errorResponse}");
        //            return StatusCode((int)response.StatusCode, new { error = errorResponse });
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError($"Error creating preference: {ex.Message}");
        //        return StatusCode(500, new { error = "Error creating preference" });
        //    }
        //}

        //[HttpPost("webhook")]
        //public async Task<IActionResult> Webhook()
        //{
        //    using var reader = new StreamReader(HttpContext.Request.Body);
        //    var body = await reader.ReadToEndAsync();
        //    _logger.LogInformation($"Webhook received: {body}");

        //    try
        //    {
        //        var webhookEvent = JsonSerializer.Deserialize<WebhookEvent>(body);

        //        if (webhookEvent != null)
        //        {
        //            // Almacena la notificación en la lista concurrente
        //            //_notifications.Add(webhookEvent);
        //            _logger.LogInformation($"Webhook event stored: {JsonSerializer.Serialize(webhookEvent)}");

        //            if (webhookEvent.Type == "payment" && webhookEvent.Action == "payment.created")
        //            {
        //                var paymentId = webhookEvent.Data.Id;

        //                // Aquí puedes agregar lógica para manejar el evento, como actualizar la base de datos,
        //                // enviar notificaciones, etc.
        //                var paymentClient = new PaymentClient();
        //                var payment = await paymentClient.GetAsync(long.Parse(paymentId));

        //                // Validar el estado del pago
        //                if (payment.Status == PaymentStatus.Approved)
        //                {
        //                    // Actualizar la base de datos con el estado del pago
        //                    // TODO: Implementa la lógica para actualizar tu base de datos

        //                    _logger.LogInformation($"Payment approved with ID: {paymentId}");
        //                }
        //            }
        //        }
        //    }
        //    catch (JsonException ex)
        //    {
        //        _logger.LogError($"Error deserializing webhook payload: {ex.Message}");
        //        // Devuelve un HTTP STATUS 200 incluso si hay un error de deserialización
        //        return Ok("Invalid JSON payload");
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError($"Error processing webhook: {ex.Message}");
        //        // Devuelve un HTTP STATUS 200 incluso si hay otro tipo de error
        //        return Ok("Error processing webhook");
        //    }

        //    // Devuelve un HTTP STATUS 200 (OK) para confirmar que la notificación fue recibida correctamente
        //    return Ok();
        //}

        //[HttpGet("obtener_pago/{paymentId}")]
        //public async Task<IActionResult> ObtenerPago(long paymentId)
        //{
        //    try
        //    {
        //        var client = new PaymentClient();
        //        Payment payment = await client.GetAsync(paymentId);

        //        if (payment != null)
        //        {
        //            return Ok(payment);
        //        }
        //        else
        //        {
        //            return NotFound();
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Error al obtener el pago: {ex.Message}");
        //    }
        //}

        //[HttpGet("todos_los_pagos")]
        //public async Task<IActionResult> ObtenerPagos()
        //{
        //    try
        //    {
        //        var searchRequest = new AdvancedSearchRequest
        //        {
        //            Limit = 30,
        //            Offset = 0,
        //            Sort = "date_created",
        //            Criteria = "desc",
        //            Range = "date_created",
        //            BeginDate = DateTime.Now.AddYears(-1),
        //            EndDate = DateTime.Now.AddDays(1).AddMilliseconds(-1),
        //            //Filters = new Dictionary<string, object>
        //            //{
        //            //    ["ID_REF"] = "external_reference",
        //            //},
        //        };

        //        var client = new PaymentClient();
        //        ResultsResourcesPage<Payment> results = await client.SearchAsync(searchRequest);

        //        if (results.Results != null)
        //        {
        //            return Ok(results.Results);
        //        }
        //        else
        //        {
        //            return NotFound();
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Error al obtener los pagos: {ex.Message}");
        //    }
        //}
    }

    //public record PreferenceRequest(string Title, decimal Price, int Quantity);

    //public class PreferenceItemRequest
    //{
    //    public string Title { get; set; }
    //    public int Quantity { get; set; }
    //    public string CurrencyId { get; set; }
    //    public decimal UnitPrice { get; set; }
    //}

    //public record PreferenceResponse(string Id);

    //public class WebhookEvent
    //{
    //    public string Id { get; set; }
    //    public bool LiveMode { get; set; }
    //    public string Type { get; set; }
    //    public string DateCreated { get; set; }
    //    public long UserId { get; set; }
    //    public string ApiVersion { get; set; }
    //    public string Action { get; set; }
    //    public WebhookData Data { get; set; }
    //}

    //public class WebhookData
    //{
    //    public string Id { get; set; }
    //}

    //public class PaymentInfo
    //{
    //    public int Id { get; set; }
    //    public DateTime DateCreated { get; set; }
    //    public DateTime DateApproved { get; set; }
    //    public DateTime DateLastUpdated { get; set; }
    //    public DateTime MoneyReleaseDate { get; set; }
    //    public string PaymentMethodId { get; set; }
    //    public string PaymentTypeId { get; set; }
    //    public string Status { get; set; }
    //    public string StatusDetail { get; set; }
    //    public string CurrencyId { get; set; }
    //    public string Description { get; set; }
    //    public int CollectorId { get; set; }
    //    public PayerInfo Payer { get; set; }
    //    public object Metadata { get; set; }
    //    public object AdditionalInfo { get; set; }
    //    public string ExternalReference { get; set; }
    //    public decimal TransactionAmount { get; set; }
    //    public decimal TransactionAmountRefunded { get; set; }
    //    public decimal CouponAmount { get; set; }
    //    public TransactionDetails TransactionDetails { get; set; }
    //    public int Installments { get; set; }
    //    public object Card { get; set; }
    //}

    //public class PayerInfo
    //{
    //    public int Id { get; set; }
    //    public string Email { get; set; }
    //    public IdentificationInfo Identification { get; set; }
    //    public string Type { get; set; }
    //}

    //public class IdentificationInfo
    //{
    //    public string Type { get; set; }
    //    public long Number { get; set; }
    //}

    //public class TransactionDetails
    //{
    //    public decimal NetReceivedAmount { get; set; }
    //    public decimal TotalPaidAmount { get; set; }
    //    public decimal OverpaidAmount { get; set; }
    //    public decimal InstallmentAmount { get; set; }
    //}

    //public class PagingInfo
    //{
    //    public int Total { get; set; }
    //    public int Limit { get; set; }
    //    public int Offset { get; set; }
    //}

    //public class PaymentResponse
    //{
    //    public PagingInfo Paging { get; set; }
    //    public List<PaymentInfo> Results { get; set; }
    //}
}

