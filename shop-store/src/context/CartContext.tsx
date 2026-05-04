import { createContext, useContext, useState, type ReactNode } from 'react';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType>(null!);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId && i.size === item.size);
      if (existing) return prev.map(i => i.productId === item.productId && i.size === item.size ? { ...i, quantity: i.quantity + item.quantity } : i);
      return [...prev, item];
    });
  };

  const removeItem = (productId: string, size: string) =>
    setItems(prev => prev.filter(i => !(i.productId === productId && i.size === size)));

  const updateQuantity = (productId: string, size: string, qty: number) => {
    if (qty <= 0) { removeItem(productId, size); return; }
    setItems(prev => prev.map(i => i.productId === productId && i.size === size ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setItems([]);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
