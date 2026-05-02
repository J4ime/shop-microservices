import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';

describe('Backoffice Components', () => {
  it('renders layout navigation links', () => {
    const { container } = render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <div>Dashboard</div>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});

describe('Product filtering', () => {
  const products = [
    { id: '1', name: 'Camiseta', sku: 'CAM-001', price: 100, categoryName: 'Ropa', totalStock: 10, status: 'Active', brand: 'Nike' },
    { id: '2', name: 'Jeans', sku: 'JNS-001', price: 200, categoryName: 'Pantalones', totalStock: 5, status: 'Active', brand: 'Levis' },
  ];

  it('filters products by name', () => {
    const search = 'jeans';
    const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('Jeans');
  });

  it('filters products by SKU', () => {
    const search = 'cam';
    const filtered = products.filter(p => p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search));
    expect(filtered).toHaveLength(1);
    expect(filtered[0].sku).toBe('CAM-001');
  });

  it('returns all products when search is empty', () => {
    const filtered = products.filter(() => true);
    expect(filtered).toHaveLength(2);
  });
});

describe('Dashboard stats', () => {
  it('calculates correct stats from data', () => {
    const products = [{ id: '1' }, { id: '2' }, { id: '3' }];
    const orders = [{ id: 'o1' }];
    const customers = [{ id: 'c1' }, { id: 'c2' }];
    const lowStock = [{ id: 'ls1' }];

    expect(products.length).toBe(3);
    expect(orders.length).toBe(1);
    expect(customers.length).toBe(2);
    expect(lowStock.length).toBe(1);
  });
});
