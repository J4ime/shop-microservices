using Microsoft.EntityFrameworkCore;
using Shop.Domain.Entities;
using Shop.Domain.Interfaces;

namespace Shop.Infrastructure.Data;

public class ProductRepository : EfRepository<Product>, IProductRepository
{
    public ProductRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IReadOnlyList<Product>> GetByCategoryAsync(Guid categoryId, CancellationToken ct)
        => await Context.Products
            .Include(p => p.Category)
            .Include(p => p.Sizes)
            .Where(p => p.CategoryId == categoryId && !p.IsDeleted)
            .ToListAsync(ct);

    public async Task<IReadOnlyList<Product>> GetLowStockAsync(int threshold, CancellationToken ct)
        => await Context.Products
            .Include(p => p.Sizes)
            .Where(p => !p.IsDeleted && p.TotalStock <= threshold)
            .ToListAsync(ct);

    public Task<bool> SkuExistsAsync(string sku, Guid? excludeId = null, CancellationToken ct = default)
    {
        var query = Context.Products.Where(p => p.Sku == sku && !p.IsDeleted);
        if (excludeId.HasValue)
            query = query.Where(p => p.Id != excludeId.Value);
        return query.AnyAsync(ct);
    }
}

public class CategoryRepository : EfRepository<Category>, ICategoryRepository
{
    public CategoryRepository(ApplicationDbContext context) : base(context) { }

    public Task<bool> NameExistsAsync(string name, Guid? excludeId = null, CancellationToken ct = default)
    {
        var query = Context.Categories.Where(c => c.Name == name && !c.IsDeleted);
        if (excludeId.HasValue)
            query = query.Where(c => c.Id != excludeId.Value);
        return query.AnyAsync(ct);
    }
}

public class CustomerRepository : EfRepository<Customer>, ICustomerRepository
{
    public CustomerRepository(ApplicationDbContext context) : base(context) { }

    public Task<bool> EmailExistsAsync(string email, Guid? excludeId = null, CancellationToken ct = default)
    {
        var query = Context.Customers.Where(c => c.Email == email && !c.IsDeleted);
        if (excludeId.HasValue)
            query = query.Where(c => c.Id != excludeId.Value);
        return query.AnyAsync(ct);
    }
}

public class OrderRepository : EfRepository<Order>, IOrderRepository
{
    public OrderRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IReadOnlyList<Order>> GetByCustomerIdAsync(Guid customerId, CancellationToken ct)
        => await Context.Orders
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .Include(o => o.Customer)
            .Where(o => o.CustomerId == customerId && !o.IsDeleted)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync(ct);

    public async Task<Order?> GetWithItemsAsync(Guid id, CancellationToken ct)
        => await Context.Orders
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .Include(o => o.Customer)
            .FirstOrDefaultAsync(o => o.Id == id && !o.IsDeleted, ct);
}
