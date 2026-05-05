using AutoMapper;
using Shop.Application.DTOs;
using Shop.Domain.Entities;

namespace Shop.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<CreateProductDto, Product>()
            .ForMember(d => d.TotalStock, o => o.Ignore());
        CreateMap<UpdateProductDto, Product>();
        CreateMap<ProductSizeDto, ProductSize>();

        CreateMap<Product, ProductResponse>()
            .ConstructUsing(src => new ProductResponse(
                src.Id, src.Name, src.Description, src.Sku,
                src.Price, src.CostPrice, src.TotalStock,
                src.Status, src.Gender, src.Brand, src.Material, src.Color,
                src.ImageData != null && src.ImageData.Length > 0
                    ? $"/api/products/{src.Id}/image"
                    : src.ImageUrl,
                src.ImageData != null && src.ImageData.Length > 0,
                src.CategoryId, src.Category != null ? src.Category.Name : "",
                src.Sizes.Select(s => new ProductSizeResponse(s.Id, s.Size, s.Stock)).ToList(),
                src.CreatedAt, src.UpdatedAt));

        CreateMap<ProductSize, ProductSizeResponse>();

        CreateMap<CreateCategoryDto, Category>();
        CreateMap<UpdateCategoryDto, Category>();
        CreateMap<Category, CategoryResponse>()
            .ConstructUsing(src => new CategoryResponse(
                src.Id, src.Name, src.Description,
                src.Products != null ? src.Products.Count : 0, src.CreatedAt, src.UpdatedAt));

        CreateMap<CreateCustomerDto, Customer>();
        CreateMap<UpdateCustomerDto, Customer>();
        CreateMap<Customer, CustomerResponse>()
            .ConstructUsing(src => new CustomerResponse(
                src.Id, src.FirstName, src.LastName,
                src.Email, src.Phone, src.Address, src.City,
                src.State, src.PostalCode, src.Country,
                src.Orders != null ? src.Orders.Count : 0, src.CreatedAt, src.UpdatedAt));

        CreateMap<CreateOrderDto, Order>();
        CreateMap<Order, OrderResponse>()
            .ConstructUsing(src => new OrderResponse(
                src.Id, src.OrderNumber, src.CustomerId,
                src.Customer != null ? $"{src.Customer.FirstName} {src.Customer.LastName}" : "",
                src.Status, src.Subtotal, src.Tax, src.ShippingCost,
                src.Total, src.Notes, src.ShippingAddress,
                src.Items.Select(i => new OrderItemResponse(
                    i.Id, i.ProductId, i.Product != null ? i.Product.Name : "",
                    i.Size, i.Quantity, i.UnitPrice, i.Total)).ToList(),
                src.CreatedAt, src.UpdatedAt));

        CreateMap<OrderItem, OrderItemResponse>()
            .ConstructUsing(src => new OrderItemResponse(
                src.Id, src.ProductId, src.Product != null ? src.Product.Name : "",
                src.Size, src.Quantity, src.UnitPrice, src.Total));
    }
}
