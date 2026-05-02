namespace Auth.Domain.Exceptions;

public class AuthException : Exception
{
    public AuthException(string message) : base(message) { }
}

public class UserNotFoundException : AuthException
{
    public UserNotFoundException(string email) : base($"User with email '{email}' not found.") { }
}

public class InvalidCredentialsException : AuthException
{
    public InvalidCredentialsException() : base("Invalid email or password.") { }
}

public class UserAlreadyExistsException : AuthException
{
    public UserAlreadyExistsException(string email) : base($"A user with email '{email}' already exists.") { }
}

public class InvalidTokenException : AuthException
{
    public InvalidTokenException() : base("Invalid or expired token.") { }
}

public class UserInactiveException : AuthException
{
    public UserInactiveException() : base("User account is deactivated.") { }
}
