using System.ComponentModel.DataAnnotations;
using Auth.Api.DTOs;
using Auth.Domain.Entities;
using Auth.Domain.Exceptions;
using Auth.Domain.Interfaces;
using Auth.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Auth.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _userRepo;
    private readonly IUnitOfWork _uow;
    private readonly IJwtService _jwtService;

    public AuthController(IUserRepository userRepo, IUnitOfWork uow, IJwtService jwtService)
    {
        _userRepo = userRepo;
        _uow = uow;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<TokenResponse>> Register([FromBody] RegisterRequest request)
    {
        if (await _userRepo.EmailExistsAsync(request.Email))
            throw new UserAlreadyExistsException(request.Email);

        var user = new User
        {
            Email = request.Email.ToLowerInvariant().Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Phone = request.Phone?.Trim(),
            Role = Domain.Enums.UserRole.Customer
        };

        var (accessToken, accessExpiry) = _jwtService.GenerateAccessToken(user);
        var (refreshToken, refreshExpiry) = _jwtService.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = refreshExpiry;

        await _userRepo.AddAsync(user);
        await _uow.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            data = new TokenResponse(
                accessToken,
                (int)(accessExpiry - DateTime.UtcNow).TotalSeconds,
                refreshToken,
                (int)(refreshExpiry - DateTime.UtcNow).TotalSeconds,
                "Bearer"
            )
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<TokenResponse>> Login([FromBody] LoginRequest request)
    {
        var user = await _userRepo.GetByEmailAsync(request.Email.ToLowerInvariant().Trim())
            ?? throw new InvalidCredentialsException();

        if (!user.IsActive)
            throw new UserInactiveException();

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new InvalidCredentialsException();

        var (accessToken, accessExpiry) = _jwtService.GenerateAccessToken(user);
        var (refreshToken, refreshExpiry) = _jwtService.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = refreshExpiry;

        await _userRepo.UpdateAsync(user);
        await _uow.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            data = new TokenResponse(
                accessToken,
                (int)(accessExpiry - DateTime.UtcNow).TotalSeconds,
                refreshToken,
                (int)(refreshExpiry - DateTime.UtcNow).TotalSeconds,
                "Bearer"
            )
        });
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<TokenResponse>> Refresh([FromBody] RefreshTokenRequest request)
    {
        var user = await _userRepo.GetByRefreshTokenAsync(request.RefreshToken)
            ?? throw new InvalidTokenException();

        if (!user.IsActive)
            throw new UserInactiveException();

        var (accessToken, accessExpiry) = _jwtService.GenerateAccessToken(user);
        var (refreshToken, refreshExpiry) = _jwtService.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = refreshExpiry;

        await _userRepo.UpdateAsync(user);
        await _uow.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            data = new TokenResponse(
                accessToken,
                (int)(accessExpiry - DateTime.UtcNow).TotalSeconds,
                refreshToken,
                (int)(refreshExpiry - DateTime.UtcNow).TotalSeconds,
                "Bearer"
            )
        });
    }

    [HttpGet("validate")]
    public IActionResult ValidateToken()
    {
        var authHeader = Request.Headers["Authorization"].FirstOrDefault();
        if (string.IsNullOrWhiteSpace(authHeader) || !authHeader.StartsWith("Bearer "))
            return Ok(new { valid = false });

        var token = authHeader.Replace("Bearer ", "");
        var principal = _jwtService.ValidateToken(token);

        if (principal is null)
            return Ok(new { valid = false });

        return Ok(new
        {
            valid = true,
            userId = principal.FindFirst("sub")?.Value,
            email = principal.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value,
            role = principal.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value
        });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserResponse>> GetProfile()
    {
        var userIdClaim = User.FindFirst("sub")?.Value
            ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrWhiteSpace(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            throw new InvalidTokenException();

        var user = await _userRepo.GetByIdAsync(userId)
            ?? throw new UserNotFoundException(userId.ToString());

        return Ok(new
        {
            success = true,
            data = new UserResponse(
                user.Id, user.Email, user.FirstName, user.LastName,
                user.Phone, user.Role.ToString(), user.IsActive, user.CreatedAt
            )
        });
    }

    [HttpPost("revoke")]
    [Authorize]
    public async Task<IActionResult> RevokeRefreshToken()
    {
        var userIdClaim = User.FindFirst("sub")?.Value
            ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrWhiteSpace(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            throw new InvalidTokenException();

        var user = await _userRepo.GetByIdAsync(userId)
            ?? throw new UserNotFoundException(userId.ToString());

        user.RefreshToken = null;
        user.RefreshTokenExpiry = null;

        await _userRepo.UpdateAsync(user);
        await _uow.SaveChangesAsync();

        return Ok(new { success = true, message = "Token revoked." });
    }
}
