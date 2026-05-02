using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using Shop.Application.Common.Interfaces;
using Shop.Domain.Enums;
using Shop.Infrastructure.Data;

namespace Shop.UnitTests.Infrastructure;

public class ProductRepositoryTests
{
    private readonly ApplicationDbContext _context;
    private readonly ProductRepository _repository;

    public ProductRepositoryTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        var dts = new Mock<IDateTimeService>();
        dts.Setup(d => d.UtcNow).Returns(DateTime.UtcNow);
        _context = new ApplicationDbContext(options, dts.Object);
        _repository = new ProductRepository(_context);
    }

    [Fact]
    public async Task SkuExists_True()
    {
        _context.Products.Add(new()
        {
            Name = "P", Description = "Description here", Sku = "EXIST", Price = 100
        });
        await _context.SaveChangesAsync();

        var exists = await _repository.SkuExistsAsync("EXIST");
        exists.Should().BeTrue();
    }

    [Fact]
    public async Task SkuExists_False()
    {
        var exists = await _repository.SkuExistsAsync("NOPE");
        exists.Should().BeFalse();
    }

    [Fact]
    public async Task SkuExists_ExcludeId()
    {
        var id = Guid.NewGuid();
        _context.Products.Add(new()
        {
            Id = id, Name = "P", Description = "Description here", Sku = "SAME", Price = 100
        });
        await _context.SaveChangesAsync();

        var existsOther = await _repository.SkuExistsAsync("SAME", Guid.NewGuid());
        existsOther.Should().BeTrue();
    }

    [Fact]
    public async Task GetByCategory_ShouldFilter()
    {
        var catId = Guid.NewGuid();
        _context.Products.Add(new()
        {
            Name = "InCat", Description = "Description here", Sku = "CAT1", Price = 100, CategoryId = catId,
            Category = new() { Id = catId, Name = "C" }
        });
        _context.Products.Add(new()
        {
            Name = "NoCat", Description = "Description here", Sku = "NCAT1", Price = 200,
            CategoryId = Guid.NewGuid(),
            Category = new() { Id = Guid.NewGuid(), Name = "D" }
        });
        await _context.SaveChangesAsync();

        var result = await _repository.GetByCategoryAsync(catId, CancellationToken.None);
        result.Should().HaveCount(1);
        result[0].Name.Should().Be("InCat");
    }

    [Fact]
    public async Task GetLowStock_ShouldFilter()
    {
        _context.Products.Add(new()
        {
            Name = "Low", Description = "Description here", Sku = "LOW", Price = 100, TotalStock = 3
        });
        _context.Products.Add(new()
        {
            Name = "High", Description = "Description here", Sku = "HI", Price = 100, TotalStock = 50
        });
        await _context.SaveChangesAsync();

        var result = await _repository.GetLowStockAsync(5, CancellationToken.None);
        result.Should().HaveCount(1);
        result[0].Name.Should().Be("Low");
    }
}
