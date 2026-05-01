using System.ComponentModel.DataAnnotations;

namespace Auth.Api.DTOs;

public record RegisterRequest(
    [Required][EmailAddress][MaxLength(254)] string Email,
    [Required][MinLength(8)][MaxLength(100)] string Password,
    [Required][MinLength(2)][MaxLength(100)] string FirstName,
    [Required][MinLength(2)][MaxLength(100)] string LastName,
    [MaxLength(20)] string? Phone
);

public record LoginRequest(
    [Required][EmailAddress] string Email,
    [Required] string Password
);

public record RefreshTokenRequest(
    [Required] string RefreshToken
);

public record TokenResponse(
    string AccessToken,
    int ExpiresIn,
    string RefreshToken,
    int RefreshTokenExpiresIn,
    string TokenType
);

public record UserResponse(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    string? Phone,
    string Role,
    bool IsActive,
    DateTime CreatedAt
);

public record ValidateResponse(
    bool Valid,
    Guid? UserId,
    string? Email,
    string? Role
);
