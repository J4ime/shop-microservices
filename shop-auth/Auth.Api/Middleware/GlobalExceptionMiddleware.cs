using System.Net;
using System.Text.Json;
using Auth.Domain.Exceptions;

namespace Auth.Api.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception.");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var (statusCode, error) = exception switch
        {
            InvalidCredentialsException => ((int)HttpStatusCode.Unauthorized,
                new { type = "Unauthorized", message = exception.Message }),
            InvalidTokenException => ((int)HttpStatusCode.Unauthorized,
                new { type = "InvalidToken", message = exception.Message }),
            UserInactiveException => ((int)HttpStatusCode.Forbidden,
                new { type = "Forbidden", message = exception.Message }),
            UserNotFoundException => ((int)HttpStatusCode.NotFound,
                new { type = "NotFound", message = exception.Message }),
            UserAlreadyExistsException => ((int)HttpStatusCode.Conflict,
                new { type = "Conflict", message = exception.Message }),
            _ => ((int)HttpStatusCode.InternalServerError,
                new { type = "InternalError", message = "An unexpected error occurred." })
        };

        context.Response.StatusCode = statusCode;
        await context.Response.WriteAsync(JsonSerializer.Serialize(
            new { success = false, error },
            new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }));
    }
}
