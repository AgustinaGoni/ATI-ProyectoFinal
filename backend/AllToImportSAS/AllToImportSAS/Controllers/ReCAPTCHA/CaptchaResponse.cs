using Newtonsoft.Json;

namespace AllToImportSAS.Controllers.ReCAPTCHA
{
    public class CaptchaResponse

    {
        private readonly IConfiguration configuration;

        public CaptchaResponse(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public bool Success { get; set; }
        public List<string> ErrorCodes { get; set; }

        public static async Task<bool> VerifyCaptcha(string token)
        {
            var client = new HttpClient();
            //var secretKey = configuration["ReCAPTCHA:SecretKey"];
            var secretKey = "6LdAKxsqAAAAANyyteOEJq7eLacGVGrbOOd6qXT9";
            var response = await client.GetStringAsync($"https://www.google.com/recaptcha/api/siteverify?secret={secretKey}&response={token}");
            var captchaResponse = JsonConvert.DeserializeObject<CaptchaResponse>(response);

            return captchaResponse.Success;
        }
    }

}
