namespace Shop.Domain.Exceptions;

public class DomainException : Exception
{
    public DomainException(string message) : base(message) { }
}

public class NotFoundException : DomainException
{
    public NotFoundException(string name, object key)
        : base($"{name} with ID ({key}) was not found.") { }
}

public class AlreadyExistsException : DomainException
{
    public AlreadyExistsException(string name, object key)
        : base($"{name} with identifier ({key}) already exists.") { }
}

public class InvalidEntityStateException : DomainException
{
    public InvalidEntityStateException(string message) : base(message) { }
}
