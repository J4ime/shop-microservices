import { useState } from 'react'; import { useNavigate } from 'react-router-dom'; import { useCart } from '../context/CartContext'; import { useAuth } from '../context/AuthContext'; import { ordersApi, customersApi } from '../services/api'; import { CreditCard, MapPin } from 'lucide-react'; import toast from 'react-hot-toast';

export default function Checkout() {
  const { items, total, clearCart } = useCart(); const { user } = useAuth(); const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: user?.email || '', phone: '', address: '', city: '', state: '', postalCode: '', country: 'México', notes: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); if (items.length === 0) { toast.error('Carrito vacío'); return; } setLoading(true); try { const custRes = await customersApi.create({ ...form, authUserId: user?.id }); const customerId = custRes.data.data.id; const orderItems = items.map(i => ({ productId: i.productId, size: i.size, quantity: i.quantity })); await ordersApi.create({ customerId, shippingAddress: `${form.address}, ${form.city}`, notes: form.notes, shippingCost: total >= 999 ? 0 : 99, items: orderItems }); clearCart(); toast.success('¡Pedido creado!'); navigate('/orders'); } catch (err: any) { toast.error(err.response?.data?.error?.message || 'Error'); } setLoading(false); };
  if (items.length === 0) { navigate('/cart'); return null; }

  const cls = "border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Finalizar Compra</h1>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="font-semibold text-lg flex items-center gap-2 mb-4 text-gray-900 dark:text-white"><MapPin size={18} /> Datos de Envío</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[{k:'firstName',p:'Nombre'},{k:'lastName',p:'Apellido'},{k:'email',p:'Email'},{k:'phone',p:'Teléfono'},{k:'address',p:'Dirección',c:'sm:col-span-2'},{k:'city',p:'Ciudad'},{k:'state',p:'Estado'},{k:'postalCode',p:'C.P.'}].map(f => <input key={f.k} type={f.k==='email'?'email':'text'} placeholder={f.p} required={['firstName','lastName','email','phone','address','city'].includes(f.k)} value={(form as any)[f.k]} onChange={e=>setForm(s=>({...s,[f.k]:e.target.value}))} className={`${cls} ${f.c||''}`} />)}
              <textarea placeholder="Notas (opcional)" value={form.notes} onChange={e=>setForm(s=>({...s,notes:e.target.value}))} className={`${cls} sm:col-span-2 h-20 resize-none`} />
            </div>
          </div>
        </div>
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="font-semibold text-lg flex items-center gap-2 mb-4 text-gray-900 dark:text-white"><CreditCard size={18} /> Resumen</h2>
            <div className="space-y-2 text-sm">{items.map(i=><div key={`${i.productId}-${i.size}`} className="flex justify-between text-gray-700 dark:text-gray-300"><span className="truncate max-w-[180px]">{i.name} x{i.quantity} ({i.size})</span><span className="font-medium">${(i.price*i.quantity).toFixed(2)}</span></div>)}</div>
            <div className="border-t dark:border-gray-700 mt-4 pt-4 space-y-2 text-gray-900 dark:text-white"><div className="flex justify-between"><span>Subtotal</span><span>${total.toFixed(2)}</span></div><div className="flex justify-between text-green-600"><span>Envío</span><span>{total>=999?'GRATIS':'$99.00'}</span></div><div className="flex justify-between text-lg font-bold border-t dark:border-gray-700 pt-2"><span>Total</span><span>${(total>=999?total:total+99).toFixed(2)}</span></div></div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200">{loading?'Procesando...':`Pagar $${(total>=999?total:total+99).toFixed(2)}`}</button>
        </div>
      </form>
    </div>
  );
}
