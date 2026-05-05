import { useEffect, useState } from 'react'; import { productsApi, ordersApi, customersApi } from '../services/api'; import { useTranslation } from '../i18n'; import { Package, ShoppingBag, Users, AlertTriangle } from 'lucide-react'; import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ products: 0, orders: 0, customers: 0, lowStock: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<any[]>([]);

  useEffect(() => { Promise.all([productsApi.getAll({pageSize:1000}), ordersApi.getAll({pageSize:100}), customersApi.getAll({pageSize:1000}), productsApi.getLowStock(10)])
    .then(([pR,oR,cR,lsR])=>{ const p=pR.data.data?.items||[], o=oR.data.data?.items||[], c=cR.data.data?.items||[], l=lsR.data.data||[]; setStats({products:pR.data.data?.totalCount||p.length,orders:oR.data.data?.totalCount||o.length,customers:cR.data.data?.totalCount||c.length,lowStock:l.length}); setRecentOrders(o.slice(0,5)); const sc:Record<string,number>={}; o.forEach((x:any)=>{sc[x.status]=(sc[x.status]||0)+1}); setOrderStatusData(Object.entries(sc).map(([n,v])=>({name:n,value:v}))); }); }, []);

  const cards = [
    {label:t('products'),value:stats.products,icon:Package},
    {label:t('orders'),value:stats.orders,icon:ShoppingBag},
    {label:t('customers'),value:stats.customers,icon:Users},
    {label:t('lowStock'),value:stats.lowStock,icon:AlertTriangle},
  ];
  const COLORS = ['#171717','#525252','#a3a3a3','#d4d4d4','#737373','#262626'];
  const statusColors: Record<string, string> = { Pending: 'bg-base-100 text-base-600 dark:bg-base-900 dark:text-base-400', Delivered: 'bg-base-100 text-base-600 dark:bg-base-900 dark:text-base-400', Cancelled: 'bg-base-100 text-base-600 dark:bg-base-900 dark:text-base-400' };

  return (
    <div>
      <h1 className="text-xl font-semibold text-base-900 dark:text-white mb-6 tracking-tight">{t('dashboard')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(c=><div key={c.label} className="bg-white dark:bg-base-950 rounded-xl p-5 border border-base-200 dark:border-base-800 flex items-center gap-3"><div className="w-10 h-10 bg-base-100 dark:bg-base-900 rounded-lg flex items-center justify-center text-base-600 dark:text-base-400"><c.icon size={20}/></div><div><p className="text-xs text-base-400 font-medium uppercase tracking-wider">{c.label}</p><p className="text-xl font-semibold text-base-900 dark:text-white">{c.value}</p></div></div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-base-950 rounded-xl p-5 border border-base-200 dark:border-base-800">
          <h2 className="font-medium text-base-900 dark:text-white mb-4 text-sm">{t('dashboard__recentOrders')}</h2>
          <div className="space-y-2">{recentOrders.map(o=><div key={o.id} className="flex items-center justify-between py-2 border-b border-base-100 dark:border-base-900 last:border-0"><div><p className="font-mono text-xs text-base-400">{o.orderNumber}</p><p className="text-sm font-medium text-base-900 dark:text-white">{o.customerName}</p></div><div className="text-right"><span className={`px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wide ${statusColors[o.status]||'bg-base-100 text-base-600 dark:bg-base-900 dark:text-base-400'}`}>{o.status}</span><p className="text-sm font-semibold text-base-900 dark:text-white mt-1">${o.total.toFixed(2)}</p></div></div>)}</div>
        </div>
        <div className="bg-white dark:bg-base-950 rounded-xl p-5 border border-base-200 dark:border-base-800">
          <h2 className="font-medium text-base-900 dark:text-white mb-4 text-sm">{t('dashboard__ordersByStatus')}</h2>
          <ResponsiveContainer width="100%" height={200}><PieChart><Pie data={orderStatusData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({name,value})=>`${name}: ${value}`}>{orderStatusData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
