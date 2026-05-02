using Shop.Domain.Enums;

namespace Shop.Application.DTOs;

public record OrderItemResponse(
    Guid Id, Guid ProductId, string ProductName,
    Size Size, int Quantity, decimal UnitPrice, decimal Total
);
