using Shop.Domain.Enums;

namespace Shop.Application.DTOs;

public record CreateOrderDto(
    Guid CustomerId,
    string? ShippingAddress,
    string? Notes,
    decimal ShippingCost,
    List<OrderItemDto> Items
);
