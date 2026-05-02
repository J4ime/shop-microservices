namespace Shop.Application.DTOs;

public record CreateProductDto(
    string Name, string Description, string Sku,
    decimal Price, decimal CostPrice, int TotalStock,
    string? Brand, string? Material, string? Color, string? ImageUrl,
    Guid CategoryId, List<ProductSizeDto> Sizes
);
