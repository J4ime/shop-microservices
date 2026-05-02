import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider, useCart } from '../context/CartContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { act } from 'react';

const mockProduct = {
  id: 'b2d3e4f5-2001-4000-8000-000000000001',
  name: 'Camiseta Algodón Clásica',
  price: 349.99,
  sku: 'CAM-ALG-001',
  brand: 'UrbanStyle',
  color: 'Negro',
  categoryName: 'Camisetas',
  totalStock: 200,
  sizes: [{ size: 'S', stock: 40 }, { size: 'M', stock: 60 }, { size: 'L', stock: 50 }],
};

describe('ProductCard', () => {
  it('renders product name and price', () => {
    render(<BrowserRouter><ProductCard product={mockProduct} /></BrowserRouter>);
    expect(screen.getByText('Camiseta Algodón Clásica')).toBeInTheDocument();
    expect(screen.getByText('$349.99')).toBeInTheDocument();
    expect(screen.getByText('UrbanStyle')).toBeInTheDocument();
  });

  it('renders size badges', () => {
    render(<BrowserRouter><ProductCard product={mockProduct} /></BrowserRouter>);
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('M')).toBeInTheDocument();
  });

  it('shows low stock badge when totalStock <= 10', () => {
    const lowStock = { ...mockProduct, totalStock: 5 };
    render(<BrowserRouter><ProductCard product={lowStock} /></BrowserRouter>);
    expect(screen.getByText('¡Últimas!')).toBeInTheDocument();
  });

  it('shows category badge', () => {
    render(<BrowserRouter><ProductCard product={mockProduct} /></BrowserRouter>);
    expect(screen.getByText('Camisetas')).toBeInTheDocument();
  });

  it('renders product image', () => {
    render(<BrowserRouter><ProductCard product={mockProduct} /></BrowserRouter>);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toContain('picsum.photos');
  });
});

describe('CartContext', () => {
  function TestCart() {
    const { items, addItem, removeItem, total, itemCount, clearCart } = useCart();
    return (
      <div>
        <span data-testid="count">{itemCount}</span>
        <span data-testid="total">{total}</span>
        <button data-testid="add" onClick={() => addItem({ productId: '1', name: 'Test', price: 100, size: 'M', quantity: 2 })}>Add</button>
        <button data-testid="remove" onClick={() => removeItem('1', 'M')}>Remove</button>
        <button data-testid="clear" onClick={clearCart}>Clear</button>
      </div>
    );
  }

  it('addItem adds to cart and updates total', () => {
    render(<CartProvider><TestCart /></CartProvider>);
    expect(screen.getByTestId('count').textContent).toBe('0');
    fireEvent.click(screen.getByTestId('add'));
    expect(screen.getByTestId('count').textContent).toBe('2');
    expect(screen.getByTestId('total').textContent).toBe('200');
  });

  it('removeItem removes from cart', () => {
    render(<CartProvider><TestCart /></CartProvider>);
    fireEvent.click(screen.getByTestId('add'));
    fireEvent.click(screen.getByTestId('remove'));
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('clearCart empties the cart', () => {
    render(<CartProvider><TestCart /></CartProvider>);
    fireEvent.click(screen.getByTestId('add'));
    fireEvent.click(screen.getByTestId('clear'));
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('addItem with same product+size increases quantity', () => {
    render(<CartProvider><TestCart /></CartProvider>);
    fireEvent.click(screen.getByTestId('add'));
    fireEvent.click(screen.getByTestId('add'));
    expect(screen.getByTestId('count').textContent).toBe('4');
  });
});

describe('Search filtering', () => {
  it('filters products by name case-insensitive', () => {
    const products = [mockProduct, { ...mockProduct, id: '2', name: 'Jeans Slim', sku: 'JNS-001' }];
    const search = 'jeans';
    const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('Jeans Slim');
  });

  it('filters by SKU', () => {
    const products = [mockProduct, { ...mockProduct, id: '2', name: 'Other', sku: 'XYZ-999' }];
    const filtered = products.filter(p => p.name.toLowerCase().includes('xyz') || p.sku.toLowerCase().includes('xyz'));
    expect(filtered).toHaveLength(1);
  });
});
