import { useEffect, useState } from 'react'; import { customersApi } from '../services/api'; import { useTranslation } from '../i18n'; import { Mail, Phone, MapPin } from 'lucide-react';

export default function Customers() {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState<any[]>([]);
  useEffect(() => { customersApi.getAll({pageSize:500}).then(r=>setCustomers(r.data.data?.items||[])); }, []);

  return (<div><h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{t('customers__title')} ({customers.length})</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{customers.map(c=>(<div key={c.id} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800"><div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center"><span className="text-indigo-600 dark:text-indigo-400 font-bold">{c.firstName?.[0]}{c.lastName?.[0]}</span></div><div><h3 className="font-semibold text-gray-900 dark:text-white">{c.firstName} {c.lastName}</h3><p className="text-xs text-gray-400">{c.totalOrders} {t('customers__orders')}</p></div></div><div className="space-y-2 text-sm"><div className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><Mail size={14}/> {c.email}</div><div className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><Phone size={14}/> {c.phone}</div>{(c.city||c.country)&&<div className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><MapPin size={14}/> {[c.city,c.state,c.country].filter(Boolean).join(', ')}</div>}</div><p className="text-xs text-gray-400 mt-4">{t('customers__since')} {new Date(c.createdAt).toLocaleDateString()}</p></div>))}</div></div>);
}
