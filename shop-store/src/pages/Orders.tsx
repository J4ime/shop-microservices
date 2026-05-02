import { useEffect, useState } from 'react';
import { ordersApi } from '../services/api';
import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';

const statusIcons: Record<string, any> = {
  Pending: Clock, Confirmed: CheckCircle, Shipped: Truck,
  Delivered: Package, Cancelled: XCircle, Returned: XCircle,
};
const statusColors: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-700', Confirmed: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700', Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700', Returned: 'bg-gray-100 text-gray-700',
};
const statusLabels: Record<string, string> = {
  Pending: 'Pendiente', Confirmed: 'Confirmado', Shipped: 'Enviado',
  Delivered: 'Entregado', Cancelled: 'Cancelado', Returned: 'Devuelto',
};

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const customerId = JSON.parse(localStorage.getItem('user') || '{}')?.id;
    if (customerId) {
      ordersApi.getByCustomer(customerId)
        .then(r => setOrders(r.data.data?.items || []))
        .finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis Pedidos</h1>
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No tienes pedidos aún</h2>
          <p className="text-gray-500">¡Compra algo para ver tus pedidos aquí!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const Icon = statusIcons[order.status] || Package;
            return (
              <div key={order.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-sm text-gray-500">{order.orderNumber}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusColors[order.status]}`}>
                    <Icon size={14} /> {statusLabels[order.status] || order.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium truncate max-w-[140px]">{item.productName}</p>
                        <p className="text-xs text-gray-400">x{item.quantity} · {item.size} · ${item.total.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t">
                  <span className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span className="text-lg font-bold text-indigo-600">${order.total.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
