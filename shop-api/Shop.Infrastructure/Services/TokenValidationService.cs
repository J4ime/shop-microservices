using System.Net.Http.Json;
using Microsoft.Extensions.Configuration;
using Shop.Application.Common.Interfaces;

namespace Shop.Infrastructure.Services;

public class TokenValidationService : ITokenValidationService
{
    private readonly HttpClient _httpClient;
    private readonly string? _authServiceUrl;

    public TokenValidationService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _authServiceUrl = configuration["AuthService:ValidationUrl"];
    }

    public async Task<bool> IsTokenValidAsync(string token, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_authServiceUrl))
            return true;

        try
        {
            var request = new HttpRequestMessage(HttpMethod.Get, _authServiceUrl);
            request.Headers.Add("Authorization", $"Bearer {token}");

            var response = await _httpClient.SendAsync(request, cancellationToken);
            if (!response.IsSuccessStatusCode)
                return false;

            var result = await response.Content.ReadFromJsonAsync<ValidateResponse>(cancellationToken: cancellationToken);
            return result?.Valid ?? false;
        }
        catch
        {
            return false;
        }
    }

    public async Task<Dictionary<string, string>?> GetTokenClaimsAsync(
        string token, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_authServiceUrl))
            return null;

        try
        {
            var request = new HttpRequestMessage(HttpMethod.Get, _authServiceUrl);
            request.Headers.Add("Authorization", $"Bearer {token}");

            var response = await _httpClient.SendAsync(request, cancellationToken);
            if (!response.IsSuccessStatusCode)
                return null;

            var result = await response.Content.ReadFromJsonAsync<ValidateResponse>(cancellationToken: cancellationToken);
            if (result is null || !result.Valid)
                return null;

            return new Dictionary<string, string>
            {
                ["sub"] = result.UserId?.ToString() ?? "",
                ["email"] = result.Email ?? "",
                ["role"] = result.Role ?? ""
            };
        }
        catch
        {
            return null;
        }
    }

    private record ValidateResponse(bool Valid, Guid? UserId, string? Email, string? Role);
}
