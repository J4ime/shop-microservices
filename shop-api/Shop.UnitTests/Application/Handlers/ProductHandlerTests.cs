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

public class ProductHandlerTests
{
    private readonly Mock<IProductRepository> _repoMock = new();
    private readonly Mock<IUnitOfWork> _uowMock = new();
    private readonly IMapper _mapper;

    public ProductHandlerTests()
    {
        _mapper = TestMapper.Instance;
    }

    [Fact]
    public async Task CreateProduct_DuplicateSku_ShouldThrowAlreadyExists()
    {
        _repoMock.Setup(r => r.SkuExistsAsync("SKU-001", null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        var handler = new CreateProductHandler(_repoMock.Object, _uowMock.Object, _mapper);
        var dto = new CreateProductDto("Test", "Valid description here", "SKU-001",
            100, 50, 10, null, null, null, null, Guid.NewGuid(), Gender.Unisex, [new(Size.M, 10)]);

        await handler.Invoking(h => h.Handle(new CreateProductCommand(dto), CancellationToken.None))
            .Should().ThrowAsync<AlreadyExistsException>();
    }

    [Fact]
    public async Task CreateProduct_ValidDto_ShouldSucceed()
    {
        _repoMock.Setup(r => r.SkuExistsAsync(It.IsAny<string>(), null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        _repoMock.Setup(r => r.AddAsync(It.IsAny<Product>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Product p, CancellationToken _) => p);

        var handler = new CreateProductHandler(_repoMock.Object, _uowMock.Object, _mapper);
        var dto = new CreateProductDto("Test Product", "Valid description here", "SKU-002",
            100, 50, 10, "BrandX", "Cotton", "Blue", null, Guid.NewGuid(), Gender.Unisex,
            [new(Size.M, 10)]);

        var result = await handler.Handle(new CreateProductCommand(dto), CancellationToken.None);

        result.Should().NotBeNull();
        result.Name.Should().Be("Test Product");
        result.Sku.Should().Be("SKU-002");
        result.Sizes.Should().HaveCount(1);
        _uowMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UpdateProduct_NotFound_ShouldThrowNotFound()
    {
        _repoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Product?)null);

        var handler = new UpdateProductHandler(_repoMock.Object, _uowMock.Object, _mapper);
        var dto = new UpdateProductDto("Test", "Valid description here", "SKU-001",
            100, 50, 10, null, null, null, null, Guid.NewGuid(), Gender.Unisex, [new(Size.M, 10)]);

        await handler.Invoking(h => h.Handle(
                new UpdateProductCommand(Guid.NewGuid(), dto), CancellationToken.None))
            .Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task UpdateProduct_Valid_ShouldSucceed()
    {
        var product = new Product
        {
            Id = Guid.NewGuid(), Name = "Old", Description = "Description here",
            Sku = "OLD-SKU", Price = 50, CostPrice = 25, TotalStock = 0,
            Category = new Category { Name = "Cat" }
        };

        _repoMock.Setup(r => r.GetByIdAsync(product.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(product);

        var handler = new UpdateProductHandler(_repoMock.Object, _uowMock.Object, _mapper);
        var dto = new UpdateProductDto("Updated", "Valid description here", "SKU-001",
            100, 50, 10, null, null, null, null, Guid.NewGuid(), Gender.Unisex, [new(Size.M, 10)]);

        var result = await handler.Handle(
            new UpdateProductCommand(product.Id, dto), CancellationToken.None);

        result.Name.Should().Be("Updated");
        _uowMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task DeleteProduct_NotFound_ShouldThrowNotFound()
    {
        _repoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Product?)null);

        var handler = new DeleteProductHandler(_repoMock.Object, _uowMock.Object);

        await handler.Invoking(h => h.Handle(
                new DeleteProductCommand(Guid.NewGuid()), CancellationToken.None))
            .Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task DeleteProduct_ShouldSucceed()
    {
        var product = new Product { Id = Guid.NewGuid(), Name = "ToDelete" };
        _repoMock.Setup(r => r.GetByIdAsync(product.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(product);

        var handler = new DeleteProductHandler(_repoMock.Object, _uowMock.Object);

        await handler.Handle(new DeleteProductCommand(product.Id), CancellationToken.None);

        _repoMock.Verify(r => r.DeleteAsync(product, It.IsAny<CancellationToken>()), Times.Once);
        _uowMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
