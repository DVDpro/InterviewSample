using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;

namespace ApiGateway
{
    public class Startup
    {
        private IConfiguration Configuration { get; }
        public ILogger<Startup> Log { get; }

        public Startup(IConfiguration configuration, ILogger<Startup> logger)
        {
            Configuration = configuration;
            Log = logger;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .SetIsOriginAllowed((host) => true)
                    .AllowCredentials());
            });

            services.AddAuthentication()
                .AddJwtBearer("STS", x =>
                {
                    x.Authority = Configuration["IdentityServiceUrl"];
                    x.RequireHttpsMetadata = false;
                    x.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters()
                    {
                        ValidAudiences = new[] { "data" }
                    };
                    x.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents()
                    {// custom detail diagnostics for JWT
                        OnAuthenticationFailed = async ctx =>
                        {
                            Log.LogDebug($"{nameof(Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents.OnAuthenticationFailed)} - Result:{ctx.Result}, Exception:{ctx.Exception}");
                        },
                        OnTokenValidated = async ctx =>
                        {
                            Log.LogDebug($"{nameof(Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents.OnTokenValidated)} - Result:{ctx.Result}");
                        },

                        OnMessageReceived = async ctx =>
                        {
                            Log.LogDebug($"{nameof(Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents.OnMessageReceived)} - Result:{ctx.Result}");
                        }
                    };
                });

            services.AddOcelot(Configuration);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseCors("CorsPolicy");
            app.UseOcelot().Wait();
        }
    }
}
