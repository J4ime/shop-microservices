namespace Shop.Application.Common.Interfaces;

public interface ITokenValidationService
{
    Task<bool> IsTokenValidAsync(string token, CancellationToken cancellationToken = default);
    Task<Dictionary<string, string>?> GetTokenClaimsAsync(string token, CancellationToken cancellationToken = default);
}

public interface IDateTimeService
{
    DateTime Now { get; }
    DateTime UtcNow { get; }
}
