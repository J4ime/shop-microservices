using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Shop.Application.Common.Behaviors;
using Shop.Application.Common.Interfaces;
using Shop.Application.Mappings;
using Shop.Infrastructure.Data;
using Shop.Infrastructure.Services;
using Shop.Domain.Interfaces;
using Shop.Application.Features.Products;
using Shop.Application.Features.Categories;
using Shop.Application.Features.Customers;
using Shop.Application.Features.Orders;

namespace Shop.Api.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddShopServices(
        this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton<IDateTimeService, DateTimeService>();

        services.AddHttpClient<ITokenValidationService, TokenValidationService>(client =>
        {
            client.Timeout = TimeSpan.FromSeconds(5);
        });

        var connectionString = configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<ApplicationDbContext>((sp, options) =>
        {
            var dateTimeService = sp.GetRequiredService<IDateTimeService>();
            options.UseNpgsql(connectionString);
        });

        services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<ApplicationDbContext>());

        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<ICustomerRepository, CustomerRepository>();
        services.AddScoped<IOrderRepository, OrderRepository>();

        services.AddAutoMapper(cfg =>
        {
            cfg.AddProfile<MappingProfile>();
        });
        services.AddValidatorsFromAssemblyContaining<CreateProductValidator>();
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(typeof(CreateProductCommand).Assembly);
            cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });

        return services;
    }
}
