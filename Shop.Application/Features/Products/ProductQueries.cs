using AutoMapper;
using MediatR;
using Shop.Application.DTOs;
using Shop.Domain.Entities;
using Shop.Domain.Exceptions;
using Shop.Domain.Interfaces;

namespace Shop.Application.Features.Products;

public record GetProductByIdQuery(Guid Id) : IRequest<ProductResponse>;

public class GetProductByIdHandler : IRequestHandler<GetProductByIdQuery, ProductResponse>
{
    private readonly IProductRepository _repo;
    private readonly IMapper _mapper;

    public GetProductByIdHandler(IProductRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<ProductResponse> Handle(GetProductByIdQuery q, CancellationToken ct)
    {
        var product = await _repo.GetByIdAsync(q.Id, ct)
            ?? throw new NotFoundException(nameof(Product), q.Id);
        return _mapper.Map<ProductResponse>(product);
    }
}

public record GetAllProductsQuery(int Page = 1, int PageSize = 10, Guid? CategoryId = null)
    : IRequest<PagedResponse<ProductResponse>>;

public class GetAllProductsHandler : IRequestHandler<GetAllProductsQuery, PagedResponse<ProductResponse>>
{
    private readonly IProductRepository _repo;
    private readonly IMapper _mapper;

    public GetAllProductsHandler(IProductRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<PagedResponse<ProductResponse>> Handle(GetAllProductsQuery q, CancellationToken ct)
    {
        var products = q.CategoryId.HasValue
            ? await _repo.GetByCategoryAsync(q.CategoryId.Value, ct)
            : await _repo.GetAllAsync(ct);

        var total = products.Count;
        var paged = products.Skip((q.Page - 1) * q.PageSize).Take(q.PageSize).ToList();
        return new PagedResponse<ProductResponse>(
            _mapper.Map<IReadOnlyList<ProductResponse>>(paged), total, q.Page, q.PageSize);
    }
}

public record GetLowStockProductsQuery(int Threshold = 10) : IRequest<IReadOnlyList<ProductResponse>>;

public class GetLowStockProductsHandler : IRequestHandler<GetLowStockProductsQuery, IReadOnlyList<ProductResponse>>
{
    private readonly IProductRepository _repo;
    private readonly IMapper _mapper;

    public GetLowStockProductsHandler(IProductRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<IReadOnlyList<ProductResponse>> Handle(GetLowStockProductsQuery q, CancellationToken ct)
    {
        var products = await _repo.GetLowStockAsync(q.Threshold, ct);
        return _mapper.Map<IReadOnlyList<ProductResponse>>(products);
    }
}
