using Auth.Domain.Entities;
using Auth.Domain.Enums;
using FluentAssertions;

namespace Auth.UnitTests.Domain;

public class UserEntityTests
{
    [Fact]
    public void User_ShouldInitializeWithDefaults()
    {
        var user = new User();
        user.Email.Should().BeEmpty();
        user.PasswordHash.Should().BeEmpty();
        user.Role.Should().Be(UserRole.Customer);
        user.IsActive.Should().BeTrue();
    }

    [Fact]
    public void User_ShouldSetProperties()
    {
        var user = new User
        {
            Email = "test@auth.com",
            PasswordHash = "hash123",
            FirstName = "John",
            LastName = "Doe",
            Phone = "123456789",
            Role = UserRole.Admin
        };

        user.Email.Should().Be("test@auth.com");
        user.FirstName.Should().Be("John");
        user.Role.Should().Be(UserRole.Admin);
        user.CreatedAt.Should().Be(default);
    }
}

public class AuthExceptionTests
{
    [Fact]
    public void InvalidCredentialsException_Message()
    {
        var ex = new Auth.Domain.Exceptions.InvalidCredentialsException();
        ex.Message.Should().Contain("Invalid");
    }

    [Fact]
    public void UserAlreadyExistsException_Message()
    {
        var ex = new Auth.Domain.Exceptions.UserAlreadyExistsException("test@test.com");
        ex.Message.Should().Contain("test@test.com");
    }

    [Fact]
    public void UserNotFoundException_Message()
    {
        var ex = new Auth.Domain.Exceptions.UserNotFoundException("x@x.com");
        ex.Message.Should().Contain("x@x.com");
    }

    [Fact]
    public void InvalidTokenException_Message()
    {
        var ex = new Auth.Domain.Exceptions.InvalidTokenException();
        ex.Message.Should().Contain("Invalid");
    }

    [Fact]
    public void UserInactiveException_Message()
    {
        var ex = new Auth.Domain.Exceptions.UserInactiveException();
        ex.Message.Should().Contain("deactivated");
    }
}
