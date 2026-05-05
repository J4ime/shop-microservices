import { useEffect, useState } from 'react'; import { ordersApi } from '../services/api'; import { useTranslation } from '../i18n'; import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';

const SI: Record<string, any> = { Pending: Clock, Confirmed: CheckCircle, Shipped: Truck, Delivered: Package, Cancelled: XCircle, Returned: XCircle };
const SC: Record<string, string> = { Pending: 'bg-base-100 text-base-600 dark:bg-base-900 dark:text-base-400', Confirmed: 'bg-base-100 text-base-600 dark:bg-base-900 dark:text-base-400', Shipped: 'bg-base-100 text-base-600 dark:bg-base-900 dark:text-base-400', Delivered: 'bg-base-100 text-base-600 dark:bg-base-900 dark:text-base-400', Cancelled: 'bg-base-100 text-base-600 dark:bg-base-900 dark:text-base-400', Returned: 'bg-base-100 text-base-600 dark:bg-base-900 dark:text-base-400' };

function statusKey(s: string): string {
  const map: Record<string, string> = { Pending:'orders__statusPending', Confirmed:'orders__statusConfirmed', Shipped:'orders__statusShipped', Delivered:'orders__statusDelivered', Cancelled:'orders__statusCancelled', Returned:'orders__statusReturned' };
  return map[s] || s;
}

export default function Orders() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { const cid = JSON.parse(localStorage.getItem('user') || '{}')?.id; if (cid) ordersApi.getByCustomer(cid).then(r => setOrders(r.data.data?.items || [])).finally(() => setLoading(false)); else setLoading(false); }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-base-900 dark:text-white mb-8 tracking-tight">{t('orders__title')}</h1>
      {loading ? <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-20 bg-base-100 dark:bg-base-900 rounded-xl animate-pulse" />)}</div> :
      orders.length===0 ? <div className="text-center py-20"><Package size={48} className="mx-auto text-base-300 dark:text-base-700 mb-4" /><h2 className="text-lg font-semibold text-base-900 dark:text-white mb-2">{t('orders__empty')}</h2><p className="text-base-500 text-sm">{t('orders__emptyTagline')}</p></div> :
      <div className="space-y-3">{orders.map(o=>{const I=SI[o.status]||Package;return(<div key={o.id} className="border border-base-200 dark:border-base-800 rounded-xl p-5 bg-white dark:bg-base-950"><div className="flex items-center justify-between mb-3"><span className="font-mono text-xs text-base-400">{o.orderNumber}</span><span className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 uppercase tracking-wide ${SC[o.status]}`}><I size={12}/>{t(statusKey(o.status))}</span></div><div className="flex items-center gap-3 overflow-x-auto pb-2">{o.items?.map((i:any)=><div key={i.id} className="flex items-center gap-2 bg-base-50 dark:bg-base-900 rounded-lg px-3 py-2 flex-shrink-0"><div className="w-8 h-8 bg-base-200 dark:bg-base-800 rounded" /><div><p className="text-xs font-medium truncate max-w-[140px] dark:text-white">{i.productName}</p><p className="text-[10px] text-base-400">x{i.quantity} · {i.size} · ${i.total.toFixed(2)}</p></div></div>)}</div><div className="flex justify-between items-center mt-3 pt-3 border-t border-base-100 dark:border-base-900"><span className="text-xs text-base-400">{new Date(o.createdAt).toLocaleDateString()}</span><span className="text-base font-semibold text-base-900 dark:text-white">${o.total.toFixed(2)}</span></div></div>)})}</div>}
    </div>
  );
}
