using AutoMapper;
using MediatR;
using Shop.Application.DTOs;
using Shop.Domain.Entities;
using Shop.Domain.Exceptions;
using Shop.Domain.Interfaces;

namespace Shop.Application.Features.Categories;

public record GetCategoryByIdQuery(Guid Id) : IRequest<CategoryResponse>;

public class GetCategoryByIdHandler : IRequestHandler<GetCategoryByIdQuery, CategoryResponse>
{
    private readonly ICategoryRepository _repo;
    private readonly IMapper _mapper;

    public GetCategoryByIdHandler(ICategoryRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<CategoryResponse> Handle(GetCategoryByIdQuery q, CancellationToken ct)
    {
        var category = await _repo.GetByIdAsync(q.Id, ct)
            ?? throw new NotFoundException(nameof(Category), q.Id);
        return _mapper.Map<CategoryResponse>(category);
    }
}

public record GetAllCategoriesQuery : IRequest<IReadOnlyList<CategoryResponse>>;

public class GetAllCategoriesHandler : IRequestHandler<GetAllCategoriesQuery, IReadOnlyList<CategoryResponse>>
{
    private readonly ICategoryRepository _repo;
    private readonly IMapper _mapper;

    public GetAllCategoriesHandler(ICategoryRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<IReadOnlyList<CategoryResponse>> Handle(GetAllCategoriesQuery q, CancellationToken ct)
    {
        var categories = await _repo.GetAllAsync(ct);
        return _mapper.Map<IReadOnlyList<CategoryResponse>>(categories);
    }
}
