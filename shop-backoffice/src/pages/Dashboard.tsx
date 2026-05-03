import { useEffect, useState } from 'react'; import { productsApi, ordersApi, customersApi } from '../services/api'; import { useTranslation } from '../i18n'; import { Package, ShoppingBag, Users, AlertTriangle } from 'lucide-react'; import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ products: 0, orders: 0, customers: 0, lowStock: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<any[]>([]);

  useEffect(() => { Promise.all([productsApi.getAll({pageSize:1000}), ordersApi.getAll({pageSize:100}), customersApi.getAll({pageSize:1000}), productsApi.getLowStock(10)])
    .then(([pR,oR,cR,lsR])=>{ const p=pR.data.data?.items||[], o=oR.data.data?.items||[], c=cR.data.data?.items||[], l=lsR.data.data||[]; setStats({products:pR.data.data?.totalCount||p.length,orders:oR.data.data?.totalCount||o.length,customers:cR.data.data?.totalCount||c.length,lowStock:l.length}); setRecentOrders(o.slice(0,5)); const sc:Record<string,number>={}; o.forEach((x:any)=>{sc[x.status]=(sc[x.status]||0)+1}); setOrderStatusData(Object.entries(sc).map(([n,v])=>({name:n,value:v}))); }); }, []);

  const cards = [{label:t('products'),value:stats.products,icon:Package,color:'bg-indigo-500'},{label:t('orders'),value:stats.orders,icon:ShoppingBag,color:'bg-emerald-500'},{label:t('customers'),value:stats.customers,icon:Users,color:'bg-amber-500'},{label:t('lowStock'),value:stats.lowStock,icon:AlertTriangle,color:'bg-red-500'}];
  const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899'];
  const statusColors: Record<string, string> = { Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', Delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', Cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{t('dashboard')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map(c=><div key={c.label} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4"><div className={`w-12 h-12 ${c.color} rounded-xl flex items-center justify-center`}><c.icon size={24} className="text-white"/></div><div><p className="text-sm text-gray-400 font-medium">{c.label}</p><p className="text-2xl font-bold text-gray-900 dark:text-white">{c.value}</p></div></div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">{t('dashboard__recentOrders')}</h2>
          <div className="space-y-3">{recentOrders.map(o=><div key={o.id} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0"><div><p className="font-mono text-sm text-gray-500">{o.orderNumber}</p><p className="text-sm font-medium text-gray-900 dark:text-white">{o.customerName}</p></div><div className="text-right"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[o.status]||'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>{o.status}</span><p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-1">${o.total.toFixed(2)}</p></div></div>)}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">{t('dashboard__ordersByStatus')}</h2>
          <ResponsiveContainer width="100%" height={220}><PieChart><Pie data={orderStatusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name,value})=>`${name}: ${value}`}>{orderStatusData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
