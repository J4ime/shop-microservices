import { useEffect, useState } from 'react'; import { customersApi } from '../services/api'; import { useTranslation } from '../i18n'; import { Mail, Phone, MapPin } from 'lucide-react';

export default function Customers() {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState<any[]>([]);
  useEffect(() => { customersApi.getAll({pageSize:500}).then(r=>setCustomers(r.data.data?.items||[])); }, []);

  return (<div><h1 className="text-xl font-semibold text-base-900 dark:text-white mb-6 tracking-tight">{t('customers__title')} <span className="text-base-400 font-normal">({customers.length})</span></h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{customers.map(c=>(<div key={c.id} className="bg-white dark:bg-base-950 rounded-xl p-5 border border-base-200 dark:border-base-800 hover:border-base-300 dark:hover:border-base-700 transition-colors"><div className="flex items-center gap-3 mb-4"><div className="w-9 h-9 bg-base-100 dark:bg-base-900 rounded-full flex items-center justify-center"><span className="text-base-900 dark:text-white font-semibold text-xs">{c.firstName?.[0]}{c.lastName?.[0]}</span></div><div><h3 className="font-medium text-base-900 dark:text-white text-sm">{c.firstName} {c.lastName}</h3><p className="text-[11px] text-base-400">{c.totalOrders} {t('customers__orders')}</p></div></div><div className="space-y-1.5 text-xs text-base-500"><div className="flex items-center gap-2"><Mail size={13}/> {c.email}</div><div className="flex items-center gap-2"><Phone size={13}/> {c.phone}</div>{(c.city||c.country)&&<div className="flex items-center gap-2"><MapPin size={13}/> {[c.city,c.state,c.country].filter(Boolean).join(', ')}</div>}</div><p className="text-[11px] text-base-400 mt-3">{t('customers__since')} {new Date(c.createdAt).toLocaleDateString()}</p></div>))}</div></div>);
}
