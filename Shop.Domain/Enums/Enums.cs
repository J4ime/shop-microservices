namespace Shop.Domain.Enums;

public enum Size
{
    XS,
    S,
    M,
    L,
    XL,
    XXL,
    XXXL
}

public enum Gender
{
    Men,
    Women,
    Unisex,
    Kids
}

public enum OrderStatus
{
    Pending,
    Confirmed,
    Shipped,
    Delivered,
    Cancelled,
    Returned
}

public enum ProductStatus
{
    Active,
    Inactive,
    Discontinued
}
