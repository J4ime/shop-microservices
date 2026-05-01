namespace Shop.Application.DTOs;

public record CustomerResponse(
    Guid Id, string FirstName, string LastName,
    string Email, string Phone, string? Address, string? City,
    string? State, string? PostalCode, string? Country,
    int TotalOrders, DateTime CreatedAt, DateTime? UpdatedAt
);
