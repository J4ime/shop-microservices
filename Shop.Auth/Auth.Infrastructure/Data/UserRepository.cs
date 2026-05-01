using Microsoft.EntityFrameworkCore;
using Auth.Domain.Entities;
using Auth.Domain.Interfaces;

namespace Auth.Infrastructure.Data;

public class UserRepository : IUserRepository
{
    private readonly AuthDbContext _context;

    public UserRepository(AuthDbContext context) => _context = context;

    public Task<User?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => _context.Users.FirstOrDefaultAsync(u => u.Id == id, ct);

    public Task<User?> GetByEmailAsync(string email, CancellationToken ct = default)
        => _context.Users.FirstOrDefaultAsync(u => u.Email == email, ct);

    public Task<User?> GetByRefreshTokenAsync(string refreshToken, CancellationToken ct = default)
        => _context.Users.FirstOrDefaultAsync(
            u => u.RefreshToken == refreshToken && u.RefreshTokenExpiry > DateTime.UtcNow, ct);

    public Task<bool> EmailExistsAsync(string email, CancellationToken ct = default)
        => _context.Users.AnyAsync(u => u.Email == email, ct);

    public async Task<User> AddAsync(User user, CancellationToken ct = default)
    {
        await _context.Users.AddAsync(user, ct);
        return user;
    }

    public Task UpdateAsync(User user, CancellationToken ct = default)
    {
        _context.Users.Update(user);
        return Task.CompletedTask;
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var user = await _context.Users.FindAsync([id], ct);
        if (user is not null)
            _context.Users.Remove(user);
    }
}
