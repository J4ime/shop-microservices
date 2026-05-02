import { useEffect, useState } from 'react';
import { productsApi, categoriesApi } from '../services/api';
import { Plus, Edit2, Trash2, Search, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<any>(null);

  useEffect(() => {
    Promise.all([productsApi.getAll({ pageSize: 500 }), categoriesApi.getAll()])
      .then(([p, c]) => { setProducts(p.data.data?.items || []); setCategories(c.data.data || []); })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return;
    await productsApi.delete(id);
    setProducts(p => p.filter(x => x.id !== id));
    toast.success('Producto eliminado');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Productos ({products.length})</h1>
        <button onClick={() => setModal({})} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors">
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Producto</th><th className="px-6 py-4">SKU</th><th className="px-6 py-4">Categoría</th><th className="px-6 py-4">Precio</th><th className="px-6 py-4">Stock</th><th className="px-6 py-4">Estado</th><th className="px-6 py-4"></th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4"><p className="font-medium text-gray-900">{p.name}</p><p className="text-xs text-gray-400">{p.brand || '-'}</p></td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-500">{p.sku}</td>
                  <td className="px-6 py-4 text-sm">{p.categoryName}</td>
                  <td className="px-6 py-4 font-semibold">${p.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${p.totalStock <= 10 ? 'text-red-500' : 'text-gray-900'}`}>
                      {p.totalStock <= 10 && <AlertTriangle size={14} className="inline mr-1 text-red-500" />}
                      {p.totalStock}
                    </span>
                  </td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${p.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.status}</span></td>
                  <td className="px-6 py-4"><button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && <ProductModal categories={categories} product={modal} onClose={() => setModal(null)} onSave={(p: any) => { if (p.id) setProducts(prev => prev.map(x => x.id === p.id ? p : x)); else setProducts(prev => [p, ...prev]); setModal(null); }} />}
    </div>
  );
}

function ProductModal({ categories, product, onClose, onSave }: any) {
  const [form, setForm] = useState({
    name: product.name || '', description: product.description || '', sku: product.sku || '',
    price: product.price || '', costPrice: product.costPrice || '', totalStock: product.totalStock || '',
    brand: product.brand || '', material: product.material || '', color: product.color || '',
    categoryId: product.categoryId || categories[0]?.id || '',
    sizes: product.sizes || [{ size: 'M', stock: 10 }],
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const payload = {
        ...form, price: Number(form.price), costPrice: Number(form.costPrice), totalStock: Number(form.totalStock),
        sizes: form.sizes.map((s: any) => ({ ...s, stock: Number(s.stock) })),
      };
      let res;
      if (product.id) {
        res = await productsApi.update(product.id, payload);
      } else {
        res = await productsApi.create(payload);
      }
      onSave(res.data.data);
      toast.success(product.id ? 'Producto actualizado' : 'Producto creado');
    } catch (err: any) { toast.error(err.response?.data?.error?.message || 'Error'); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-6">{product.id ? 'Editar Producto' : 'Nuevo Producto'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input className="input" placeholder="Nombre *" required value={form.name} onChange={e => setForm(s => ({ ...s, name: e.target.value }))} />
            <input className="input" placeholder="SKU *" required value={form.sku} onChange={e => setForm(s => ({ ...s, sku: e.target.value }))} />
            <textarea className="input col-span-2" placeholder="Descripción *" required rows={2} value={form.description} onChange={e => setForm(s => ({ ...s, description: e.target.value }))} />
            <input className="input" type="number" step="0.01" placeholder="Precio *" required value={form.price} onChange={e => setForm(s => ({ ...s, price: e.target.value }))} />
            <input className="input" type="number" step="0.01" placeholder="Costo *" required value={form.costPrice} onChange={e => setForm(s => ({ ...s, costPrice: e.target.value }))} />
            <input className="input" placeholder="Marca" value={form.brand} onChange={e => setForm(s => ({ ...s, brand: e.target.value }))} />
            <input className="input" placeholder="Material" value={form.material} onChange={e => setForm(s => ({ ...s, material: e.target.value }))} />
            <input className="input" placeholder="Color" value={form.color} onChange={e => setForm(s => ({ ...s, color: e.target.value }))} />
            <select className="input" value={form.categoryId} onChange={e => setForm(s => ({ ...s, categoryId: e.target.value }))}>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input className="input" type="number" placeholder="Stock total *" required value={form.totalStock} onChange={e => setForm(s => ({ ...s, totalStock: e.target.value }))} />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Tallas</p>
            {form.sizes.map((s: any, i: number) => (
              <div key={i} className="flex gap-2 mb-2">
                <select className="input w-24" value={s.size} onChange={e => { const sizes = [...form.sizes]; sizes[i] = { ...sizes[i], size: e.target.value }; setForm(f => ({ ...f, sizes })); }}>
                  {['XS','S','M','L','XL','XXL','XXXL'].map(z => <option key={z} value={z}>{z}</option>)}
                </select>
                <input className="input w-24" type="number" placeholder="Stock" value={s.stock} onChange={e => { const sizes = [...form.sizes]; sizes[i] = { ...sizes[i], stock: Number(e.target.value) }; setForm(f => ({ ...f, sizes })); }} />
                <button type="button" onClick={() => setForm(f => ({ ...f, sizes: form.sizes.filter((_: any, j: number) => j !== i) }))} className="text-red-500 px-2">×</button>
              </div>
            ))}
            <button type="button" onClick={() => setForm(f => ({ ...f, sizes: [...f.sizes, { size: 'M', stock: 0 }] }))} className="text-indigo-600 text-sm font-medium">+ Agregar talla</button>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50">{loading ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
