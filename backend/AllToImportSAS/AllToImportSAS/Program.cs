using AccesoDatos.EntityFramework;
using AllToImportSAS.Controllers.Servicios;
using Dominio.Entidades;
using Dominio.Interfaces;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddScoped<IRepoUsuario, RepoUsuarios>();
builder.Services.AddScoped<IRepoProducto, RepoProductos>();
builder.Services.AddScoped<IRepoCompra, RepoCompras>();
builder.Services.AddScoped<IRepoDatoNegocio, RepoDatoNegocio>();
builder.Services.AddScoped<IRepoCategoria, RepoCategorias>();
builder.Services.AddScoped<IRepoLog, RepoLogs>();
builder.Services.AddScoped<IRepoCompraPendiente, RepoCompraPendiente>();
builder.Services.AddScoped<IRepoCostoDeEnvioDomicilio, RepoCostoDeEnvioDomicilio>();
builder.Services.AddScoped<IRepoReportes, RepoReportes>();


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHttpClient<ServicioStock>();
builder.Services.AddScoped<ServicioProducto>();
builder.Services.AddScoped<ServicioLog>();
builder.Services.AddScoped<ServicioActualizacion>();
//builder.Services.AddHostedService<ServicioEmail>();

builder.Services.AddScoped(provider =>
{
    var repoCompra = provider.GetRequiredService<IRepoCompra>();
    var servicioEmail = provider.GetRequiredService<ServicioEmail>();
    //repoCompra.Subscribir(servicioEmail);
    return servicioEmail;
});

#region Conexión BD
/* Local Guillermo, Leandro */
//builder.Services.AddDbContext<AllToImportContext>(
//    options => options.UseSqlServer(
//        builder.Configuration.GetConnectionString("AllToImportAPI")
//        )
//    );

/* Local Agustina */
builder.Services.AddDbContext<AllToImportContext>(
    options => options.UseSqlServer(
        builder.Configuration.GetConnectionString("AllToImportAPI")
        )
    );


/*Azure cuenta Leandro*/
//builder.Services.AddDbContext<AllToImportContext>(
//    options => options.UseSqlServer(
//        builder.Configuration.GetConnectionString("DBSqlAllToImportAPI")
//        )
//    );

/*Azure cuenta Agustina*/
//builder.Services.AddDbContext<AllToImportContext>(
//    options => options.UseSqlServer(
//        builder.Configuration.GetConnectionString("DBSqlAllToImportSasAPI")
//        )
//    );
#endregion


#region Email
builder.Services.Configure<SendGridConfiguracion>(builder.Configuration.GetSection("SendGridSettings"));
builder.Services.AddTransient<ServicioEmail>();

#endregion

//Incluirá los comentarios XML en la documentación generada
builder.Services.AddSwaggerGen(opt => opt.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, "AllToImportAPI.xml")));

#region Configura el servicio CORS
// Configura el servicio CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder
            .WithOrigins("http://localhost:5173", "http://localhost:5174", "https://alltoimport.netlify.app", "https://alltoimportadmin.netlify.app") // Origen del frontend
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials() // Permite el envío de cookies si es necesario

    );
});
#endregion

#region Integración

string tokenGit = builder.Configuration["GitHubToken"];
builder.Services.AddSingleton(sp => new ServicioGitHub(
    tokenGit,
    "AgustinaGoni",
    "IntegracionFalsa"
));

//builder.Services.AddHostedService<ServicioActualizacion>();

#endregion

#region Configurar el serializador JSON para manejar referencias cíclicas
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

#endregion


#region Configurar el serializador JSON para manejar referencias cíclicas
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

#endregion


#region  Configurar el middleware de JWT

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });
#endregion

// Configurar servicios
//builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
//    .AddCookie(options =>
//    {
//        options.Cookie.HttpOnly = true;
//        options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Solo HTTPS
//        options.Cookie.SameSite = SameSiteMode.Strict;
//    });


// Configura el logging para la consola y otros destinos
builder.Logging.ClearProviders();
builder.Logging.AddConsole();  // Agrega logging a la consola
builder.Logging.AddDebug();    // Agrega logging al debug (visible en Visual Studio)
builder.Logging.AddFilter("Microsoft.AspNetCore.Authentication", LogLevel.Debug);

builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Aplica la política CORS
app.UseCors("AllowAll");
app.UseRouting();

app.UseAuthentication();  // Middleware de autenticación
app.UseAuthorization();   // Middleware de autorización




app.UseHttpsRedirection();

app.MapControllers();

app.Run();

