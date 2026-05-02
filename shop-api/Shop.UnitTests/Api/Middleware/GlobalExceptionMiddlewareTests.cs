using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Shop.Api.Middleware;
using Shop.Domain.Exceptions;

namespace Shop.UnitTests.Api.Middleware;

public class GlobalExceptionMiddlewareTests
{
    [Fact]
    public async Task Invoke_NotFoundException_Returns404()
    {
        var middleware = new GlobalExceptionMiddleware(
            _ => throw new NotFoundException("Entity", Guid.NewGuid()),
            Mock.Of<ILogger<GlobalExceptionMiddleware>>());

        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();

        await middleware.InvokeAsync(context);

        context.Response.StatusCode.Should().Be(404);
        context.Response.Body.Seek(0, SeekOrigin.Begin);
        var body = await new StreamReader(context.Response.Body).ReadToEndAsync();
        body.Should().Contain("not found");
    }

    [Fact]
    public async Task Invoke_AlreadyExistsException_Returns409()
    {
        var middleware = new GlobalExceptionMiddleware(
            _ => throw new AlreadyExistsException("Product", "SKU-001"),
            Mock.Of<ILogger<GlobalExceptionMiddleware>>());

        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();

        await middleware.InvokeAsync(context);

        context.Response.StatusCode.Should().Be(409);
    }

    [Fact]
    public async Task Invoke_InvalidEntityStateException_Returns400()
    {
        var middleware = new GlobalExceptionMiddleware(
            _ => throw new InvalidEntityStateException("Bad state"),
            Mock.Of<ILogger<GlobalExceptionMiddleware>>());

        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();

        await middleware.InvokeAsync(context);

        context.Response.StatusCode.Should().Be(400);
    }

    [Fact]
    public async Task Invoke_GenericException_Returns500()
    {
        var middleware = new GlobalExceptionMiddleware(
            _ => throw new Exception("Unexpected"),
            Mock.Of<ILogger<GlobalExceptionMiddleware>>());

        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();

        await middleware.InvokeAsync(context);

        context.Response.StatusCode.Should().Be(500);
    }

    [Fact]
    public async Task Invoke_ValidRequest_ShouldPass()
    {
        var nextCalled = false;
        var middleware = new GlobalExceptionMiddleware(
            _ => { nextCalled = true; return Task.CompletedTask; },
            Mock.Of<ILogger<GlobalExceptionMiddleware>>());

        var context = new DefaultHttpContext();

        await middleware.InvokeAsync(context);

        nextCalled.Should().BeTrue();
    }
}
