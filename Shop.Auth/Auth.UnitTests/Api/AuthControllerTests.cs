using Auth.Api.Controllers;
using Auth.Api.DTOs;
using Auth.Domain.Entities;
using Auth.Domain.Enums;
using Auth.Domain.Exceptions;
using Auth.Domain.Interfaces;
using Auth.Infrastructure.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Auth.UnitTests.Api;

public class AuthControllerTests
{
    private readonly Mock<IUserRepository> _userRepoMock = new();
    private readonly Mock<IUnitOfWork> _uowMock = new();
    private readonly Mock<IJwtService> _jwtServiceMock = new();
    private readonly AuthController _controller;

    public AuthControllerTests()
    {
        _controller = new AuthController(_userRepoMock.Object, _uowMock.Object, _jwtServiceMock.Object);
    }

    [Fact]
    public async Task Register_EmailExists_ShouldThrowUserAlreadyExists()
    {
        _userRepoMock.Setup(r => r.EmailExistsAsync("test@test.com", It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        var request = new RegisterRequest("test@test.com", "Pass1234!", "John", "Doe", null);

        await _controller.Invoking(c => c.Register(request))
            .Should().ThrowAsync<UserAlreadyExistsException>();
    }

    [Fact]
    public async Task Register_Valid_ShouldReturnTokens()
    {
        _userRepoMock.Setup(r => r.EmailExistsAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        _jwtServiceMock.Setup(j => j.GenerateAccessToken(It.IsAny<User>()))
            .Returns(("access-token-123", DateTime.UtcNow.AddHours(1)));
        _jwtServiceMock.Setup(j => j.GenerateRefreshToken())
            .Returns(("refresh-token-456", DateTime.UtcNow.AddDays(7)));

        var request = new RegisterRequest("new@test.com", "Pass1234!", "John", "Doe", null);
        var result = await _controller.Register(request);

        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.Value.Should().NotBeNull();
        _uowMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Login_UserNotFound_ShouldThrowInvalidCredentials()
    {
        _userRepoMock.Setup(r => r.GetByEmailAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((User?)null);

        var request = new LoginRequest("no@test.com", "Pass1234!");

        await _controller.Invoking(c => c.Login(request))
            .Should().ThrowAsync<InvalidCredentialsException>();
    }

    [Fact]
    public async Task Login_UserInactive_ShouldThrow()
    {
        var user = new User { IsActive = false, PasswordHash = BCrypt.Net.BCrypt.HashPassword("Pass1234!") };
        _userRepoMock.Setup(r => r.GetByEmailAsync("inactive@test.com", It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        var request = new LoginRequest("inactive@test.com", "Pass1234!");

        await _controller.Invoking(c => c.Login(request))
            .Should().ThrowAsync<UserInactiveException>();
    }

    [Fact]
    public async Task Login_WrongPassword_ShouldThrowInvalidCredentials()
    {
        var user = new User
        {
            IsActive = true,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("CorrectPass1!")
        };
        _userRepoMock.Setup(r => r.GetByEmailAsync("test@test.com", It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        var request = new LoginRequest("test@test.com", "WrongPass1!");

        await _controller.Invoking(c => c.Login(request))
            .Should().ThrowAsync<InvalidCredentialsException>();
    }

    [Fact]
    public async Task Login_Valid_ShouldReturnTokens()
    {
        var user = new User
        {
            Id = Guid.NewGuid(), Email = "test@test.com", IsActive = true,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Pass1234!"),
            FirstName = "John", LastName = "Doe"
        };
        _userRepoMock.Setup(r => r.GetByEmailAsync("test@test.com", It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
        _jwtServiceMock.Setup(j => j.GenerateAccessToken(user))
            .Returns(("access-token", DateTime.UtcNow.AddHours(1)));
        _jwtServiceMock.Setup(j => j.GenerateRefreshToken())
            .Returns(("refresh-token", DateTime.UtcNow.AddDays(7)));

        var request = new LoginRequest("test@test.com", "Pass1234!");
        var result = await _controller.Login(request);

        result.Result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task Refresh_InvalidToken_ShouldThrow()
    {
        _userRepoMock.Setup(r => r.GetByRefreshTokenAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((User?)null);

        var request = new RefreshTokenRequest("invalid-refresh-token");

        await _controller.Invoking(c => c.Refresh(request))
            .Should().ThrowAsync<InvalidTokenException>();
    }

    [Fact]
    public async Task Refresh_Valid_ShouldReturnNewTokens()
    {
        var user = new User { Id = Guid.NewGuid(), IsActive = true };
        _userRepoMock.Setup(r => r.GetByRefreshTokenAsync("valid-refresh", It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
        _jwtServiceMock.Setup(j => j.GenerateAccessToken(user))
            .Returns(("new-access", DateTime.UtcNow.AddHours(1)));
        _jwtServiceMock.Setup(j => j.GenerateRefreshToken())
            .Returns(("new-refresh", DateTime.UtcNow.AddDays(7)));

        var request = new RefreshTokenRequest("valid-refresh");
        var result = await _controller.Refresh(request);

        result.Result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public void ValidateToken_NoAuthHeader_ReturnsInvalid()
    {
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };

        var result = _controller.ValidateToken();
        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public void ValidateToken_ValidToken_ReturnsValid()
    {
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        _controller.Request.Headers["Authorization"] = "Bearer valid.token.here";

        _jwtServiceMock.Setup(j => j.ValidateToken("valid.token.here"))
            .Returns(new System.Security.Claims.ClaimsPrincipal(
                new System.Security.Claims.ClaimsIdentity(
                [
                    new("sub", Guid.NewGuid().ToString()),
                    new(System.Security.Claims.ClaimTypes.Email, "x@x.com"),
                    new(System.Security.Claims.ClaimTypes.Role, "Customer")
                ])));

        var result = _controller.ValidateToken();
        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task Revoke_Valid_ShouldClearTokens()
    {
        var user = new User { Id = Guid.NewGuid() };
        _userRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        var principal = new System.Security.Claims.ClaimsPrincipal(
            new System.Security.Claims.ClaimsIdentity([new("sub", user.Id.ToString())]));

        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = principal }
        };

        var result = await _controller.RevokeRefreshToken();
        result.Should().BeOfType<OkObjectResult>();
        _uowMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
