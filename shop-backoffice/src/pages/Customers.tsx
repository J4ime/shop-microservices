import { useEffect, useState } from 'react';
import { customersApi } from '../services/api';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { customersApi.getAll({ pageSize: 500 }).then(r => setCustomers(r.data.data?.items || [])).finally(() => setLoading(false)); }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Clientes ({customers.length})</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map(c => (
          <div key={c.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-bold">{c.firstName?.[0]}{c.lastName?.[0]}</span>
              </div>
              <div><h3 className="font-semibold">{c.firstName} {c.lastName}</h3><p className="text-xs text-gray-400">{c.totalOrders} pedidos</p></div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-500"><Mail size={14} /> {c.email}</div>
              <div className="flex items-center gap-2 text-gray-500"><Phone size={14} /> {c.phone}</div>
              {(c.city || c.country) && <div className="flex items-center gap-2 text-gray-500"><MapPin size={14} /> {[c.city, c.state, c.country].filter(Boolean).join(', ')}</div>}
            </div>
            <p className="text-xs text-gray-400 mt-4">Cliente desde {new Date(c.createdAt).toLocaleDateString('es-MX')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
