using AutoMapper;
using MediatR;
using Shop.Application.DTOs;
using Shop.Domain.Entities;
using Shop.Domain.Enums;
using Shop.Domain.Exceptions;
using Shop.Domain.Interfaces;

namespace Shop.Application.Features.Orders;

public record CreateOrderCommand(CreateOrderDto Dto) : IRequest<OrderResponse>;

public class CreateOrderHandler : IRequestHandler<CreateOrderCommand, OrderResponse>
{
    private readonly IOrderRepository _orderRepo;
    private readonly IProductRepository _productRepo;
    private readonly ICustomerRepository _customerRepo;
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;

    public CreateOrderHandler(
        IOrderRepository orderRepo, IProductRepository productRepo,
        ICustomerRepository customerRepo, IUnitOfWork uow, IMapper mapper)
    {
        _orderRepo = orderRepo;
        _productRepo = productRepo;
        _customerRepo = customerRepo;
        _uow = uow;
        _mapper = mapper;
    }

    public async Task<OrderResponse> Handle(CreateOrderCommand cmd, CancellationToken ct)
    {
        var customer = await _customerRepo.GetByIdAsync(cmd.Dto.CustomerId, ct)
            ?? throw new NotFoundException(nameof(Customer), cmd.Dto.CustomerId);

        var order = new Order
        {
            OrderNumber = $"ORD-{DateTime.UtcNow:yyyyMMddHHmmss}-{Random.Shared.Next(1000, 9999)}",
            CustomerId = cmd.Dto.CustomerId,
            ShippingAddress = cmd.Dto.ShippingAddress,
            Notes = cmd.Dto.Notes,
            ShippingCost = cmd.Dto.ShippingCost
        };

        decimal subtotal = 0;
        foreach (var item in cmd.Dto.Items)
        {
            var product = await _productRepo.GetByIdAsync(item.ProductId, ct)
                ?? throw new NotFoundException(nameof(Product), item.ProductId);

            if (product.Status != ProductStatus.Active)
                throw new InvalidEntityStateException($"Product '{product.Name}' is not available.");

            if (product.TotalStock < item.Quantity)
                throw new InvalidEntityStateException(
                    $"Insufficient stock for '{product.Name}'. Available: {product.TotalStock}");

            product.TotalStock -= item.Quantity;
            await _productRepo.UpdateAsync(product, ct);

            var orderItem = new OrderItem
            {
                ProductId = product.Id,
                Size = item.Size,
                Quantity = item.Quantity,
                UnitPrice = product.Price,
                Total = product.Price * item.Quantity
            };
            order.Items.Add(orderItem);
            subtotal += orderItem.Total;
        }

        var tax = Math.Round(subtotal * 0.16m, 2);
        order.Subtotal = subtotal;
        order.Tax = tax;
        order.Total = subtotal + tax + order.ShippingCost;

        var created = await _orderRepo.AddAsync(order, ct);
        await _uow.SaveChangesAsync(ct);
        return _mapper.Map<OrderResponse>(created);
    }
}

public record UpdateOrderStatusCommand(Guid Id, UpdateOrderStatusDto Dto) : IRequest<OrderResponse>;

public class UpdateOrderStatusHandler : IRequestHandler<UpdateOrderStatusCommand, OrderResponse>
{
    private readonly IOrderRepository _repo;
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;

    public UpdateOrderStatusHandler(IOrderRepository repo, IUnitOfWork uow, IMapper mapper)
    {
        _repo = repo;
        _uow = uow;
        _mapper = mapper;
    }

    public async Task<OrderResponse> Handle(UpdateOrderStatusCommand cmd, CancellationToken ct)
    {
        var order = await _repo.GetByIdAsync(cmd.Id, ct)
            ?? throw new NotFoundException(nameof(Order), cmd.Id);

        order.Status = cmd.Dto.Status;
        order.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(order, ct);
        await _uow.SaveChangesAsync(ct);
        return _mapper.Map<OrderResponse>(order);
    }
}

public record CancelOrderCommand(Guid Id) : IRequest<OrderResponse>;

public class CancelOrderHandler : IRequestHandler<CancelOrderCommand, OrderResponse>
{
    private readonly IOrderRepository _repo;
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;

    public CancelOrderHandler(IOrderRepository repo, IUnitOfWork uow, IMapper mapper)
    {
        _repo = repo;
        _uow = uow;
        _mapper = mapper;
    }

    public async Task<OrderResponse> Handle(CancelOrderCommand cmd, CancellationToken ct)
    {
        var order = await _repo.GetByIdAsync(cmd.Id, ct)
            ?? throw new NotFoundException(nameof(Order), cmd.Id);

        if (order.Status is OrderStatus.Shipped or OrderStatus.Delivered)
            throw new InvalidEntityStateException($"Cannot cancel an order with status '{order.Status}'.");

        order.Status = OrderStatus.Cancelled;
        order.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(order, ct);
        await _uow.SaveChangesAsync(ct);
        return _mapper.Map<OrderResponse>(order);
    }
}
