using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Shop.Api.Controllers;
using Shop.Application.DTOs;
using Shop.Application.Features.Products;
using Shop.Domain.Enums;

namespace Shop.UnitTests.Api.Controllers;

public class ProductsControllerTests
{
    private readonly Mock<IMediator> _mediatorMock = new();
    private readonly ProductsController _controller;

    public ProductsControllerTests()
    {
        _controller = new ProductsController(_mediatorMock.Object);
    }

    [Fact]
    public async Task GetAll_ShouldReturnPagedProducts()
    {
        var response = new PagedResponse<ProductResponse>(
            [new(Guid.NewGuid(), "P1", "D", "SKU1", 100, 50, 10,
                 ProductStatus.Active, null, null, null, Guid.NewGuid(), "Cat",
                 [], DateTime.UtcNow, null)],
            1, 1, 10);

        _mediatorMock.Setup(m => m.Send(It.IsAny<GetAllProductsQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(response);

        var result = await _controller.GetAll();
        result.Result.Should().BeOfType<OkObjectResult>();

        var okResult = result.Result as OkObjectResult;
        okResult!.Value.Should().NotBeNull();
    }

    [Fact]
    public async Task GetById_ShouldReturnProduct()
    {
        var product = new ProductResponse(
            Guid.NewGuid(), "Test", "Desc", "SKU", 100, 50, 10,
            ProductStatus.Active, null, null, null, Guid.NewGuid(), "Cat",
            [], DateTime.UtcNow, null);

        _mediatorMock.Setup(m => m.Send(It.IsAny<GetProductByIdQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(product);

        var result = await _controller.GetById(Guid.NewGuid());
        result.Result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task Create_ShouldReturnCreated()
    {
        var response = new ProductResponse(
            Guid.NewGuid(), "New", "Desc", "SKU", 100, 50, 10,
            ProductStatus.Active, null, null, null, Guid.NewGuid(), "Cat",
            [], DateTime.UtcNow, null);

        _mediatorMock.Setup(m => m.Send(It.IsAny<CreateProductCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(response);

        var dto = new CreateProductDto("New", "Valid description here", "SKU",
            100, 50, 10, null, null, null, Guid.NewGuid(), [new(Size.M, 10)]);

        var result = await _controller.Create(dto);
        result.Result.Should().BeOfType<CreatedAtActionResult>();
    }

    [Fact]
    public async Task Delete_ShouldReturnNoContent()
    {
        var result = await _controller.Delete(Guid.NewGuid());
        result.Should().BeOfType<NoContentResult>();
    }
}
