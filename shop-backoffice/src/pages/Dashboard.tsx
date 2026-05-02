import { useEffect, useState } from 'react';
import { productsApi, ordersApi, customersApi } from '../services/api';
import { Package, ShoppingBag, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, customers: 0, lowStock: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      productsApi.getAll({ pageSize: 1000 }),
      ordersApi.getAll({ pageSize: 100 }),
      customersApi.getAll({ pageSize: 1000 }),
      productsApi.getLowStock(10),
    ]).then(([pRes, oRes, cRes, lsRes]) => {
      const products = pRes.data.data?.items || [];
      const orders = oRes.data.data?.items || [];
      const customers = cRes.data.data?.items || [];
      const lowStock = lsRes.data.data || [];

      setStats({
        products: pRes.data.data?.totalCount || products.length,
        orders: oRes.data.data?.totalCount || orders.length,
        customers: cRes.data.data?.totalCount || customers.length,
        lowStock: lowStock.length,
      });

      setRecentOrders(orders.slice(0, 5));

      const statusCount: Record<string, number> = {};
      orders.forEach((o: any) => { statusCount[o.status] = (statusCount[o.status] || 0) + 1; });
      setOrderStatusData(Object.entries(statusCount).map(([name, value]) => ({ name, value })));
    });
  }, []);

  const cards = [
    { label: 'Productos', value: stats.products, icon: Package, color: 'bg-indigo-500' },
    { label: 'Pedidos', value: stats.orders, icon: ShoppingBag, color: 'bg-emerald-500' },
    { label: 'Clientes', value: stats.customers, icon: Users, color: 'bg-amber-500' },
    { label: 'Stock Bajo', value: stats.lowStock, icon: AlertTriangle, color: 'bg-red-500' },
  ];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map(card => (
          <div key={card.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
              <card.icon size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4">Pedidos Recientes</h2>
          <div className="space-y-3">
            {recentOrders.map(o => (
              <div key={o.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-mono text-sm text-gray-500">{o.orderNumber}</p>
                  <p className="text-sm font-medium">{o.customerName}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    o.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                    o.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                    o.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>{o.status}</span>
                  <p className="text-sm font-bold text-indigo-600 mt-1">${o.total.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4">Pedidos por Estado</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={orderStatusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {orderStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
