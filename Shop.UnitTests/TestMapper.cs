using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Shop.Application.Mappings;

namespace Shop.UnitTests;

public static class TestMapper
{
    private static readonly IMapper _mapper;

    static TestMapper()
    {
        var services = new ServiceCollection();
        services.AddLogging(b => b.AddConsole());
        services.AddAutoMapper(cfg => cfg.AddProfile(new MappingProfile()));
        var provider = services.BuildServiceProvider();
        _mapper = provider.GetRequiredService<IMapper>();
    }

    public static IMapper Instance => _mapper;
}
