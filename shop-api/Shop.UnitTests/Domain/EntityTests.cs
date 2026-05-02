using FluentAssertions;
using Shop.Domain.Entities;
using Shop.Domain.Enums;

namespace Shop.UnitTests.Domain;

public class EntityTests
{
    [Fact]
    public void Product_ShouldInitializeWithDefaultValues()
    {
        var product = new Product();

        product.Name.Should().BeEmpty();
        product.Price.Should().Be(0);
        product.Status.Should().Be(ProductStatus.Active);
        product.Sizes.Should().NotBeNull().And.BeEmpty();
        product.OrderItems.Should().NotBeNull().And.BeEmpty();
    }

    [Fact]
    public void Product_ShouldSetProperties()
    {
        var product = new Product
        {
            Name = "Test",
            Sku = "SKU-001",
            Price = 100m,
            CostPrice = 50m,
            TotalStock = 10,
            Brand = "BrandX",
            Status = ProductStatus.Active
        };

        product.Name.Should().Be("Test");
        product.Sku.Should().Be("SKU-001");
        product.Price.Should().Be(100m);
        product.CostPrice.Should().Be(50m);
        product.TotalStock.Should().Be(10);
        product.Brand.Should().Be("BrandX");
    }

    [Fact]
    public void Category_ShouldInitializeWithEmptyProducts()
    {
        var category = new Category { Name = "Test" };
        category.Products.Should().NotBeNull().And.BeEmpty();
    }

    [Fact]
    public void Customer_ShouldInitializeWithEmptyOrders()
    {
        var customer = new Customer
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "john@test.com",
            Phone = "123456789"
        };

        customer.Orders.Should().NotBeNull().And.BeEmpty();
        customer.Email.Should().Be("john@test.com");
    }

    [Fact]
    public void Order_ShouldCalculateTotalCorrectly()
    {
        var order = new Order
        {
            Subtotal = 100m,
            Tax = 16m,
            ShippingCost = 10m,
            Total = 126m
        };

        order.Total.Should().Be(126m);
        order.Status.Should().Be(OrderStatus.Pending);
    }

    [Fact]
    public void OrderItem_ShouldSetProperties()
    {
        var item = new OrderItem
        {
            Quantity = 2,
            UnitPrice = 50m,
            Total = 100m,
            Size = Size.M
        };

        item.Quantity.Should().Be(2);
        item.UnitPrice.Should().Be(50m);
        item.Total.Should().Be(100m);
        item.Size.Should().Be(Size.M);
    }

    [Fact]
    public void ProductSize_ShouldSetProperties()
    {
        var size = new ProductSize
        {
            Size = Size.L,
            Stock = 25
        };

        size.Size.Should().Be(Size.L);
        size.Stock.Should().Be(25);
    }

    [Fact]
    public void BaseEntity_ShouldHaveEmptyIdAfterConstruction()
    {
        var entity = new Product();
        entity.Id.Should().BeEmpty();
    }

    [Fact]
    public void Enums_ShouldHaveCorrectValues()
    {
        Enum.GetValues<Size>().Should().Contain(Size.XS);
        Enum.GetValues<Size>().Should().Contain(Size.XXL);
        Enum.GetValues<Gender>().Should().Contain(Gender.Men);
        Enum.GetValues<Gender>().Should().Contain(Gender.Kids);
        Enum.GetValues<OrderStatus>().Should().Contain(OrderStatus.Cancelled);
        Enum.GetValues<ProductStatus>().Should().Contain(ProductStatus.Active);
    }
}

public class ExceptionTests
{
    [Fact]
    public void NotFoundException_ShouldFormatMessage()
    {
        var ex = new Shop.Domain.Exceptions.NotFoundException("Product", Guid.NewGuid());
        ex.Message.Should().Contain("Product").And.Contain("not found");
    }

    [Fact]
    public void AlreadyExistsException_ShouldFormatMessage()
    {
        var ex = new Shop.Domain.Exceptions.AlreadyExistsException("SKU", "ABC-123");
        ex.Message.Should().Contain("SKU").And.Contain("ABC-123").And.Contain("already exists");
    }

    [Fact]
    public void InvalidEntityStateException_ShouldContainMessage()
    {
        var ex = new Shop.Domain.Exceptions.InvalidEntityStateException("Invalid state");
        ex.Message.Should().Be("Invalid state");
    }
}
