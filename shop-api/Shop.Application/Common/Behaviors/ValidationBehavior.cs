using FluentValidation;
using MediatR;

namespace Shop.Application.Common.Behaviors;

public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IServiceProvider _serviceProvider;

    public ValidationBehavior(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var dto = typeof(TRequest).GetProperty("Dto")?.GetValue(request);
        if (dto == null)
            return await next();

        var validatorType = typeof(IValidator<>).MakeGenericType(dto.GetType());
        if (_serviceProvider.GetService(validatorType) is not IValidator validator)
            return await next();

        var results = await validator.ValidateAsync(
            new ValidationContext<object>(dto), cancellationToken);

        if (!results.IsValid)
            throw new ValidationException(results.Errors);

        return await next();
    }
}
