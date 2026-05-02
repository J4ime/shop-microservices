import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function Cart() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <ShoppingBag size={64} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tu carrito está vacío</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">¡Agrega productos para empezar a comprar!</p>
      <Link to="/" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 inline-block">Ir a la Tienda</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1 mb-6"><ArrowLeft size={16} /> Seguir comprando</Link>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Tu Carrito ({itemCount})</h1>
      <div className="space-y-3">
        {items.map(item => (
          <div key={`${item.productId}-${item.size}`} className="bg-white dark:bg-gray-900 rounded-2xl p-4 flex items-center gap-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-xl flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">{item.name}</h3>
              <p className="text-sm text-gray-400">Talla: {item.size}</p>
              <p className="text-indigo-600 dark:text-indigo-400 font-bold">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-2">
              <button onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><Minus size={14} /></button>
              <span className="w-8 text-center font-semibold text-sm text-gray-900 dark:text-white">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><Plus size={14} /></button>
            </div>
            <button onClick={() => removeItem(item.productId, item.size)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex justify-between text-lg mb-2 text-gray-900 dark:text-white"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
        <div className="flex justify-between text-lg mb-4"><span className="text-gray-400">Envío</span><span className="text-green-600">Calculado después</span></div>
        <div className="border-t dark:border-gray-700 pt-4 flex justify-between text-2xl font-bold text-gray-900 dark:text-white"><span>Total</span><span>${total.toFixed(2)}</span></div>
      </div>
      <button onClick={() => isAuthenticated ? navigate('/checkout') : navigate('/login')} className="mt-6 w-full bg-indigo-600 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
        Proceder al Pago
      </button>
    </div>
  );
}
