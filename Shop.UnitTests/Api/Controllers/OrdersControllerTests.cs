using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Shop.Api.Controllers;
using Shop.Application.DTOs;
using Shop.Application.Features.Orders;
using Shop.Domain.Enums;

namespace Shop.UnitTests.Api.Controllers;

public class OrdersControllerTests
{
    private readonly Mock<IMediator> _mediatorMock = new();
    private readonly OrdersController _controller;

    public OrdersControllerTests()
    {
        _controller = new OrdersController(_mediatorMock.Object);
    }

    [Fact]
    public async Task GetAll_ShouldReturnPagedOrders()
    {
        var response = new PagedResponse<OrderResponse>([], 0, 1, 10);
        _mediatorMock.Setup(m => m.Send(It.IsAny<GetAllOrdersQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(response);

        var result = await _controller.GetAll();
        result.Result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task Create_ShouldReturnCreated()
    {
        var response = new OrderResponse(
            Guid.NewGuid(), "ORD-001", Guid.NewGuid(), "Test User",
            OrderStatus.Pending, 100, 16, 0, 116, null, null, [], DateTime.UtcNow, null);

        _mediatorMock.Setup(m => m.Send(It.IsAny<CreateOrderCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(response);

        var dto = new CreateOrderDto(Guid.NewGuid(), null, null, 0,
            [new(Guid.NewGuid(), Size.M, 1)]);

        var result = await _controller.Create(dto);
        result.Result.Should().BeOfType<CreatedAtActionResult>();
    }

    [Fact]
    public async Task UpdateStatus_ShouldReturnOk()
    {
        var response = new OrderResponse(
            Guid.NewGuid(), "ORD-001", Guid.NewGuid(), "User",
            OrderStatus.Confirmed, 100, 16, 0, 116, null, null, [], DateTime.UtcNow, null);

        _mediatorMock.Setup(m => m.Send(It.IsAny<UpdateOrderStatusCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(response);

        var dto = new UpdateOrderStatusDto(OrderStatus.Confirmed);
        var result = await _controller.UpdateStatus(Guid.NewGuid(), dto);
        result.Result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task Cancel_ShouldReturnOk()
    {
        var response = new OrderResponse(
            Guid.NewGuid(), "ORD-001", Guid.NewGuid(), "User",
            OrderStatus.Cancelled, 100, 16, 0, 116, null, null, [], DateTime.UtcNow, null);

        _mediatorMock.Setup(m => m.Send(It.IsAny<CancelOrderCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(response);

        var result = await _controller.Cancel(Guid.NewGuid());
        result.Result.Should().BeOfType<OkObjectResult>();
    }
}
