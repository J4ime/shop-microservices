using Shop.Domain.Enums;

namespace Shop.Application.DTOs;

public record OrderResponse(
    Guid Id, string OrderNumber, Guid CustomerId, string CustomerName,
    OrderStatus Status, decimal Subtotal, decimal Tax, decimal ShippingCost,
    decimal Total, string? Notes, string? ShippingAddress,
    List<OrderItemResponse> Items, DateTime CreatedAt, DateTime? UpdatedAt
);
