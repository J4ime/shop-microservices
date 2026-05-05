import { getProductImageUrl } from '../utils/images';

// --- Pure logic tests (no React, no DOM) ---

describe('Product filtering', () => {
  const products = [
    { id: '1', name: 'Camiseta Algodón', sku: 'CAM-001', brand: 'UrbanStyle', price: 349.99, categoryName: 'Camisetas', totalStock: 200 },
    { id: '2', name: 'Jeans Slim', sku: 'JNS-001', brand: 'DenimCo', price: 899.99, categoryName: 'Pantalones', totalStock: 120 },
    { id: '3', name: 'Vestido Midi Floral', sku: 'VES-007', brand: 'BellaModa', price: 799.99, categoryName: 'Vestidos', totalStock: 60 },
  ];

  it('filters by name (case insensitive)', () => {
    const r = products.filter(p => p.name.toLowerCase().includes('jeans'));
    expect(r).toHaveLength(1);
    expect(r[0].sku).toBe('JNS-001');
  });

  it('filters by SKU', () => {
    const r = products.filter(p => p.sku.toLowerCase().includes('cam'));
    expect(r).toHaveLength(1);
    expect(r[0].name).toBe('Camiseta Algodón');
  });

  it('filters by brand', () => {
    const r = products.filter(p => p.brand.toLowerCase().includes('denim'));
    expect(r).toHaveLength(1);
  });

  it('returns empty for no matches', () => {
    const r = products.filter(p => p.name.toLowerCase().includes('xyz123'));
    expect(r).toHaveLength(0);
  });
});

describe('Cart logic', () => {
  type CartItem = { productId: string; name: string; price: number; size: string; quantity: number };

  const addItem = (items: CartItem[], item: CartItem): CartItem[] => {
    const existing = items.find(i => i.productId === item.productId && i.size === item.size);
    if (existing) return items.map(i => i.productId === item.productId && i.size === item.size ? { ...i, quantity: i.quantity + item.quantity } : i);
    return [...items, item];
  };

  const removeItem = (items: CartItem[], productId: string, size: string) =>
    items.filter(i => !(i.productId === productId && i.size === size));

  const getTotal = (items: CartItem[]) => items.reduce((s, i) => s + i.price * i.quantity, 0);

  it('addItem adds new item', () => {
    const items = addItem([], { productId: '1', name: 'Test', price: 100, size: 'M', quantity: 2 });
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it('addItem increases quantity for existing product+size', () => {
    let items = addItem([], { productId: '1', name: 'Test', price: 100, size: 'M', quantity: 2 });
    items = addItem(items, { productId: '1', name: 'Test', price: 100, size: 'M', quantity: 3 });
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(5);
  });

  it('removeItem removes item', () => {
    const items = removeItem([{ productId: '1', name: 'T', price: 50, size: 'M', quantity: 1 }], '1', 'M');
    expect(items).toHaveLength(0);
  });

  it('getTotal calculates correctly', () => {
    const items = [
      { productId: '1', name: 'A', price: 100, size: 'M', quantity: 2 },
      { productId: '2', name: 'B', price: 50, size: 'L', quantity: 1 },
    ];
    expect(getTotal(items)).toBe(250);
  });
});

describe('Image URL generation', () => {
  it('returns custom URL if imageUrl is set', () => {
    expect(getProductImageUrl({ id: '1', name: 'Test', imageUrl: 'https://example.com/img.jpg' })).toBe('https://example.com/img.jpg');
  });

  it('generates loremflickr URL with category and color keywords', () => {
    const url = getProductImageUrl({ id: 'abc123', name: 'Camiseta Algodón', categoryName: 'Camisetas', color: 'Roja' });
    expect(url).toContain('loremflickr.com');
    expect(url).toContain('600');
    expect(url).toContain('750');
    expect(url).toContain('lock=');
    expect(url).toContain('t-shirt');
    expect(url).toContain('red');
  });

  it('same product returns same stable URL', () => {
    const a = getProductImageUrl({ id: 'fixed-id', name: 'Jeans', categoryName: 'Pantalones' });
    const b = getProductImageUrl({ id: 'fixed-id', name: 'Jeans', categoryName: 'Pantalones' });
    expect(a).toBe(b);
  });
});

describe('Product validation', () => {
  const validate = (p: any) => {
    const errors: string[] = [];
    if (!p.name || p.name.length < 3) errors.push('Name too short');
    if (p.price <= 0) errors.push('Price must be positive');
    if (p.costPrice > p.price) errors.push('Cost cannot exceed price');
    if (!p.sizes || p.sizes.length === 0) errors.push('At least one size required');
    return errors;
  };

  it('valid product passes', () => {
    expect(validate({ name: 'Test', price: 100, costPrice: 50, sizes: [{ size: 'M', stock: 10 }] })).toHaveLength(0);
  });

  it('short name fails', () => {
    expect(validate({ name: 'AB', price: 100, costPrice: 50, sizes: [{ size: 'M', stock: 10 }] })).toContain('Name too short');
  });

  it('cost > price fails', () => {
    expect(validate({ name: 'Test', price: 50, costPrice: 100, sizes: [{ size: 'M', stock: 10 }] })).toContain('Cost cannot exceed price');
  });

  it('no sizes fails', () => {
    expect(validate({ name: 'Test', price: 100, costPrice: 50, sizes: [] })).toContain('At least one size required');
  });
});

describe('Order status flow', () => {
  const statusFlow: Record<string, string[]> = {
    Pending: ['Confirmed', 'Cancelled'],
    Confirmed: ['Shipped', 'Cancelled'],
    Shipped: ['Delivered'],
  };

  it('Pending can go to Confirmed or Cancelled', () => {
    expect(statusFlow['Pending']).toEqual(['Confirmed', 'Cancelled']);
  });

  it('Shipped can only go to Delivered', () => {
    expect(statusFlow['Shipped']).toEqual(['Delivered']);
  });

  it('Delivered has no next status', () => {
    expect(statusFlow['Delivered']).toBeUndefined();
  });
});
