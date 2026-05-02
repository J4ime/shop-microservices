import { useEffect, useState } from 'react';
import { ordersApi } from '../services/api';
import { CheckCircle, Truck, XCircle, Package, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const statusFlow: Record<string, string[]> = {
  Pending: ['Confirmed', 'Cancelled'],
  Confirmed: ['Shipped', 'Cancelled'],
  Shipped: ['Delivered'],
};

const statusIcons: Record<string, any> = { Pending: Clock, Confirmed: CheckCircle, Shipped: Truck, Delivered: Package, Cancelled: XCircle };

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { ordersApi.getAll({ pageSize: 200 }).then(r => setOrders(r.data.data?.items || [])).finally(() => setLoading(false)); }, []);

  const updateStatus = async (id: string, status: string) => {
    try { await ordersApi.updateStatus(id, { status }); setOrders(p => p.map(o => o.id === id ? { ...o, status } : o)); toast.success('Estado actualizado'); }
    catch (err: any) { toast.error(err.response?.data?.error?.message || 'Error'); }
  };

  const cancelOrder = async (id: string) => { if (!confirm('¿Cancelar pedido?')) return;
    try { await ordersApi.cancel(id); setOrders(p => p.map(o => o.id === id ? { ...o, status: 'Cancelled' } : o)); toast.success('Pedido cancelado'); }
    catch (err: any) { toast.error(err.response?.data?.error?.message || 'Error'); } };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Pedidos ({orders.length})</h1>
      {loading ? <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}</div> :
        <div className="space-y-3">{
          orders.map(o => {
            const Icon = statusIcons[o.status] || Package;
            const nextStatuses = statusFlow[o.status] || [];
            return (
              <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="p-5 flex items-center justify-between cursor-pointer" onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${o.status === 'Pending' ? 'bg-amber-100' : o.status === 'Delivered' ? 'bg-green-100' : o.status === 'Cancelled' ? 'bg-red-100' : 'bg-blue-100'}`}>
                      <Icon size={18} className={o.status === 'Pending' ? 'text-amber-600' : o.status === 'Delivered' ? 'text-green-600' : o.status === 'Cancelled' ? 'text-red-600' : 'text-blue-600'} />
                    </div>
                    <div><p className="font-mono text-sm text-gray-500">{o.orderNumber}</p><p className="font-medium">{o.customerName}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${o.status === 'Pending' ? 'bg-amber-100 text-amber-700' : o.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{o.status}</span>
                    <span className="font-bold text-indigo-600">${o.total.toFixed(2)}</span>
                  </div>
                </div>
                {expanded === o.id && (
                  <div className="px-5 pb-5 border-t pt-4">
                    <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm"><div><p className="text-gray-400">Envío a</p><p className="font-medium">{o.shippingAddress || '-'}</p></div><div><p className="text-gray-400">Notas</p><p>{o.notes || '-'}</p></div><div><p className="text-gray-400">Fecha</p><p>{new Date(o.createdAt).toLocaleString('es-MX')}</p></div></div>
                    <div className="space-y-2 mb-4">
                      {o.items?.map((i: any) => (<div key={i.id} className="flex justify-between text-sm py-1 border-b border-gray-50"><span>{i.productName} x{i.quantity} ({i.size})</span><span className="font-medium">${i.total.toFixed(2)}</span></div>))}
                    </div>
                    <div className="flex justify-end gap-2 text-sm"><span>Subtotal: ${o.subtotal.toFixed(2)}</span><span>IVA: ${o.tax.toFixed(2)}</span><span>Envío: ${o.shippingCost.toFixed(2)}</span><span className="font-bold text-lg">Total: ${o.total.toFixed(2)}</span></div>
                    {nextStatuses.length > 0 && (
                      <div className="flex gap-2 mt-4 pt-4 border-t">
                        {nextStatuses.map(s => (
                          <button key={s} onClick={() => s === 'Cancelled' ? cancelOrder(o.id) : updateStatus(o.id, s)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold ${s === 'Cancelled' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}>
                            {s === 'Cancelled' ? 'Cancelar' : s === 'Confirmed' ? 'Confirmar' : s === 'Shipped' ? 'Enviar' : s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        }</div>
      }
    </div>
  );
}
