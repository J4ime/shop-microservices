using Shop.Domain.Enums;

namespace Shop.Application.DTOs;

public record CategoryResponse(
    Guid Id, string Name, string? Description, Gender? Gender,
    int ProductCount, DateTime CreatedAt, DateTime? UpdatedAt
);
