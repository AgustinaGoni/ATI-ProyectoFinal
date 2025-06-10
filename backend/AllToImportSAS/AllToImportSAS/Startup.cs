using AccesoDatos.EntityFramework;
using Dominio.Entidades;
using Dominio.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace AllToImportSAS
{
    public class Startup
    {
        //public IConfiguration Configuration { get; }

        //public Startup(IConfiguration configuration)
        //{
        //    Configuration = configuration;
        //}

        //public void ConfigureServices(IServiceCollection services)
        //{
        //    var builder = services.AddIdentityCore<Usuario>();
        //    builder = new IdentityBuilder(builder.UserType, builder.Services);
        //    builder.AddSignInManager<SignInManager<Usuario>>();

        //}

        //public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        //{
        //    if (env.IsDevelopment())
        //    {
        //        app.UseDeveloperExceptionPage();
        //    }

        //    if (env.IsDevelopment())
        //    {
        //        app.UseSwagger();
        //        app.UseSwaggerUI();
        //    }

        //    app.UseRouting();

        //    app.UseSwaggerUI(options =>
        //    {
        //        options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
        //        options.RoutePrefix = string.Empty;
        //    });

        //    app.UseEndpoints(endpoints =>
        //    {
        //        endpoints.MapControllers();
        //    });
        //}
    }
}
