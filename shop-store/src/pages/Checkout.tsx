import { useState } from 'react'; import { useNavigate } from 'react-router-dom'; import { useCart } from '../context/CartContext'; import { useAuth } from '../context/AuthContext'; import { ordersApi, customersApi } from '../services/api'; import { useTranslation } from '../i18n'; import { CreditCard, MapPin } from 'lucide-react'; import toast from 'react-hot-toast';

export default function Checkout() {
  const { t } = useTranslation();
  const { items, total, clearCart } = useCart(); const { user } = useAuth(); const navigate = useNavigate();
  const shippingCost = total >= 999 ? 0 : 99;
  const finalTotal = total + shippingCost;
  const [form, setForm] = useState({ firstName: '', lastName: '', email: user?.email || '', phone: '', address: '', city: '', state: '', postalCode: '', country: 'México', notes: '' });
  const [loading, setLoading] = useState(false);

  const fields = [
    {k:'firstName',key:'checkout__firstName'},{k:'lastName',key:'checkout__lastName'},{k:'email',key:'checkout__email'},
    {k:'phone',key:'checkout__phone'},{k:'address',key:'checkout__address',c:'sm:col-span-2'},{k:'city',key:'checkout__city'},
    {k:'state',key:'checkout__state'},{k:'postalCode',key:'checkout__postalCode'}
  ];

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); if (items.length === 0) { toast.error(t('checkout__emptyCartError')); return; } setLoading(true); try { const custRes = await customersApi.create({ ...form, authUserId: user?.id }); const customerId = custRes.data.data.id; const orderItems = items.map(i => ({ productId: i.productId, size: i.size, quantity: i.quantity })); await ordersApi.create({ customerId, shippingAddress: `${form.address}, ${form.city}`, notes: form.notes, shippingCost, items: orderItems }); clearCart(); toast.success(t('checkout__orderCreated')); navigate('/orders'); } catch (err: any) { toast.error(err.response?.data?.error?.message || t('checkout__error')); } setLoading(false); };
  if (items.length === 0) { navigate('/cart'); return null; }

  const cls = "border border-base-200 dark:border-base-800 rounded-lg px-4 py-3 text-sm outline-none bg-white dark:bg-base-950 text-base-900 dark:text-white focus:border-base-400 transition-colors";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-base-900 dark:text-white mb-8 tracking-tight">{t('checkout__title')}</h1>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3 space-y-6">
          <div className="border border-base-200 dark:border-base-800 rounded-xl p-6">
            <h2 className="font-medium flex items-center gap-2 mb-4 text-base-900 dark:text-white text-sm"><MapPin size={16} /> {t('checkout__shipping')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fields.map(f => <input key={f.k} type={f.k==='email'?'email':'text'} placeholder={t(f.key)} required={['firstName','lastName','email','phone','address','city'].includes(f.k)} value={(form as any)[f.k]} onChange={e=>setForm(s=>({...s,[f.k]:e.target.value}))} className={`${cls} ${(f as any).c||''}`} />)}
              <textarea placeholder={t('checkout__notesOpt')} value={form.notes} onChange={e=>setForm(s=>({...s,notes:e.target.value}))} className={`${cls} sm:col-span-2 h-20 resize-none`} />
            </div>
          </div>
        </div>
        <div className="md:col-span-2 space-y-4">
          <div className="border border-base-200 dark:border-base-800 rounded-xl p-6">
            <h2 className="font-medium flex items-center gap-2 mb-4 text-base-900 dark:text-white text-sm"><CreditCard size={16} /> {t('checkout__summary')}</h2>
            <div className="space-y-2 text-sm">{items.map(i=><div key={`${i.productId}-${i.size}`} className="flex justify-between text-base-600 dark:text-base-400"><span className="truncate max-w-[180px]">{i.name} x{i.quantity} ({i.size})</span><span className="font-medium text-base-900 dark:text-white">${(i.price*i.quantity).toFixed(2)}</span></div>)}</div>
            <div className="border-t border-base-100 dark:border-base-900 mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-base-600 dark:text-base-400"><span>{t('cart__subtotal')}</span><span className="text-base-900 dark:text-white">${total.toFixed(2)}</span></div>
              <div className="flex justify-between text-green-600"><span>{t('cart__shipping')}</span><span>{shippingCost === 0 ? t('checkout__freeShipping') : '$99.00'}</span></div>
              <div className="flex justify-between text-base font-semibold text-base-900 dark:text-white pt-2 border-t border-base-100 dark:border-base-900"><span>{t('cart__total')}</span><span>${finalTotal.toFixed(2)}</span></div>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-base-900 dark:bg-white text-white dark:text-base-900 py-3.5 rounded-lg font-medium hover:bg-base-700 dark:hover:bg-base-200 disabled:opacity-50 transition-colors">{loading ? t('checkout__processing') : `${t('checkout__pay')} $${finalTotal.toFixed(2)}`}</button>
        </div>
      </form>
    </div>
  );
}
