using FluentAssertions;
using Shop.Application.DTOs;
using Shop.Application.Features.Categories;

namespace Shop.UnitTests.Application.Validators;

public class CategoryValidatorTests
{
    private readonly CreateCategoryValidator _createValidator = new();
    private readonly UpdateCategoryValidator _updateValidator = new();

    [Fact]
    public void CreateCategory_ValidDto_ShouldPass()
    {
        var dto = new CreateCategoryDto("Camisetas", "Desc");
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData("A")]
    public void CreateCategory_InvalidName_ShouldFail(string name)
    {
        var dto = new CreateCategoryDto(name, null);
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void CreateCategory_NameExceeds100Chars_ShouldFail()
    {
        var dto = new CreateCategoryDto(new string('X', 101), null);
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void CreateCategory_DescriptionExceeds500_ShouldFail()
    {
        var dto = new CreateCategoryDto("Valid", new string('D', 501));
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeFalse();
    }
}
