using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shop.Application.DTOs;
using Shop.Application.Features.Customers;

namespace Shop.Api.Controllers;

[ApiController]
[Route("api/customers")]
public class CustomersController : ControllerBase
{
    private readonly IMediator _mediator;

    public CustomersController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<PagedResponse<CustomerResponse>>> GetAll(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var result = await _mediator.Send(new GetAllCustomersQuery(page, pageSize));
        return Ok(new { success = true, data = result });
    }

    [HttpGet("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<CustomerResponse>> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetCustomerByIdQuery(id));
        return Ok(new { success = true, data = result });
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult<CustomerResponse>> Create([FromBody] CreateCustomerDto dto)
    {
        var result = await _mediator.Send(new CreateCustomerCommand(dto));
        return CreatedAtAction(nameof(GetById), new { id = result.Id },
            new { success = true, data = result });
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<CustomerResponse>> Update(Guid id, [FromBody] UpdateCustomerDto dto)
    {
        var result = await _mediator.Send(new UpdateCustomerCommand(id, dto));
        return Ok(new { success = true, data = result });
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _mediator.Send(new DeleteCustomerCommand(id));
        return NoContent();
    }
}
