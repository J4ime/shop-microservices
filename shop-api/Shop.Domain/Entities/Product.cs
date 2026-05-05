using Shop.Domain.Enums;

namespace Shop.Domain.Entities;

public class Product : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal CostPrice { get; set; }
    public int TotalStock { get; set; }
    public ProductStatus Status { get; set; } = ProductStatus.Active;
    public string? Brand { get; set; }
    public string? Material { get; set; }
    public string? Color { get; set; }
    public string? ImageUrl { get; set; }
    public byte[]? ImageData { get; set; }
    public Gender Gender { get; set; }
    public Guid CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    public ICollection<ProductSize> Sizes { get; set; } = new List<ProductSize>();
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}

public class ProductSize : BaseEntity
{
    public Size Size { get; set; }
    public int Stock { get; set; }
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
}
