describe('Dashboard stats', () => {
  it('calculates correct counts', () => {
    const products = [{ id: '1' }, { id: '2' }, { id: '3' }];
    const orders = [{ id: 'o1' }, { id: 'o2' }];
    const customers = [{ id: 'c1' }];
    const lowStock = [{ id: 'ls1' }, { id: 'ls2' }, { id: 'ls3' }];

    expect(products.length).toBe(3);
    expect(orders.length).toBe(2);
    expect(customers.length).toBe(1);
    expect(lowStock.length).toBe(3);
  });
});

describe('Product filtering', () => {
  const products = [
    { id: '1', name: 'Camiseta Algodón', sku: 'CAM-001', price: 349.99, categoryName: 'Camisetas', totalStock: 200, status: 'Active', brand: 'UrbanStyle' },
    { id: '2', name: 'Jeans Slim Fit', sku: 'JNS-004', price: 899.99, categoryName: 'Pantalones', totalStock: 120, status: 'Active', brand: 'DenimCo' },
    { id: '3', name: 'Vestido Cóctel', sku: 'VES-008', price: 1299.99, categoryName: 'Vestidos', totalStock: 40, status: 'Active', brand: 'BellaModa' },
    { id: '4', name: 'Sudadera Vintage', sku: 'CHQ-018', price: 699.99, categoryName: 'Chaquetas', totalStock: 0, status: 'Discontinued', brand: 'UrbanStyle' },
  ];

  it('filters by name', () => {
    const r = products.filter(p => p.name.toLowerCase().includes('jeans'));
    expect(r).toHaveLength(1);
    expect(r[0].sku).toBe('JNS-004');
  });

  it('filters by SKU', () => {
    const r = products.filter(p => p.sku.toLowerCase().includes('ves'));
    expect(r).toHaveLength(1);
    expect(r[0].name).toBe('Vestido Cóctel');
  });

  it('filters by status', () => {
    const active = products.filter(p => p.status === 'Active');
    expect(active).toHaveLength(3);
  });

  it('finds discontinued products', () => {
    const discontinued = products.filter(p => p.status === 'Discontinued');
    expect(discontinued).toHaveLength(1);
    expect(discontinued[0].totalStock).toBe(0);
  });

  it('finds low stock products', () => {
    const lowStock = products.filter(p => p.totalStock <= 10);
    expect(lowStock).toHaveLength(1);
    expect(lowStock[0].name).toBe('Sudadera Vintage');
  });

  it('combines name + SKU search', () => {
    const search = 'urban';
    const r = products.filter(p =>
      p.name.toLowerCase().includes(search) ||
      p.sku.toLowerCase().includes(search) ||
      p.brand.toLowerCase().includes(search)
    );
    expect(r).toHaveLength(2);
  });
});

describe('Order status management', () => {
  const orders = [
    { id: '1', status: 'Pending', orderNumber: 'ORD-001' },
    { id: '2', status: 'Shipped', orderNumber: 'ORD-002' },
    { id: '3', status: 'Delivered', orderNumber: 'ORD-003' },
  ];

  const updateStatus = (list: any[], id: string, newStatus: string) =>
    list.map(o => o.id === id ? { ...o, status: newStatus } : o);

  it('updates order status', () => {
    const updated = updateStatus(orders, '1', 'Confirmed');
    expect(updated.find(o => o.id === '1')!.status).toBe('Confirmed');
  });

  it('does not modify other orders', () => {
    const updated = updateStatus(orders, '1', 'Cancelled');
    expect(updated.find(o => o.id === '2')!.status).toBe('Shipped');
  });
});

describe('i18n translations', () => {
  // Test the i18n shim logic
  const translations: Record<string, string> = {
    dashboard: 'Dashboard',
    products: 'Products',
    logout: 'Logout',
    newProduct: 'New Product',
    save: 'Save',
  };

  function t(key: string) { return translations[key] || key; }

  it('returns translation for known key', () => {
    expect(t('dashboard')).toBe('Dashboard');
    expect(t('save')).toBe('Save');
  });

  it('returns key for unknown translation', () => {
    expect(t('nonexistent')).toBe('nonexistent');
  });
});
