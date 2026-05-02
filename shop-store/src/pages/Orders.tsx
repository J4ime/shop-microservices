import { useEffect, useState } from 'react'; import { ordersApi } from '../services/api'; import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';

const SI: Record<string, any> = { Pending: Clock, Confirmed: CheckCircle, Shipped: Truck, Delivered: Package, Cancelled: XCircle, Returned: XCircle };
const SC: Record<string, string> = { Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', Confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', Shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', Delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', Cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', Returned: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' };
const SL: Record<string, string> = { Pending: 'Pendiente', Confirmed: 'Confirmado', Shipped: 'Enviado', Delivered: 'Entregado', Cancelled: 'Cancelado', Returned: 'Devuelto' };

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { const cid = JSON.parse(localStorage.getItem('user') || '{}')?.id; if (cid) ordersApi.getByCustomer(cid).then(r => setOrders(r.data.data?.items || [])).finally(() => setLoading(false)); else setLoading(false); }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Mis Pedidos</h1>
      {loading ? <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}</div> :
      orders.length===0 ? <div className="text-center py-20"><Package size={64} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" /><h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No tienes pedidos aún</h2><p className="text-gray-500">¡Compra algo!</p></div> :
      <div className="space-y-4">{orders.map(o=>{const I=SI[o.status]||Package;return(<div key={o.id} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"><div className="flex items-center justify-between mb-3"><span className="font-mono text-sm text-gray-500 dark:text-gray-400">{o.orderNumber}</span><span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${SC[o.status]}`}><I size={14}/>{SL[o.status]||o.status}</span></div><div className="flex items-center gap-3 overflow-x-auto pb-2">{o.items?.map((i:any)=><div key={i.id} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2 flex-shrink-0"><div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" /><div><p className="text-sm font-medium truncate max-w-[140px] dark:text-white">{i.productName}</p><p className="text-xs text-gray-400">x{i.quantity} · {i.size} · ${i.total.toFixed(2)}</p></div></div>)}</div><div className="flex justify-between items-center mt-3 pt-3 border-t dark:border-gray-700"><span className="text-sm text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</span><span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">${o.total.toFixed(2)}</span></div></div>)})}</div>}
    </div>
  );
}
