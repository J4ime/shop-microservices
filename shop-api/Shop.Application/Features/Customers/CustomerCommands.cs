using AutoMapper;
using MediatR;
using Shop.Application.DTOs;
using Shop.Domain.Entities;
using Shop.Domain.Exceptions;
using Shop.Domain.Interfaces;

namespace Shop.Application.Features.Customers;

public record CreateCustomerCommand(CreateCustomerDto Dto) : IRequest<CustomerResponse>;

public class CreateCustomerHandler : IRequestHandler<CreateCustomerCommand, CustomerResponse>
{
    private readonly ICustomerRepository _repo;
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;

    public CreateCustomerHandler(ICustomerRepository repo, IUnitOfWork uow, IMapper mapper)
    {
        _repo = repo;
        _uow = uow;
        _mapper = mapper;
    }

    public async Task<CustomerResponse> Handle(CreateCustomerCommand cmd, CancellationToken ct)
    {
        if (await _repo.EmailExistsAsync(cmd.Dto.Email, cancellationToken: ct))
            throw new AlreadyExistsException("Customer", cmd.Dto.Email);

        var customer = _mapper.Map<Customer>(cmd.Dto);
        var created = await _repo.AddAsync(customer, ct);
        await _uow.SaveChangesAsync(ct);
        return _mapper.Map<CustomerResponse>(created);
    }
}

public record UpdateCustomerCommand(Guid Id, UpdateCustomerDto Dto) : IRequest<CustomerResponse>;

public class UpdateCustomerHandler : IRequestHandler<UpdateCustomerCommand, CustomerResponse>
{
    private readonly ICustomerRepository _repo;
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;

    public UpdateCustomerHandler(ICustomerRepository repo, IUnitOfWork uow, IMapper mapper)
    {
        _repo = repo;
        _uow = uow;
        _mapper = mapper;
    }

    public async Task<CustomerResponse> Handle(UpdateCustomerCommand cmd, CancellationToken ct)
    {
        var customer = await _repo.GetByIdAsync(cmd.Id, ct)
            ?? throw new NotFoundException(nameof(Customer), cmd.Id);

        customer.FirstName = cmd.Dto.FirstName;
        customer.LastName = cmd.Dto.LastName;
        customer.Phone = cmd.Dto.Phone;
        customer.Address = cmd.Dto.Address;
        customer.City = cmd.Dto.City;
        customer.State = cmd.Dto.State;
        customer.PostalCode = cmd.Dto.PostalCode;
        customer.Country = cmd.Dto.Country;
        customer.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(customer, ct);
        await _uow.SaveChangesAsync(ct);
        return _mapper.Map<CustomerResponse>(customer);
    }
}

public record DeleteCustomerCommand(Guid Id) : IRequest;

public class DeleteCustomerHandler : IRequestHandler<DeleteCustomerCommand>
{
    private readonly ICustomerRepository _repo;
    private readonly IUnitOfWork _uow;

    public DeleteCustomerHandler(ICustomerRepository repo, IUnitOfWork uow)
    {
        _repo = repo;
        _uow = uow;
    }

    public async Task Handle(DeleteCustomerCommand cmd, CancellationToken ct)
    {
        var customer = await _repo.GetByIdAsync(cmd.Id, ct)
            ?? throw new NotFoundException(nameof(Customer), cmd.Id);
        await _repo.DeleteAsync(customer, ct);
        await _uow.SaveChangesAsync(ct);
    }
}
