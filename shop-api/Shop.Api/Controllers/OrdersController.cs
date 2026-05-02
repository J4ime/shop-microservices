using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shop.Application.DTOs;
using Shop.Application.Features.Orders;

namespace Shop.Api.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IMediator _mediator;

    public OrdersController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<ActionResult<PagedResponse<OrderResponse>>> GetAll(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var result = await _mediator.Send(new GetAllOrdersQuery(page, pageSize));
        return Ok(new { success = true, data = result });
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<OrderResponse>> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetOrderByIdQuery(id));
        return Ok(new { success = true, data = result });
    }

    [HttpGet("customer/{customerId:guid}")]
    public async Task<ActionResult<PagedResponse<OrderResponse>>> GetByCustomer(
        Guid customerId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var result = await _mediator.Send(new GetOrdersByCustomerQuery(customerId, page, pageSize));
        return Ok(new { success = true, data = result });
    }

    [HttpPost]
    public async Task<ActionResult<OrderResponse>> Create([FromBody] CreateOrderDto dto)
    {
        var result = await _mediator.Send(new CreateOrderCommand(dto));
        return CreatedAtAction(nameof(GetById), new { id = result.Id },
            new { success = true, data = result });
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult<OrderResponse>> UpdateStatus(
        Guid id, [FromBody] UpdateOrderStatusDto dto)
    {
        var result = await _mediator.Send(new UpdateOrderStatusCommand(id, dto));
        return Ok(new { success = true, data = result });
    }

    [HttpPost("{id:guid}/cancel")]
    public async Task<ActionResult<OrderResponse>> Cancel(Guid id)
    {
        var result = await _mediator.Send(new CancelOrderCommand(id));
        return Ok(new { success = true, data = result });
    }
}
