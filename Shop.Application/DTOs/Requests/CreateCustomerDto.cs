namespace Shop.Application.DTOs;

public record CreateCustomerDto(
    string FirstName,
    string LastName,
    string Email,
    string Phone,
    string? Address,
    string? City,
    string? State,
    string? PostalCode,
    string? Country,
    Guid? AuthUserId
);
