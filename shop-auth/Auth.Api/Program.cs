using System.Net.Http.Json;
using System.Text;
using Auth.Api.Extensions;
using Auth.Api.Middleware;
using Auth.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using Serilog.Core;
using Serilog.Events;

var seqUrl = Environment.GetEnvironmentVariable("SEQ_URL") ?? "http://localhost:5341";
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .Enrich.FromLogContext()
    .Enrich.WithProperty("service", "auth-api")
    .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] [{SourceContext}] {Message:lj}{NewLine}{Exception}")
    .WriteTo.Sink(new SeqHttpSink(seqUrl))
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:4000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Auth API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new()
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter your JWT token"
    });
    c.AddSecurityRequirement(new()
    {
        {
            new()
            {
                Reference = new()
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddAuthServices(builder.Configuration);

var jwtKey = builder.Configuration["Jwt:Key"] ?? "AuthDefaultKey1234567890!@#$%^&*()";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "https://auth.shop.com";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "shop-services";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = true,
            ValidAudience = jwtAudience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseCors();
if (!app.Environment.IsDevelopment())
    app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AuthDbContext>();
    db.Database.EnsureCreated();
}

app.Run();

public sealed class SeqHttpSink(string seqUrl) : ILogEventSink
{
    private static readonly HttpClient _client = new();

    public void Emit(LogEvent logEvent)
    {
        try
        {
            var body = new
            {
                Events = new[]
                {
                    new
                    {
                        Timestamp = logEvent.Timestamp.UtcDateTime.ToString("o"),
                        Level = logEvent.Level.ToString(),
                        MessageTemplate = logEvent.RenderMessage(),
                        Properties = logEvent.Properties.ToDictionary(
                            p => p.Key,
                            p => (object)p.Value.ToString())
                    }
                }
            };
            var json = System.Text.Json.JsonSerializer.Serialize(body);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            _client.PostAsync($"{seqUrl}/api/events/raw", content)
                   .ConfigureAwait(false).GetAwaiter().GetResult();
        }
        catch (Exception ex) { Console.WriteLine($"[SeqHttpSink Error] {ex.Message}"); }
    }
}
