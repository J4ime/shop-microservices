using Auth.Domain.Entities;
using Auth.Domain.Enums;
using Auth.Infrastructure.Data;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;

namespace Auth.UnitTests.Infrastructure;

public class UserRepositoryTests : IDisposable
{
    private readonly AuthDbContext _context;
    private readonly UserRepository _repository;

    public UserRepositoryTests()
    {
        var options = new DbContextOptionsBuilder<AuthDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _context = new AuthDbContext(options);
        _repository = new UserRepository(_context);
    }

    [Fact]
    public async Task GetByEmail_ShouldReturnUser()
    {
        var user = new User
        {
            Id = Guid.NewGuid(), Email = "test@auth.com",
            PasswordHash = "hash", FirstName = "John", LastName = "Doe"
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var result = await _repository.GetByEmailAsync("test@auth.com");
        result.Should().NotBeNull();
        result!.Email.Should().Be("test@auth.com");
    }

    [Fact]
    public async Task GetByEmail_NotFound_ShouldReturnNull()
    {
        var result = await _repository.GetByEmailAsync("noone@test.com");
        result.Should().BeNull();
    }

    [Fact]
    public async Task EmailExists_ShouldReturnCorrectly()
    {
        _context.Users.Add(new User
        {
            Email = "exists@test.com", PasswordHash = "hash", FirstName = "F", LastName = "L"
        });
        await _context.SaveChangesAsync();

        var exists = await _repository.EmailExistsAsync("exists@test.com");
        exists.Should().BeTrue();

        var notExists = await _repository.EmailExistsAsync("other@test.com");
        notExists.Should().BeFalse();
    }

    [Fact]
    public async Task GetByRefreshToken_ShouldReturnUser_WhenNotExpired()
    {
        var user = new User
        {
            Id = Guid.NewGuid(), Email = "rt@test.com",
            PasswordHash = "hash", FirstName = "F", LastName = "L",
            RefreshToken = "valid-rt", RefreshTokenExpiry = DateTime.UtcNow.AddHours(1)
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var result = await _repository.GetByRefreshTokenAsync("valid-rt");
        result.Should().NotBeNull();
    }

    [Fact]
    public async Task GetByRefreshToken_Expired_ShouldReturnNull()
    {
        var user = new User
        {
            Id = Guid.NewGuid(), Email = "expired@test.com",
            PasswordHash = "hash", FirstName = "F", LastName = "L",
            RefreshToken = "expired-rt", RefreshTokenExpiry = DateTime.UtcNow.AddHours(-1)
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var result = await _repository.GetByRefreshTokenAsync("expired-rt");
        result.Should().BeNull();
    }

    [Fact]
    public async Task AddAsync_ShouldPersistUser()
    {
        var user = new User
        {
            Email = "new@test.com", PasswordHash = "hash",
            FirstName = "New", LastName = "User", Role = UserRole.Admin
        };

        var result = await _repository.AddAsync(user);
        await _context.SaveChangesAsync();

        result.Id.Should().NotBeEmpty();
        _context.Users.Count().Should().Be(1);
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateUser()
    {
        var user = new User
        {
            Id = Guid.NewGuid(), Email = "update@test.com",
            PasswordHash = "hash", FirstName = "Old", LastName = "Name"
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        user.FirstName = "Updated";
        await _repository.UpdateAsync(user);
        await _context.SaveChangesAsync();

        var updated = await _context.Users.FindAsync(user.Id);
        updated!.FirstName.Should().Be("Updated");
    }

    [Fact]
    public async Task DeleteAsync_ShouldRemoveUser()
    {
        var user = new User
        {
            Id = Guid.NewGuid(), Email = "delete@test.com",
            PasswordHash = "hash", FirstName = "Del", LastName = "User"
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        await _repository.DeleteAsync(user.Id);
        await _context.SaveChangesAsync();

        _context.Users.Count().Should().Be(0);
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnUser()
    {
        var user = new User
        {
            Id = Guid.NewGuid(), Email = "byid@test.com",
            PasswordHash = "hash", FirstName = "ID", LastName = "User"
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var result = await _repository.GetByIdAsync(user.Id);
        result.Should().NotBeNull();
        result!.Email.Should().Be("byid@test.com");
    }

    public void Dispose() => _context.Dispose();
}
