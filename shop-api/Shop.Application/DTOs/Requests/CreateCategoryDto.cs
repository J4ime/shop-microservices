using Shop.Domain.Enums;

namespace Shop.Application.DTOs;

public record CreateCategoryDto(string Name, string? Description, Gender? Gender);
