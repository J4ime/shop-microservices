using FluentValidation;
using Shop.Application.DTOs;
using Shop.Domain.Enums;

namespace Shop.Application.Features.Orders;

public class CreateOrderValidator : AbstractValidator<CreateOrderDto>
{
    public CreateOrderValidator()
    {
        RuleFor(x => x.CustomerId).NotEmpty().WithMessage("Customer is required.");
        RuleFor(x => x.Items).NotEmpty().WithMessage("Order must contain at least one item.");
        RuleFor(x => x.Items).Must(i => i.GroupBy(x => new { x.ProductId, x.Size }).All(g => g.Count() == 1))
            .WithMessage("Duplicate product-size combinations are not allowed.");
        RuleFor(x => x.ShippingCost).GreaterThanOrEqualTo(0).LessThan(10000);
        RuleFor(x => x.ShippingAddress).MaximumLength(500).When(x => !string.IsNullOrEmpty(x.ShippingAddress));
        RuleFor(x => x.Notes).MaximumLength(1000).When(x => !string.IsNullOrEmpty(x.Notes));
        RuleForEach(x => x.Items).SetValidator(new OrderItemValidator());
    }
}

public class OrderItemValidator : AbstractValidator<OrderItemDto>
{
    public OrderItemValidator()
    {
        RuleFor(x => x.ProductId).NotEmpty();
        RuleFor(x => x.Size).IsInEnum().WithMessage("Invalid size.");
        RuleFor(x => x.Quantity).GreaterThan(0).WithMessage("Quantity must be greater than 0.")
            .LessThanOrEqualTo(100).WithMessage("Maximum quantity per item is 100.");
    }
}

public class UpdateOrderStatusValidator : AbstractValidator<UpdateOrderStatusDto>
{
    public UpdateOrderStatusValidator()
    {
        RuleFor(x => x.Status).IsInEnum();
        RuleFor(x => x.Status).NotEqual(OrderStatus.Pending).WithMessage("Cannot set status to Pending.");
    }
}
