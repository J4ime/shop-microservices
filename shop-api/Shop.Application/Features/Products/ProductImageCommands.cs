using MediatR;
using Shop.Domain.Entities;
using Shop.Domain.Exceptions;
using Shop.Domain.Interfaces;

namespace Shop.Application.Features.Products;

public record UploadProductImageCommand(Guid ProductId, byte[] ImageBytes) : IRequest;

public class UploadProductImageHandler : IRequestHandler<UploadProductImageCommand>
{
    private readonly IProductRepository _repo;
    private readonly IUnitOfWork _uow;

    public UploadProductImageHandler(IProductRepository repo, IUnitOfWork uow)
    {
        _repo = repo;
        _uow = uow;
    }

    public async Task Handle(UploadProductImageCommand cmd, CancellationToken ct)
    {
        var product = await _repo.GetByIdAsync(cmd.ProductId, ct)
            ?? throw new NotFoundException(nameof(Product), cmd.ProductId);

        if (cmd.ImageBytes == null || cmd.ImageBytes.Length == 0)
            throw new DomainException("Image file is required.");

        product.ImageData = cmd.ImageBytes;
        product.ImageUrl = null;
        product.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(product, ct);
        await _uow.SaveChangesAsync(ct);
    }
}

public record DeleteProductImageCommand(Guid ProductId) : IRequest;

public class DeleteProductImageHandler : IRequestHandler<DeleteProductImageCommand>
{
    private readonly IProductRepository _repo;
    private readonly IUnitOfWork _uow;

    public DeleteProductImageHandler(IProductRepository repo, IUnitOfWork uow)
    {
        _repo = repo;
        _uow = uow;
    }

    public async Task Handle(DeleteProductImageCommand cmd, CancellationToken ct)
    {
        var product = await _repo.GetByIdAsync(cmd.ProductId, ct)
            ?? throw new NotFoundException(nameof(Product), cmd.ProductId);

        product.ImageData = null;
        product.ImageUrl = null;
        product.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(product, ct);
        await _uow.SaveChangesAsync(ct);
    }
}
