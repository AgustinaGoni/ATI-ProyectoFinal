using Dominio.Entidades;
using System.Text;
using System.Xml;
using System.Xml.Serialization;

namespace AllToImportSAS.Controllers.Servicios
{
    public class ServicioStock
    {

        private readonly HttpClient httpClient;
        private readonly ServicioLog servicioLog;
        //private readonly ServicioProducto servicioProducto;
        //private Timer _temporizador;


        private readonly string codigoAcceso;

        private string imagenPorDefecto = "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";

        public ServicioStock(HttpClient httpClient, IConfiguration configuration, ServicioLog servicioLog)
        {
            this.httpClient = httpClient;
            codigoAcceso = configuration["CodigoAccesoWS"];
            this.servicioLog = servicioLog;
            //this.servicioProducto = servicioProducto;
        }

        //public Task StartAsync(CancellationToken cancellationToken)
        //{
        //    //_logger.LogInformation("El servicio de actualización de stock está iniciando.");
        //    _temporizador = new Timer(ActualizarAutomatico, null, TimeSpan.Zero, TimeSpan.FromHours(12));
        //    return Task.CompletedTask;
        //}

        //private void ActualizarAutomatico(object? state)
        //{
        //    Task.Run(async () =>
        //    {
        //        var productos = await ObtenerStockAsync();
        //        await servicioProducto.ActualizarProductosAsync(productos);
        //    }).Wait();
        //}

        public async Task<List<Producto>> ObtenerStockAsync()
        {


            try
            {
                await servicioLog.GuardarLogAsync("Llego a metodo ObtenerStockAsync", "InfoServicio");
                var url = "http://200.40.168.109:6444/wsconsultas.asmx";
                var xmlRequest = $@"
            <soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:tem='http://tempuri.org/'>
                <soapenv:Header/>
                <soapenv:Body>
                    <tem:ConsultaStock>
                        <tem:CodigoAcceso>{codigoAcceso}</tem:CodigoAcceso>
                    </tem:ConsultaStock>
                </soapenv:Body>
            </soapenv:Envelope>";

                var content = new StringContent(xmlRequest, Encoding.UTF8, "text/xml");
                content.Headers.Add("SOAPAction", "http://tempuri.org/ConsultaStock");

                var response = await httpClient.PostAsync(url, content);
                var responseString = await response.Content.ReadAsStringAsync();


                var deserializedResponse = DeserializeResponse(responseString);
                return deserializedResponse != null ? MapItemsToProductos(deserializedResponse.Items) : new List<Producto>();
            }
            catch (Exception ex)
            {
                await servicioLog.GuardarLogAsync($"Catch metodo ObtenerStockAsync. Error: {ex.Message}", "InfoServicio");
                throw new Exception("Error deserializing response", ex);
            }
        }

        public async Task<List<Producto>> ObtenerStockEspecificoAsync(List<int> codigosProductos)
        {
            try
            {
                await servicioLog.GuardarLogAsync("Llego a metodo ObtenerStockEspecificoAsync", "InfoServicio");
                var url = "http://200.40.168.109:6444/wsconsultas.asmx";
                var xmlRequest = $@"
            <soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:tem='http://tempuri.org/'>
                <soapenv:Header/>
                <soapenv:Body>
                    <tem:ConsultaStockEspecifico>
                        <tem:CodigoAcceso>{codigoAcceso}</tem:CodigoAcceso>
                        <tem:CodigosProductos>
                            {string.Join("", codigosProductos.Select(c => $"<tem:Codigo>{c}</tem:Codigo>"))}
                        </tem:CodigosProductos>
                    </tem:ConsultaStockEspecifico>
                </soapenv:Body>
            </soapenv:Envelope>";

                var content = new StringContent(xmlRequest, Encoding.UTF8, "text/xml");
                content.Headers.Add("SOAPAction", "http://tempuri.org/ConsultaStockEspecifico");

                var response = await httpClient.PostAsync(url, content);
                var responseString = await response.Content.ReadAsStringAsync();

                var deserializedResponse = DeserializeResponse(responseString);
                return deserializedResponse != null ? MapItemsToProductos(deserializedResponse.Items) : new List<Producto>();
            }
            catch (Exception ex)
            {
                await servicioLog.GuardarLogAsync($"Catch metodo ObtenerStockEspecificoAsync. Error: {ex.Message}", "InfoServicio");
                throw new Exception("Error deserializing response", ex);
            }
        }


        private Stock DeserializeResponse(string response)
        {
            try
            {
                XmlDocument doc = new XmlDocument();
                doc.LoadXml(response);

                XmlNamespaceManager nsmgr = new XmlNamespaceManager(doc.NameTable);
                nsmgr.AddNamespace("soap", "http://schemas.xmlsoap.org/soap/envelope/");
                nsmgr.AddNamespace("temp", "http://tempuri.org/");

                XmlNode resultNode = doc.SelectSingleNode("//soap:Body/temp:ConsultaStockResponse/temp:ConsultaStockResult", nsmgr);
                if (resultNode == null)
                {
                    return null;
                }

                string stockXml = resultNode.InnerText;

                
                stockXml = stockXml.Replace(",", ".");

                var serializer = new XmlSerializer(typeof(Stock));

                using (var reader = new StringReader(stockXml))
                {
                    return (Stock)serializer.Deserialize(reader);
                }
            }
            catch (Exception ex)
            {
                
                throw new Exception("Error parsing XML response", ex);
            }
        }

        private List<Producto> MapItemsToProductos(List<Item> items)
        {
            var productos = new List<Producto>();
            foreach (var item in items)
            {
                productos.Add(new Producto
                {
                    Codigo = item.Codigo,
                    Nombre = item.Descripcion, 
                    Descripcion = "", 
                    Precio = item.Precio,
                    Stock = item.Stock,
                    Imagen = imagenPorDefecto, 
                    Categoria = null
                    //Habilitada = false
                });
            }
            return productos;
        }
    }

    [XmlRoot(ElementName = "item")]
    public class Item
    {
        [XmlElement(ElementName = "codigo")]
        public int Codigo { get; set; }

        [XmlElement(ElementName = "descripcion")]
        public string Descripcion { get; set; }

        [XmlElement(ElementName = "stock")]
        public int Stock { get; set; }

        [XmlElement(ElementName = "precio")]
        public double Precio { get; set; }
    }

    [XmlRoot(ElementName = "stock")]
    public class Stock
    {
        [XmlElement(ElementName = "item")]
        public List<Item> Items { get; set; }
    }
}
