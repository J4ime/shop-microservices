using FluentAssertions;
using Shop.Application.DTOs;
using Shop.Application.Features.Customers;

namespace Shop.UnitTests.Application.Validators;

public class CustomerValidatorTests
{
    private readonly CreateCustomerValidator _createValidator = new();
    private readonly UpdateCustomerValidator _updateValidator = new();

    [Fact]
    public void CreateCustomer_ValidDto_ShouldPass()
    {
        var dto = new CreateCustomerDto(
            "Carlos", "Mendoza", "carlos@test.com", "+525512345678",
            null, null, null, null, null, null);
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData("A")]
    public void CreateCustomer_InvalidFirstName_ShouldFail(string name)
    {
        var dto = ValidDto() with { FirstName = name };
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeFalse();
    }

    [Theory]
    [InlineData("")]
    [InlineData("B")]
    public void CreateCustomer_InvalidLastName_ShouldFail(string name)
    {
        var dto = ValidDto() with { LastName = name };
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeFalse();
    }

    [Theory]
    [InlineData("", "is required")]
    [InlineData("notanemail", "Invalid email")]
    [InlineData("invalid@", "Invalid email")]
    public void CreateCustomer_InvalidEmail_ShouldFail(string email, string _)
    {
        var dto = ValidDto() with { Email = email };
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeFalse();
    }

    [Theory]
    [InlineData("")]
    [InlineData("abc")]
    public void CreateCustomer_InvalidPhone_ShouldFail(string phone)
    {
        var dto = ValidDto() with { Phone = phone };
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void CreateCustomer_PhoneWithPlusAndDigits_ShouldPass()
    {
        var dto = ValidDto() with { Phone = "+1 (555) 123-4567" };
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void CreateCustomer_FirstNameWithSpecialChars_ShouldFail()
    {
        var dto = ValidDto() with { FirstName = "Carlos123!" };
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeFalse();
    }

    private static CreateCustomerDto ValidDto() => new(
        "Carlos", "Mendoza", "carlos@test.com", "+525512345678",
        null, null, null, null, null, null);
}
