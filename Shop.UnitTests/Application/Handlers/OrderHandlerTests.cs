using AutoMapper;
using FluentAssertions;
using Moq;
using Shop.Application.DTOs;
using Shop.Application.Features.Orders;
using Shop.Domain.Entities;
using Shop.Domain.Enums;
using Shop.Domain.Exceptions;
using Shop.Domain.Interfaces;

namespace Shop.UnitTests.Application.Handlers;

public class OrderHandlerTests
{
    private readonly Mock<IOrderRepository> _orderRepoMock = new();
    private readonly Mock<IProductRepository> _productRepoMock = new();
    private readonly Mock<ICustomerRepository> _customerRepoMock = new();
    private readonly Mock<IUnitOfWork> _uowMock = new();
    private readonly IMapper _mapper;

    public OrderHandlerTests()
    {
        _mapper = TestMapper.Instance;
    }

    [Fact]
    public async Task CreateOrder_CustomerNotFound_ShouldThrowNotFound()
    {
        _customerRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Customer?)null);

        var handler = new CreateOrderHandler(_orderRepoMock.Object, _productRepoMock.Object,
            _customerRepoMock.Object, _uowMock.Object, _mapper);

        var cmd = new CreateOrderCommand(new CreateOrderDto(
            Guid.NewGuid(), null, null, 0,
            [new(Guid.NewGuid(), Size.M, 1)]));

        await handler.Invoking(h => h.Handle(cmd, CancellationToken.None))
            .Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task CreateOrder_ProductNotFound_ShouldThrowNotFound()
    {
        var customer = new Customer { Id = Guid.NewGuid(), Email = "c@test.com" };
        _customerRepoMock.Setup(r => r.GetByIdAsync(customer.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(customer);
        _productRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Product?)null);

        var handler = new CreateOrderHandler(_orderRepoMock.Object, _productRepoMock.Object,
            _customerRepoMock.Object, _uowMock.Object, _mapper);

        var cmd = new CreateOrderCommand(new CreateOrderDto(
            customer.Id, null, null, 0, [new(Guid.NewGuid(), Size.M, 1)]));

        await handler.Invoking(h => h.Handle(cmd, CancellationToken.None))
            .Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task CreateOrder_ProductInactive_ShouldThrowInvalidState()
    {
        var customer = new Customer { Id = Guid.NewGuid() };
        var product = new Product
        {
            Id = Guid.NewGuid(), Name = "P1", Price = 100, TotalStock = 10,
            Status = ProductStatus.Discontinued
        };

        _customerRepoMock.Setup(r => r.GetByIdAsync(customer.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(customer);
        _productRepoMock.Setup(r => r.GetByIdAsync(product.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(product);

        var handler = new CreateOrderHandler(_orderRepoMock.Object, _productRepoMock.Object,
            _customerRepoMock.Object, _uowMock.Object, _mapper);

        var cmd = new CreateOrderCommand(new CreateOrderDto(
            customer.Id, null, null, 0, [new(product.Id, Size.M, 1)]));

        await handler.Invoking(h => h.Handle(cmd, CancellationToken.None))
            .Should().ThrowAsync<InvalidEntityStateException>();
    }

    [Fact]
    public async Task CreateOrder_InsufficientStock_ShouldThrowInvalidState()
    {
        var customer = new Customer { Id = Guid.NewGuid() };
        var product = new Product
        {
            Id = Guid.NewGuid(), Name = "P1", Price = 100, TotalStock = 2,
            Status = ProductStatus.Active
        };

        _customerRepoMock.Setup(r => r.GetByIdAsync(customer.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(customer);
        _productRepoMock.Setup(r => r.GetByIdAsync(product.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(product);

        var handler = new CreateOrderHandler(_orderRepoMock.Object, _productRepoMock.Object,
            _customerRepoMock.Object, _uowMock.Object, _mapper);

        var cmd = new CreateOrderCommand(new CreateOrderDto(
            customer.Id, null, null, 0, [new(product.Id, Size.M, 10)]));

        await handler.Invoking(h => h.Handle(cmd, CancellationToken.None))
            .Should().ThrowAsync<InvalidEntityStateException>();
    }

    [Fact]
    public async Task CreateOrder_Valid_ShouldCreateOrder()
    {
        var customer = new Customer { Id = Guid.NewGuid(), FirstName = "C", LastName = "L" };
        var product = new Product
        {
            Id = Guid.NewGuid(), Name = "P1", Price = 200, TotalStock = 5,
            Status = ProductStatus.Active, Category = new Category { Name = "Cat" }
        };

        _customerRepoMock.Setup(r => r.GetByIdAsync(customer.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(customer);
        _productRepoMock.Setup(r => r.GetByIdAsync(product.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(product);
        _orderRepoMock.Setup(r => r.AddAsync(It.IsAny<Order>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Order o, CancellationToken _) => o);

        var handler = new CreateOrderHandler(_orderRepoMock.Object, _productRepoMock.Object,
            _customerRepoMock.Object, _uowMock.Object, _mapper);

        var cmd = new CreateOrderCommand(new CreateOrderDto(
            customer.Id, "Addr", "Note", 50m, [new(product.Id, Size.M, 2)]));

        var result = await handler.Handle(cmd, CancellationToken.None);

        result.Should().NotBeNull();
        result.Subtotal.Should().Be(400);
        result.Tax.Should().Be(64);
        result.Total.Should().Be(514);
        result.Items.Should().HaveCount(1);
        product.TotalStock.Should().Be(3);
    }

    [Fact]
    public async Task CancelOrder_ShippedStatus_ShouldThrow()
    {
        var order = new Order { Id = Guid.NewGuid(), Status = OrderStatus.Shipped };
        _orderRepoMock.Setup(r => r.GetByIdAsync(order.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(order);

        var handler = new CancelOrderHandler(_orderRepoMock.Object, _uowMock.Object, _mapper);

        await handler.Invoking(h => h.Handle(
                new CancelOrderCommand(order.Id), CancellationToken.None))
            .Should().ThrowAsync<InvalidEntityStateException>();
    }

    [Fact]
    public async Task CancelOrder_Pending_ShouldCancel()
    {
        var order = new Order
        {
            Id = Guid.NewGuid(), Status = OrderStatus.Pending,
            Customer = new Customer { FirstName = "X", LastName = "Y" }
        };
        _orderRepoMock.Setup(r => r.GetByIdAsync(order.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(order);

        var handler = new CancelOrderHandler(_orderRepoMock.Object, _uowMock.Object, _mapper);
        var result = await handler.Handle(new CancelOrderCommand(order.Id), CancellationToken.None);

        result.Status.Should().Be(OrderStatus.Cancelled);
    }
}
