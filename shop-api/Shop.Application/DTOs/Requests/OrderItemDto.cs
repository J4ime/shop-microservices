using Shop.Domain.Enums;

namespace Shop.Application.DTOs;

public record OrderItemDto(Guid ProductId, Size Size, int Quantity);
