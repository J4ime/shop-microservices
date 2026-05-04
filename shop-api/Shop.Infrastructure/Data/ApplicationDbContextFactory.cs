using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Shop.Application.Common.Interfaces;
using Shop.Infrastructure.Services;

namespace Shop.Infrastructure.Data;

public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=shopdb;Username=shopuser;Password=shoppass123");

        return new ApplicationDbContext(optionsBuilder.Options, new DateTimeService());
    }
}
