using AutoMapper;
using MediatR;
using Shop.Application.DTOs;
using Shop.Domain.Entities;
using Shop.Domain.Exceptions;
using Shop.Domain.Interfaces;

namespace Shop.Application.Features.Orders;

public record GetOrderByIdQuery(Guid Id) : IRequest<OrderResponse>;

public class GetOrderByIdHandler : IRequestHandler<GetOrderByIdQuery, OrderResponse>
{
    private readonly IOrderRepository _repo;
    private readonly IMapper _mapper;

    public GetOrderByIdHandler(IOrderRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<OrderResponse> Handle(GetOrderByIdQuery q, CancellationToken ct)
    {
        var order = await _repo.GetWithItemsAsync(q.Id, ct)
            ?? throw new NotFoundException(nameof(Order), q.Id);
        return _mapper.Map<OrderResponse>(order);
    }
}

public record GetOrdersByCustomerQuery(Guid CustomerId, int Page = 1, int PageSize = 10)
    : IRequest<PagedResponse<OrderResponse>>;

public class GetOrdersByCustomerHandler : IRequestHandler<GetOrdersByCustomerQuery, PagedResponse<OrderResponse>>
{
    private readonly IOrderRepository _repo;
    private readonly IMapper _mapper;

    public GetOrdersByCustomerHandler(IOrderRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<PagedResponse<OrderResponse>> Handle(GetOrdersByCustomerQuery q, CancellationToken ct)
    {
        var orders = await _repo.GetByCustomerIdAsync(q.CustomerId, ct);
        var total = orders.Count;
        var paged = orders.OrderByDescending(o => o.CreatedAt)
            .Skip((q.Page - 1) * q.PageSize).Take(q.PageSize).ToList();
        return new PagedResponse<OrderResponse>(
            _mapper.Map<IReadOnlyList<OrderResponse>>(paged), total, q.Page, q.PageSize);
    }
}

public record GetAllOrdersQuery(int Page = 1, int PageSize = 10)
    : IRequest<PagedResponse<OrderResponse>>;

public class GetAllOrdersHandler : IRequestHandler<GetAllOrdersQuery, PagedResponse<OrderResponse>>
{
    private readonly IOrderRepository _repo;
    private readonly IMapper _mapper;

    public GetAllOrdersHandler(IOrderRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<PagedResponse<OrderResponse>> Handle(GetAllOrdersQuery q, CancellationToken ct)
    {
        var orders = await _repo.GetAllAsync(ct);
        var total = orders.Count;
        var paged = orders.OrderByDescending(o => o.CreatedAt)
            .Skip((q.Page - 1) * q.PageSize).Take(q.PageSize).ToList();
        return new PagedResponse<OrderResponse>(
            _mapper.Map<IReadOnlyList<OrderResponse>>(paged), total, q.Page, q.PageSize);
    }
}
