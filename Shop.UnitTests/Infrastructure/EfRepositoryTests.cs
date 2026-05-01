using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using Shop.Application.Common.Interfaces;
using Shop.Domain.Entities;
using Shop.Domain.Enums;
using Shop.Infrastructure.Data;

namespace Shop.UnitTests.Infrastructure;

public class EfRepositoryTests : IDisposable
{
    private readonly ApplicationDbContext _context;
    private readonly EfRepository<Product> _repository;

    public EfRepositoryTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        var dateTimeServiceMock = new Mock<IDateTimeService>();
        dateTimeServiceMock.Setup(d => d.UtcNow).Returns(DateTime.UtcNow);

        _context = new ApplicationDbContext(options, dateTimeServiceMock.Object);
        _repository = new EfRepository<Product>(_context);
    }

    [Fact]
    public async Task AddAsync_ShouldPersistEntity()
    {
        var product = new Product
        {
            Name = "Test Product",
            Description = "Test description here with enough chars",
            Sku = "SKU-001",
            Price = 100,
            CostPrice = 50,
            TotalStock = 10
        };

        var result = await _repository.AddAsync(product);
        await _context.SaveChangesAsync();

        result.Should().NotBeNull();
        result.Id.Should().NotBeEmpty();

        var dbProduct = await _context.Products.FirstOrDefaultAsync(p => p.Sku == "SKU-001");
        dbProduct.Should().NotBeNull();
        dbProduct!.Name.Should().Be("Test Product");
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnEntity()
    {
        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = "Find Me",
            Description = "Test description here with enough chars",
            Sku = "SKU-FIND",
            Price = 100,
            CostPrice = 50,
            TotalStock = 5
        };
        await _context.Products.AddAsync(product);
        await _context.SaveChangesAsync();

        var result = await _repository.GetByIdAsync(product.Id);

        result.Should().NotBeNull();
        result!.Name.Should().Be("Find Me");
    }

    [Fact]
    public async Task GetByIdAsync_NotFound_ShouldReturnNull()
    {
        var result = await _repository.GetByIdAsync(Guid.NewGuid());
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnAllNonDeleted()
    {
        _context.Products.Add(new Product
        {
            Name = "P1", Description = "Test description here 1", Sku = "S1", Price = 100
        });
        _context.Products.Add(new Product
        {
            Name = "P2", Description = "Test description here 2", Sku = "S2", Price = 200
        });
        _context.Products.Add(new Product
        {
            Name = "P3", Description = "Test description here 3", Sku = "S3", Price = 300, IsDeleted = true
        });
        await _context.SaveChangesAsync();

        var result = await _repository.GetAllAsync();

        result.Should().HaveCount(2);
    }

    [Fact]
    public async Task DeleteAsync_ShouldSoftDelete()
    {
        var product = new Product
        {
            Name = "ToDelete", Description = "Test description here", Sku = "SKU-DEL",
            Price = 50, CostPrice = 25, TotalStock = 0
        };
        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        await _repository.DeleteAsync(product);
        await _context.SaveChangesAsync();

        product.IsDeleted.Should().BeTrue();

        var all = await _context.Products.IgnoreQueryFilters().ToListAsync();
        all.Count(p => p.IsDeleted).Should().Be(1);
    }

    [Fact]
    public async Task ExistsAsync_ShouldCheckCorrectly()
    {
        var product = new Product
        {
            Name = "Exists", Description = "Test description here", Sku = "SKU-EX",
            Price = 100, CostPrice = 50
        };
        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        var exists = await _repository.ExistsAsync(p => p.Sku == "SKU-EX");
        exists.Should().BeTrue();

        var notExists = await _repository.ExistsAsync(p => p.Sku == "NONEXIST");
        notExists.Should().BeFalse();
    }

    [Fact]
    public async Task FindAsync_ShouldFilterCorrectly()
    {
        _context.Products.Add(new Product
        {
            Name = "Active", Description = "Description test here", Sku = "ACT1",
            Price = 100, CostPrice = 50, Status = ProductStatus.Active
        });
        _context.Products.Add(new Product
        {
            Name = "Inactive", Description = "Description test here", Sku = "INA1",
            Price = 100, CostPrice = 50, Status = ProductStatus.Inactive
        });
        await _context.SaveChangesAsync();

        var actives = await _repository.FindAsync(p => p.Status == ProductStatus.Active);
        actives.Should().HaveCount(1);
        actives[0].Name.Should().Be("Active");
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
