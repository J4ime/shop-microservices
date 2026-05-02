using AutoMapper;
using FluentAssertions;
using Moq;
using Shop.Application.DTOs;
using Shop.Application.Features.Products;
using Shop.Domain.Entities;
using Shop.Domain.Enums;
using Shop.Domain.Exceptions;
using Shop.Domain.Interfaces;

namespace Shop.UnitTests.Application.Handlers;

public class ProductQueryTests
{
    private readonly Mock<IProductRepository> _repoMock = new();
    private readonly IMapper _mapper;

    public ProductQueryTests()
    {
        _mapper = TestMapper.Instance;
    }

    [Fact]
    public async Task GetProductById_NotFound_ShouldThrowNotFound()
    {
        _repoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Product?)null);

        var handler = new GetProductByIdHandler(_repoMock.Object, _mapper);

        await handler.Invoking(h => h.Handle(
                new GetProductByIdQuery(Guid.NewGuid()), CancellationToken.None))
            .Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task GetProductById_Found_ShouldReturnProduct()
    {
        var product = CreateProduct(Guid.NewGuid(), "Test");
        _repoMock.Setup(r => r.GetByIdAsync(product.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(product);

        var handler = new GetProductByIdHandler(_repoMock.Object, _mapper);
        var result = await handler.Handle(new GetProductByIdQuery(product.Id), CancellationToken.None);

        result.Should().NotBeNull();
        result.Name.Should().Be("Test");
        result.Id.Should().Be(product.Id);
    }

    [Fact]
    public async Task GetAllProducts_ShouldReturnPaged()
    {
        var products = new List<Product>
        {
            CreateProduct(Guid.NewGuid(), "P1"),
            CreateProduct(Guid.NewGuid(), "P2"),
            CreateProduct(Guid.NewGuid(), "P3")
        };
        _repoMock.Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>())).ReturnsAsync(products);

        var handler = new GetAllProductsHandler(_repoMock.Object, _mapper);
        var result = await handler.Handle(new GetAllProductsQuery(1, 2), CancellationToken.None);

        result.TotalCount.Should().Be(3);
        result.Items.Should().HaveCount(2);
        result.Page.Should().Be(1);
        result.PageSize.Should().Be(2);
    }

    [Fact]
    public async Task GetLowStockProducts_ShouldReturnFiltered()
    {
        var products = new List<Product>
        {
            CreateProduct(Guid.NewGuid(), "Low", 5),
            CreateProduct(Guid.NewGuid(), "OK", 100)
        };
        _repoMock.Setup(r => r.GetLowStockAsync(10, It.IsAny<CancellationToken>()))
            .ReturnsAsync(products.Where(p => p.TotalStock <= 10).ToList());

        var handler = new GetLowStockProductsHandler(_repoMock.Object, _mapper);
        var result = await handler.Handle(new GetLowStockProductsQuery(10), CancellationToken.None);

        result.Should().HaveCount(1);
        result[0].Name.Should().Be("Low");
    }

    private static Product CreateProduct(Guid id, string name, int stock = 10)
    {
        return new Product
        {
            Id = id,
            Name = name,
            Description = "Test description here",
            Sku = $"SKU-{name}",
            Price = 100,
            CostPrice = 50,
            TotalStock = stock,
            Brand = "Brand",
            Status = ProductStatus.Active,
            Category = new Category { Name = "Test" },
            Sizes = [new() { Size = Size.M, Stock = stock }]
        };
    }
}
