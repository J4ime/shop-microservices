using AutoMapper;
using FluentAssertions;
using Moq;
using Shop.Application.DTOs;
using Shop.Application.Features.Categories;
using Shop.Domain.Entities;
using Shop.Domain.Exceptions;
using Shop.Domain.Interfaces;

namespace Shop.UnitTests.Application.Handlers;

public class CategoryHandlerTests
{
    private readonly Mock<ICategoryRepository> _repoMock = new();
    private readonly Mock<IUnitOfWork> _uowMock = new();
    private readonly IMapper _mapper;

    public CategoryHandlerTests()
    {
        _mapper = TestMapper.Instance;
    }

    [Fact]
    public async Task CreateCategory_DuplicateName_ShouldThrowAlreadyExists()
    {
        _repoMock.Setup(r => r.NameExistsAsync("Test", null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        var handler = new CreateCategoryHandler(_repoMock.Object, _uowMock.Object, _mapper);
        var cmd = new CreateCategoryCommand(new CreateCategoryDto("Test", null, null));

        await handler.Invoking(h => h.Handle(cmd, CancellationToken.None))
            .Should().ThrowAsync<AlreadyExistsException>();
    }

    [Fact]
    public async Task CreateCategory_ShouldSucceed()
    {
        _repoMock.Setup(r => r.NameExistsAsync(It.IsAny<string>(), null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        _repoMock.Setup(r => r.AddAsync(It.IsAny<Category>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Category c, CancellationToken _) => c);

        var handler = new CreateCategoryHandler(_repoMock.Object, _uowMock.Object, _mapper);
        var cmd = new CreateCategoryCommand(new CreateCategoryDto("New", "Desc", null));

        var result = await handler.Handle(cmd, CancellationToken.None);

        result.Name.Should().Be("New");
        _uowMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UpdateCategory_NotFound_ShouldThrowNotFound()
    {
        _repoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Category?)null);

        var handler = new UpdateCategoryHandler(_repoMock.Object, _uowMock.Object, _mapper);
        var cmd = new UpdateCategoryCommand(Guid.NewGuid(), new UpdateCategoryDto("X", null, null));

        await handler.Invoking(h => h.Handle(cmd, CancellationToken.None))
            .Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task GetAllCategories_ShouldReturnAll()
    {
        var categories = new List<Category> { new() { Name = "C1" }, new() { Name = "C2" } };
        _repoMock.Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>())).ReturnsAsync(categories);

        var handler = new GetAllCategoriesHandler(_repoMock.Object, _mapper);
        var result = await handler.Handle(new GetAllCategoriesQuery(), CancellationToken.None);

        result.Should().HaveCount(2);
    }
}
