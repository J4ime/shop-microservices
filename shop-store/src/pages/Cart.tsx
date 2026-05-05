import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function Cart() {
  const { t } = useTranslation();
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <ShoppingBag size={48} className="mx-auto text-base-300 dark:text-base-700 mb-4" />
      <h2 className="text-xl font-semibold text-base-900 dark:text-white mb-2">{t('cart__empty')}</h2>
      <p className="text-base-500 dark:text-base-400 mb-8 text-sm">{t('cart__emptyTagline')}</p>
      <Link to="/" className="bg-base-900 dark:bg-white text-white dark:text-base-900 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-base-700 dark:hover:bg-base-200 inline-block transition-colors">{t('cart__goShop')}</Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link to="/" className="text-base-500 hover:text-base-900 dark:hover:text-white flex items-center gap-1 mb-8 text-sm transition-colors"><ArrowLeft size={16} /> {t('cart__keepBuying')}</Link>
      <h1 className="text-2xl font-semibold text-base-900 dark:text-white mb-8 tracking-tight">{t('cart__title')} <span className="text-base-400 font-normal">({itemCount})</span></h1>
      <div className="space-y-4">
        {items.map(item => (
          <div key={`${item.productId}-${item.size}`} className="flex items-center gap-4 py-4 border-b border-base-100 dark:border-base-900">
            <div className="w-14 h-14 bg-base-100 dark:bg-base-900 rounded-lg flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-base-900 dark:text-white text-sm">{item.name}</h3>
              <p className="text-xs text-base-400">{t('cart__sizeLabel')}: {item.size}</p>
            </div>
            <div className="flex items-center gap-2 border border-base-200 dark:border-base-800 rounded-lg px-1.5 py-1">
              <button onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)} className="p-1 hover:bg-base-100 dark:hover:bg-base-900 rounded"><Minus size={12} /></button>
              <span className="w-6 text-center font-medium text-xs text-base-900 dark:text-white">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)} className="p-1 hover:bg-base-100 dark:hover:bg-base-900 rounded"><Plus size={12} /></button>
            </div>
            <span className="text-sm font-semibold text-base-900 dark:text-white w-16 text-right">${(item.price * item.quantity).toFixed(2)}</span>
            <button onClick={() => removeItem(item.productId, item.size)} className="p-1.5 text-base-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
      <div className="mt-8 pt-6 border-t border-base-200 dark:border-base-800">
        <div className="flex justify-between text-sm mb-2 text-base-500"><span>{t('cart__subtotal')}</span><span className="text-base-900 dark:text-white">${total.toFixed(2)}</span></div>
        <div className="flex justify-between text-sm mb-4"><span>{t('cart__shipping')}</span><span className="text-green-600">{t('cart__shippingCalc')}</span></div>
        <div className="flex justify-between text-lg font-semibold text-base-900 dark:text-white"><span>{t('cart__total')}</span><span>${total.toFixed(2)}</span></div>
      </div>
      <button onClick={() => isAuthenticated ? navigate('/checkout') : navigate('/login')} className="mt-6 w-full bg-base-900 dark:bg-white text-white dark:text-base-900 py-3.5 rounded-lg font-medium hover:bg-base-700 dark:hover:bg-base-200 transition-colors">
        {t('cart__checkout')}
      </button>
    </div>
  );
}
