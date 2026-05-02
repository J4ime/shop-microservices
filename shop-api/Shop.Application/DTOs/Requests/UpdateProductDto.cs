namespace Shop.Application.DTOs;

public record UpdateProductDto(
    string Name, string Description,
    decimal Price, decimal CostPrice,
    string? Brand, string? Material, string? Color, string? ImageUrl,
    Guid CategoryId, List<ProductSizeDto> Sizes
);
