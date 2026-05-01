using Auth.Domain.Entities;
using Auth.Domain.Enums;
using Auth.Infrastructure.Services;
using FluentAssertions;
using Microsoft.Extensions.Configuration;

namespace Auth.UnitTests.Infrastructure;

public class JwtServiceTests
{
    private readonly IJwtService _service;

    public JwtServiceTests()
    {
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                { "Jwt:Key", "TestKeyForUnitTesting1234567890!!" },
                { "Jwt:Issuer", "https://test.auth.com" },
                { "Jwt:Audience", "test-audience" },
                { "Jwt:AccessTokenExpiryMinutes", "30" },
                { "Jwt:RefreshTokenExpiryDays", "7" }
            })
            .Build();

        _service = new JwtService(config);
    }

    [Fact]
    public void GenerateAccessToken_ShouldReturnToken()
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = "test@auth.com",
            FirstName = "Test",
            LastName = "User",
            Role = UserRole.Customer
        };

        var (token, expiry) = _service.GenerateAccessToken(user);

        token.Should().NotBeNull();
        token.Split('.').Should().HaveCount(3);
        expiry.Should().BeAfter(DateTime.UtcNow);
    }

    [Fact]
    public void GenerateRefreshToken_ShouldReturnRandomToken()
    {
        var (token1, expiry1) = _service.GenerateRefreshToken();
        var (token2, _) = _service.GenerateRefreshToken();

        token1.Should().NotBe(token2);
        token1.Length.Should().BeGreaterThan(10);
        expiry1.Should().BeAfter(DateTime.UtcNow);
    }

    [Fact]
    public void ValidateToken_ValidToken_ShouldReturnPrincipal()
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = "user@test.com",
            FirstName = "A",
            LastName = "B",
            Role = UserRole.Admin
        };

        var (token, _) = _service.GenerateAccessToken(user);
        var principal = _service.ValidateToken(token);

        principal.Should().NotBeNull();
        principal!.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value.Should().Be(user.Id.ToString());
        principal.FindFirst(System.Security.Claims.ClaimTypes.Email)!.Value.Should().Be("user@test.com");
    }

    [Fact]
    public void ValidateToken_InvalidToken_ShouldReturnNull()
    {
        var result = _service.ValidateToken("invalid.token.here");
        result.Should().BeNull();
    }

    [Fact]
    public void ValidateToken_EmptyToken_ShouldReturnNull()
    {
        var result = _service.ValidateToken("");
        result.Should().BeNull();
    }

    [Fact]
    public void ValidateToken_ExpiredToken_ShouldReturnNull()
    {
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                { "Jwt:Key", "TestKeyForUnitTesting1234567890!!" },
                { "Jwt:Issuer", "https://test.auth.com" },
                { "Jwt:Audience", "test-audience" },
                { "Jwt:AccessTokenExpiryMinutes", "0" },
                { "Jwt:RefreshTokenExpiryDays", "7" }
            })
            .Build();

        var service = new JwtService(config);
        var user = new User
        {
            Id = Guid.NewGuid(), Email = "x@x.com",
            FirstName = "X", LastName = "Y", Role = UserRole.Customer
        };

        var (token, _) = service.GenerateAccessToken(user);
        var result = service.ValidateToken(token);

        result.Should().BeNull();
    }
}
