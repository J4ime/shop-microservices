using FluentValidation;
using Shop.Application.DTOs;

namespace Shop.Application.Features.Products;

public class CreateProductValidator : AbstractValidator<CreateProductDto>
{
    public CreateProductValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("{PropertyName} is required.")
            .MinimumLength(3).WithMessage("{PropertyName} must be at least 3 characters.")
            .MaximumLength(200).WithMessage("{PropertyName} cannot exceed 200 characters.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("{PropertyName} is required.")
            .MinimumLength(10).WithMessage("{PropertyName} must be at least 10 characters.")
            .MaximumLength(2000).WithMessage("{PropertyName} cannot exceed 2000 characters.");

        RuleFor(x => x.Sku)
            .NotEmpty().WithMessage("{PropertyName} is required.")
            .MaximumLength(50).WithMessage("{PropertyName} cannot exceed 50 characters.")
            .Matches(@"^[A-Za-z0-9\-_]+$").WithMessage("SKU can only contain letters, numbers, hyphens and underscores.");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("{PropertyName} must be greater than 0.")
            .LessThan(1000000).WithMessage("{PropertyName} cannot exceed 1,000,000.");

        RuleFor(x => x.CostPrice)
            .GreaterThan(0).WithMessage("Cost price must be greater than 0.")
            .LessThanOrEqualTo(x => x.Price).WithMessage("Cost price cannot exceed selling price.");

        RuleFor(x => x.TotalStock)
            .GreaterThanOrEqualTo(0).WithMessage("Stock cannot be negative.")
            .LessThanOrEqualTo(100000).WithMessage("Stock cannot exceed 100,000.");

        RuleFor(x => x.Brand)
            .MaximumLength(100).When(x => !string.IsNullOrEmpty(x.Brand));

        RuleFor(x => x.Material)
            .MaximumLength(100).When(x => !string.IsNullOrEmpty(x.Material));

        RuleFor(x => x.Color)
            .MaximumLength(50).When(x => !string.IsNullOrEmpty(x.Color));

        RuleFor(x => x.ImageUrl)
            .MaximumLength(2000).When(x => !string.IsNullOrEmpty(x.ImageUrl));

        RuleFor(x => x.CategoryId)
            .NotEmpty().WithMessage("Category is required.");

        RuleFor(x => x.Sizes)
            .NotEmpty().WithMessage("At least one size is required.")
            .Must(s => s.DistinctBy(sz => sz.Size).Count() == s.Count)
            .WithMessage("Duplicate sizes are not allowed.");

        RuleForEach(x => x.Sizes).SetValidator(new ProductSizeValidator());
    }
}

public class ProductSizeValidator : AbstractValidator<ProductSizeDto>
{
    public ProductSizeValidator()
    {
        RuleFor(x => x.Size).IsInEnum().WithMessage("Invalid size.");
        RuleFor(x => x.Stock)
            .GreaterThanOrEqualTo(0).WithMessage("Size stock cannot be negative.")
            .LessThanOrEqualTo(100000).WithMessage("Size stock cannot exceed 100,000.");
    }
}

public class UpdateProductValidator : AbstractValidator<UpdateProductDto>
{
    public UpdateProductValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MinimumLength(3).MaximumLength(200);
        RuleFor(x => x.Description).NotEmpty().MinimumLength(10).MaximumLength(2000);
        RuleFor(x => x.Sku).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Price).GreaterThan(0).LessThan(1000000);
        RuleFor(x => x.CostPrice).GreaterThan(0).LessThanOrEqualTo(x => x.Price);
        RuleFor(x => x.TotalStock).GreaterThanOrEqualTo(0);
        RuleFor(x => x.CategoryId).NotEmpty();
        RuleFor(x => x.Sizes).NotEmpty();
        RuleForEach(x => x.Sizes).SetValidator(new ProductSizeValidator());
    }
}
