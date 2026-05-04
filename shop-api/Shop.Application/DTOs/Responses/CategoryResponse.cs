namespace Shop.Application.DTOs;

public record CategoryResponse(
    Guid Id, string Name, string? Description,
    int ProductCount, DateTime CreatedAt, DateTime? UpdatedAt
);
