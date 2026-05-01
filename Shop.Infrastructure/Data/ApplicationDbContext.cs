using Microsoft.EntityFrameworkCore;
using Shop.Application.Common.Interfaces;
using Shop.Domain.Entities;
using Shop.Domain.Interfaces;

namespace Shop.Infrastructure.Data;

public class ApplicationDbContext : DbContext, IUnitOfWork
{
    private readonly IDateTimeService _dateTimeService;

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IDateTimeService dateTimeService)
        : base(options)
    {
        _dateTimeService = dateTimeService;
    }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductSize> ProductSizes => Set<ProductSize>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    if (entry.Entity.Id == Guid.Empty)
                        entry.Entity.Id = Guid.NewGuid();
                    entry.Entity.CreatedAt = _dateTimeService.UtcNow;
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = _dateTimeService.UtcNow;
                    break;
            }
        }
        return await base.SaveChangesAsync(cancellationToken);
    }

    public async Task BeginTransactionAsync(CancellationToken ct = default)
        => await Database.BeginTransactionAsync(ct);

    public async Task CommitTransactionAsync(CancellationToken ct = default)
        => await Database.CommitTransactionAsync(ct);

    public async Task RollbackTransactionAsync(CancellationToken ct = default)
        => await Database.RollbackTransactionAsync(ct);
}
