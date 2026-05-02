using Shop.Domain.Enums;

namespace Shop.Application.DTOs;

public record ProductSizeResponse(Guid Id, Size Size, int Stock);
