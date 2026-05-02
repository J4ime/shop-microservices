using AutoMapper;
using MediatR;
using Shop.Application.DTOs;
using Shop.Domain.Entities;
using Shop.Domain.Exceptions;
using Shop.Domain.Interfaces;

namespace Shop.Application.Features.Products;

public record CreateProductCommand(CreateProductDto Dto) : IRequest<ProductResponse>;

public class CreateProductHandler : IRequestHandler<CreateProductCommand, ProductResponse>
{
    private readonly IProductRepository _repo;
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;

    public CreateProductHandler(IProductRepository repo, IUnitOfWork uow, IMapper mapper)
    {
        _repo = repo;
        _uow = uow;
        _mapper = mapper;
    }

    public async Task<ProductResponse> Handle(CreateProductCommand cmd, CancellationToken ct)
    {
        if (await _repo.SkuExistsAsync(cmd.Dto.Sku, cancellationToken: ct))
            throw new AlreadyExistsException("SKU", cmd.Dto.Sku);

        var product = _mapper.Map<Product>(cmd.Dto);
        product.TotalStock = cmd.Dto.Sizes.Sum(s => s.Stock);
        product.Sizes = cmd.Dto.Sizes.Select(s => new ProductSize
        {
            Size = s.Size,
            Stock = s.Stock
        }).ToList();

        var created = await _repo.AddAsync(product, ct);
        await _uow.SaveChangesAsync(ct);
        return _mapper.Map<ProductResponse>(created);
    }
}

public record UpdateProductCommand(Guid Id, UpdateProductDto Dto) : IRequest<ProductResponse>;

public class UpdateProductHandler : IRequestHandler<UpdateProductCommand, ProductResponse>
{
    private readonly IProductRepository _repo;
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;

    public UpdateProductHandler(IProductRepository repo, IUnitOfWork uow, IMapper mapper)
    {
        _repo = repo;
        _uow = uow;
        _mapper = mapper;
    }

    public async Task<ProductResponse> Handle(UpdateProductCommand cmd, CancellationToken ct)
    {
        var product = await _repo.GetByIdAsync(cmd.Id, ct)
            ?? throw new NotFoundException(nameof(Product), cmd.Id);

        product.Name = cmd.Dto.Name;
        product.Description = cmd.Dto.Description;
        product.Price = cmd.Dto.Price;
        product.CostPrice = cmd.Dto.CostPrice;
        product.Brand = cmd.Dto.Brand;
        product.Material = cmd.Dto.Material;
        product.Color = cmd.Dto.Color;
        product.CategoryId = cmd.Dto.CategoryId;
        product.TotalStock = cmd.Dto.Sizes.Sum(s => s.Stock);
        product.UpdatedAt = DateTime.UtcNow;

        product.Sizes.Clear();
        foreach (var s in cmd.Dto.Sizes)
            product.Sizes.Add(new ProductSize { Size = s.Size, Stock = s.Stock });

        await _repo.UpdateAsync(product, ct);
        await _uow.SaveChangesAsync(ct);
        return _mapper.Map<ProductResponse>(product);
    }
}

public record DeleteProductCommand(Guid Id) : IRequest;

public class DeleteProductHandler : IRequestHandler<DeleteProductCommand>
{
    private readonly IProductRepository _repo;
    private readonly IUnitOfWork _uow;

    public DeleteProductHandler(IProductRepository repo, IUnitOfWork uow)
    {
        _repo = repo;
        _uow = uow;
    }

    public async Task Handle(DeleteProductCommand cmd, CancellationToken ct)
    {
        var product = await _repo.GetByIdAsync(cmd.Id, ct)
            ?? throw new NotFoundException(nameof(Product), cmd.Id);
        await _repo.DeleteAsync(product, ct);
        await _uow.SaveChangesAsync(ct);
    }
}
