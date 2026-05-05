using Shop.Domain.Enums;

namespace Shop.Application.DTOs;

public record ProductResponse(
    Guid Id, string Name, string Description, string Sku,
    decimal Price, decimal CostPrice, int TotalStock,
    ProductStatus Status, Gender Gender, string? Brand, string? Material, string? Color, string? ImageUrl,
    bool HasImage,
    Guid CategoryId, string CategoryName,
    List<ProductSizeResponse> Sizes,
    DateTime CreatedAt, DateTime? UpdatedAt
);
