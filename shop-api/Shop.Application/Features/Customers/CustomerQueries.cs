using AutoMapper;
using MediatR;
using Shop.Application.DTOs;
using Shop.Domain.Entities;
using Shop.Domain.Exceptions;
using Shop.Domain.Interfaces;

namespace Shop.Application.Features.Customers;

public record GetCustomerByIdQuery(Guid Id) : IRequest<CustomerResponse>;

public class GetCustomerByIdHandler : IRequestHandler<GetCustomerByIdQuery, CustomerResponse>
{
    private readonly ICustomerRepository _repo;
    private readonly IMapper _mapper;

    public GetCustomerByIdHandler(ICustomerRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<CustomerResponse> Handle(GetCustomerByIdQuery q, CancellationToken ct)
    {
        var customer = await _repo.GetByIdAsync(q.Id, ct)
            ?? throw new NotFoundException(nameof(Customer), q.Id);
        return _mapper.Map<CustomerResponse>(customer);
    }
}

public record GetAllCustomersQuery(int Page = 1, int PageSize = 10)
    : IRequest<PagedResponse<CustomerResponse>>;

public class GetAllCustomersHandler : IRequestHandler<GetAllCustomersQuery, PagedResponse<CustomerResponse>>
{
    private readonly ICustomerRepository _repo;
    private readonly IMapper _mapper;

    public GetAllCustomersHandler(ICustomerRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<PagedResponse<CustomerResponse>> Handle(GetAllCustomersQuery q, CancellationToken ct)
    {
        var customers = await _repo.GetAllAsync(ct);
        var total = customers.Count;
        var paged = customers.Skip((q.Page - 1) * q.PageSize).Take(q.PageSize).ToList();
        return new PagedResponse<CustomerResponse>(
            _mapper.Map<IReadOnlyList<CustomerResponse>>(paged), total, q.Page, q.PageSize);
    }
}
