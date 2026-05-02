using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shop.Application.DTOs;
using Shop.Application.Features.Products;

namespace Shop.Api.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductsController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<PagedResponse<ProductResponse>>> GetAll(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] Guid? categoryId = null)
    {
        var result = await _mediator.Send(new GetAllProductsQuery(page, pageSize, categoryId));
        return Ok(new { success = true, data = result });
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<ProductResponse>> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetProductByIdQuery(id));
        return Ok(new { success = true, data = result });
    }

    [HttpGet("low-stock")]
    [Authorize]
    public async Task<ActionResult<IReadOnlyList<ProductResponse>>> GetLowStock(
        [FromQuery] int threshold = 10)
    {
        var result = await _mediator.Send(new GetLowStockProductsQuery(threshold));
        return Ok(new { success = true, data = result });
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ProductResponse>> Create([FromBody] CreateProductDto dto)
    {
        var result = await _mediator.Send(new CreateProductCommand(dto));
        return CreatedAtAction(nameof(GetById), new { id = result.Id },
            new { success = true, data = result });
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<ProductResponse>> Update(Guid id, [FromBody] UpdateProductDto dto)
    {
        var result = await _mediator.Send(new UpdateProductCommand(id, dto));
        return Ok(new { success = true, data = result });
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _mediator.Send(new DeleteProductCommand(id));
        return NoContent();
    }
}
