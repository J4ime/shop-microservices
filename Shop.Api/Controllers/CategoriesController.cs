using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shop.Application.DTOs;
using Shop.Application.Features.Categories;

namespace Shop.Api.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    private readonly IMediator _mediator;

    public CategoriesController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<CategoryResponse>>> GetAll()
    {
        var result = await _mediator.Send(new GetAllCategoriesQuery());
        return Ok(new { success = true, data = result });
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<CategoryResponse>> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetCategoryByIdQuery(id));
        return Ok(new { success = true, data = result });
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<CategoryResponse>> Create([FromBody] CreateCategoryDto dto)
    {
        var result = await _mediator.Send(new CreateCategoryCommand(dto));
        return CreatedAtAction(nameof(GetById), new { id = result.Id },
            new { success = true, data = result });
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<CategoryResponse>> Update(Guid id, [FromBody] UpdateCategoryDto dto)
    {
        var result = await _mediator.Send(new UpdateCategoryCommand(id, dto));
        return Ok(new { success = true, data = result });
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _mediator.Send(new DeleteCategoryCommand(id));
        return NoContent();
    }
}
