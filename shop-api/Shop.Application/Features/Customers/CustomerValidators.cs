using FluentValidation;
using Shop.Application.DTOs;

namespace Shop.Application.Features.Customers;

public class CreateCustomerValidator : AbstractValidator<CreateCustomerDto>
{
    public CreateCustomerValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("{PropertyName} is required.")
            .MinimumLength(2).MaximumLength(100)
            .Matches(@"^[a-zA-Z\s\-'.]+$").WithMessage("Invalid first name format.");

        RuleFor(x => x.LastName)
            .NotEmpty().MinimumLength(2).MaximumLength(100)
            .Matches(@"^[a-zA-Z\s\-'.]+$").WithMessage("Invalid last name format.");

        RuleFor(x => x.Email)
            .NotEmpty().EmailAddress().MaximumLength(254)
            .WithMessage("Invalid email format.");

        RuleFor(x => x.Phone)
            .NotEmpty().MaximumLength(20)
            .Matches(@"^\+?[\d\s\-().]+$").WithMessage("Invalid phone format.");

        RuleFor(x => x.Address).MaximumLength(300).When(x => !string.IsNullOrEmpty(x.Address));
        RuleFor(x => x.City).MaximumLength(100).When(x => !string.IsNullOrEmpty(x.City));
        RuleFor(x => x.State).MaximumLength(100).When(x => !string.IsNullOrEmpty(x.State));
        RuleFor(x => x.PostalCode).MaximumLength(20).When(x => !string.IsNullOrEmpty(x.PostalCode));
        RuleFor(x => x.Country).MaximumLength(100).When(x => !string.IsNullOrEmpty(x.Country));
    }
}

public class UpdateCustomerValidator : AbstractValidator<UpdateCustomerDto>
{
    public UpdateCustomerValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().MinimumLength(2).MaximumLength(100);
        RuleFor(x => x.LastName).NotEmpty().MinimumLength(2).MaximumLength(100);
        RuleFor(x => x.Phone).NotEmpty().MaximumLength(20)
            .Matches(@"^\+?[\d\s\-().]+$");
        RuleFor(x => x.Address).MaximumLength(300).When(x => !string.IsNullOrEmpty(x.Address));
        RuleFor(x => x.City).MaximumLength(100).When(x => !string.IsNullOrEmpty(x.City));
        RuleFor(x => x.State).MaximumLength(100).When(x => !string.IsNullOrEmpty(x.State));
        RuleFor(x => x.PostalCode).MaximumLength(20).When(x => !string.IsNullOrEmpty(x.PostalCode));
        RuleFor(x => x.Country).MaximumLength(100).When(x => !string.IsNullOrEmpty(x.Country));
    }
}
