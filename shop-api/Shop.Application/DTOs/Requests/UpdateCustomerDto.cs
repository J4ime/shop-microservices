namespace Shop.Application.DTOs;

public record UpdateCustomerDto(
    string FirstName,
    string LastName,
    string Phone,
    string? Address,
    string? City,
    string? State,
    string? PostalCode,
    string? Country
);
