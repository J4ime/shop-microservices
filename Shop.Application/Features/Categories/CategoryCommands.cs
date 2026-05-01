using AutoMapper;
using MediatR;
using Shop.Application.DTOs;
using Shop.Domain.Entities;
using Shop.Domain.Exceptions;
using Shop.Domain.Interfaces;

namespace Shop.Application.Features.Categories;

public record CreateCategoryCommand(CreateCategoryDto Dto) : IRequest<CategoryResponse>;

public class CreateCategoryHandler : IRequestHandler<CreateCategoryCommand, CategoryResponse>
{
    private readonly ICategoryRepository _repo;
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;

    public CreateCategoryHandler(ICategoryRepository repo, IUnitOfWork uow, IMapper mapper)
    {
        _repo = repo;
        _uow = uow;
        _mapper = mapper;
    }

    public async Task<CategoryResponse> Handle(CreateCategoryCommand cmd, CancellationToken ct)
    {
        if (await _repo.NameExistsAsync(cmd.Dto.Name, cancellationToken: ct))
            throw new AlreadyExistsException("Category", cmd.Dto.Name);

        var category = _mapper.Map<Category>(cmd.Dto);
        var created = await _repo.AddAsync(category, ct);
        await _uow.SaveChangesAsync(ct);
        return _mapper.Map<CategoryResponse>(created);
    }
}

public record UpdateCategoryCommand(Guid Id, UpdateCategoryDto Dto) : IRequest<CategoryResponse>;

public class UpdateCategoryHandler : IRequestHandler<UpdateCategoryCommand, CategoryResponse>
{
    private readonly ICategoryRepository _repo;
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;

    public UpdateCategoryHandler(ICategoryRepository repo, IUnitOfWork uow, IMapper mapper)
    {
        _repo = repo;
        _uow = uow;
        _mapper = mapper;
    }

    public async Task<CategoryResponse> Handle(UpdateCategoryCommand cmd, CancellationToken ct)
    {
        var category = await _repo.GetByIdAsync(cmd.Id, ct)
            ?? throw new NotFoundException(nameof(Category), cmd.Id);

        if (await _repo.NameExistsAsync(cmd.Dto.Name, cmd.Id, ct))
            throw new AlreadyExistsException("Category", cmd.Dto.Name);

        category.Name = cmd.Dto.Name;
        category.Description = cmd.Dto.Description;
        category.Gender = cmd.Dto.Gender;
        category.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(category, ct);
        await _uow.SaveChangesAsync(ct);
        return _mapper.Map<CategoryResponse>(category);
    }
}

public record DeleteCategoryCommand(Guid Id) : IRequest;

public class DeleteCategoryHandler : IRequestHandler<DeleteCategoryCommand>
{
    private readonly ICategoryRepository _repo;
    private readonly IUnitOfWork _uow;

    public DeleteCategoryHandler(ICategoryRepository repo, IUnitOfWork uow)
    {
        _repo = repo;
        _uow = uow;
    }

    public async Task Handle(DeleteCategoryCommand cmd, CancellationToken ct)
    {
        var category = await _repo.GetByIdAsync(cmd.Id, ct)
            ?? throw new NotFoundException(nameof(Category), cmd.Id);
        await _repo.DeleteAsync(category, ct);
        await _uow.SaveChangesAsync(ct);
    }
}
