using FluentAssertions;
using Shop.Application.DTOs;
using Shop.Application.Features.Products;
using Shop.Domain.Enums;

namespace Shop.UnitTests.Application.Validators;

public class ProductValidatorTests
{
    private readonly CreateProductValidator _createValidator = new();
    private readonly UpdateProductValidator _updateValidator = new();

    private static CreateProductDto ValidCreateDto() => new(
        "Camiseta Test", "Descripción válida del producto", "SKU-001",
        100m, 50m, 100, "Brand", "Material", "Rojo",
        Guid.NewGuid(), [new(Size.M, 50)]
    );

    [Fact]
    public void CreateProduct_ValidDto_ShouldPass()
    {
        var dto = ValidCreateDto();
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData("", "Name is required")]
    [InlineData("AB", "at least 3")]
    public void CreateProduct_InvalidName_ShouldFail(string name, string expectedError)
    {
        var dto = ValidCreateDto() with { Name = name };
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.ErrorMessage.Contains(expectedError));
    }

    [Fact]
    public void CreateProduct_NameExceeds200Chars_ShouldFail()
    {
        var dto = ValidCreateDto() with { Name = new string('A', 201) };
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.ErrorMessage.Contains("200"));
    }

    [Theory]
    [InlineData("", "Description")]
    [InlineData("Short", "10")]
    public void CreateProduct_InvalidDescription_ShouldFail(string desc, string expectedError)
    {
        var dto = ValidCreateDto() with { Description = desc };
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.ErrorMessage.Contains(expectedError));
    }

    [Theory]
    [InlineData("")]
    [InlineData("invalid sku with spaces")]
    [InlineData("sku with $pecial")]
    public void CreateProduct_InvalidSku_ShouldFail(string sku)
    {
        var dto = ValidCreateDto() with { Sku = sku };
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void CreateProduct_ValidSkuWithHyphen_ShouldPass()
    {
        var dto = ValidCreateDto() with { Sku = "CAM-ALG-001" };
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public void CreateProduct_InvalidPrice_ShouldFail(decimal price)
    {
        var dto = ValidCreateDto() with { Price = price };
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Price");
    }

    [Fact]
    public void CreateProduct_PriceOverLimit_ShouldFail()
    {
        var dto = ValidCreateDto() with { Price = 2000000m };
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.ErrorMessage.Contains("1,000,000"));
    }

    [Fact]
    public void CreateProduct_CostPriceGreaterThanPrice_ShouldFail()
    {
        var dto = ValidCreateDto() with { Price = 50m, CostPrice = 100m };
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.ErrorMessage.Contains("Cost price"));
    }

    [Fact]
    public void CreateProduct_NegativeStock_ShouldFail()
    {
        var dto = ValidCreateDto() with { TotalStock = -5 };
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void CreateProduct_EmptySizes_ShouldFail()
    {
        var dto = ValidCreateDto() with { Sizes = [] };
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.ErrorMessage.Contains("size"));
    }

    [Fact]
    public void CreateProduct_DuplicateSizes_ShouldFail()
    {
        var dto = ValidCreateDto() with
        {
            Sizes = [new(Size.M, 10), new(Size.M, 20)]
        };
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.ErrorMessage.Contains("Duplicate"));
    }

    [Fact]
    public void CreateProduct_NegativeSizeStock_ShouldFail()
    {
        var dto = ValidCreateDto() with
        {
            Sizes = [new(Size.M, -5)]
        };
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void UpdateProduct_ValidDto_ShouldPass()
    {
        var dto = new UpdateProductDto(
            "Updated", "Description valid enough", 150m, 75m,
            null, null, null, Guid.NewGuid(), [new(Size.L, 30)]
        );
        var result = _updateValidator.Validate(dto);
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void UpdateProduct_EmptySizes_ShouldFail()
    {
        var dto = new UpdateProductDto(
            "Updated", "Description valid enough", 150m, 75m,
            null, null, null, Guid.NewGuid(), []
        );
        var result = _updateValidator.Validate(dto);
        result.IsValid.Should().BeFalse();
    }
}

public class ProductSizeValidatorTests
{
    [Fact]
    public void ProductSize_InvalidEnum_ShouldFail()
    {
        var validator = new ProductSizeValidator();
        var dto = new ProductSizeDto((Size)999, 10);
        var result = validator.Validate(dto);
        result.IsValid.Should().BeFalse();
    }
}
