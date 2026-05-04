using Shop.Domain.Enums;

namespace Shop.Application.DTOs;

public record UpdateProductDto(
    string Name, string Description, string Sku,
    decimal Price, decimal CostPrice, int TotalStock,
    string? Brand, string? Material, string? Color, string? ImageUrl,
    Guid CategoryId, Gender Gender, List<ProductSizeDto> Sizes
);
