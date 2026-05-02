using FluentAssertions;
using Shop.Application.DTOs;
using Shop.Application.Features.Orders;
using Shop.Domain.Enums;

namespace Shop.UnitTests.Application.Validators;

public class OrderValidatorTests
{
    private readonly CreateOrderValidator _createValidator = new();
    private readonly UpdateOrderStatusValidator _statusValidator = new();

    [Fact]
    public void CreateOrder_ValidDto_ShouldPass()
    {
        var dto = new CreateOrderDto(
            Guid.NewGuid(), "Address", null, 99m,
            [new(Guid.NewGuid(), Size.M, 2)]
        );
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void CreateOrder_EmptyCustomerId_ShouldFail()
    {
        var dto = ValidDto() with { CustomerId = Guid.Empty };
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void CreateOrder_NoItems_ShouldFail()
    {
        var dto = ValidDto() with { Items = [] };
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void CreateOrder_DuplicateProductSizeCombination_ShouldFail()
    {
        var productId = Guid.NewGuid();
        var dto = ValidDto() with
        {
            Items = [new(productId, Size.M, 1), new(productId, Size.M, 2)]
        };
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.ErrorMessage.Contains("Duplicate"));
    }

    [Fact]
    public void CreateOrder_NegativeShipping_ShouldFail()
    {
        var dto = ValidDto() with { ShippingCost = -1 };
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void CreateOrder_ShippingOver10K_ShouldFail()
    {
        var dto = ValidDto() with { ShippingCost = 99999 };
        var result = _createValidator.Validate(dto);
        result.IsValid.Should().BeFalse();
    }

    [Theory]
    [InlineData(0)]
    [InlineData(101)]
    public void OrderItem_InvalidQuantity_ShouldFail(int qty)
    {
        var validator = new OrderItemValidator();
        var item = new OrderItemDto(Guid.NewGuid(), Size.M, qty);
        var result = validator.Validate(item);
        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void OrderItem_InvalidSize_ShouldFail()
    {
        var validator = new OrderItemValidator();
        var item = new OrderItemDto(Guid.NewGuid(), (Size)999, 1);
        var result = validator.Validate(item);
        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void UpdateStatus_Pending_ShouldFail()
    {
        var dto = new UpdateOrderStatusDto(OrderStatus.Pending);
        var result = _statusValidator.Validate(dto);
        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void UpdateStatus_Confirmed_ShouldPass()
    {
        var dto = new UpdateOrderStatusDto(OrderStatus.Confirmed);
        var result = _statusValidator.Validate(dto);
        result.IsValid.Should().BeTrue();
    }

    private static CreateOrderDto ValidDto() => new(
        Guid.NewGuid(), "Addr", null, 50m,
        [new(Guid.NewGuid(), Size.L, 1)]
    );
}
