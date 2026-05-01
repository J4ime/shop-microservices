using Shop.Domain.Enums;

namespace Shop.Domain.Entities;

public class Category : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Gender? Gender { get; set; }
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
