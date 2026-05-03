import { useEffect, useState } from 'react'; import { productsApi, categoriesApi } from '../services/api'; import { useTranslation } from '../i18n'; import { Plus, Trash2, AlertTriangle, Search, X } from 'lucide-react'; import toast from 'react-hot-toast';

export default function Products() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<any[]>([]); const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); const [modal, setModal] = useState<any>(null);
  const [search, setSearch] = useState('');

  useEffect(() => { Promise.all([productsApi.getAll({pageSize:500}), categoriesApi.getAll()]).then(([p,c])=>{setProducts(p.data.data?.items||[]);setCategories(c.data.data||[])}).finally(()=>setLoading(false)); }, []);
  const handleDelete = async (id: string) => { if(!confirm(t('products__confirmDelete'))) return; await productsApi.delete(id); setProducts(p=>p.filter(x=>x.id!==id)); toast.success(t('products__deleted')); };
  const filtered = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));

  return (<div>
    <div className="flex items-center gap-4 mb-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('products')} ({filtered.length})</h1>
      <div className="relative flex-1 max-w-xs">
        <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        <input placeholder={t('search')} value={search} onChange={e=>setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
        {search && <button onClick={()=>setSearch('')} className="absolute right-3 top-2 text-gray-400"><X size={14}/></button>}
      </div>
      <button onClick={()=>setModal({})} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl font-semibold text-sm hover:bg-indigo-700 ml-auto"><Plus size={18}/> {t('products__new')}</button>
    </div>
    {loading ? <div className="space-y-3">{[1,2,3,4,5].map(i=><div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"/>)}</div> :
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-auto">
        <table className="w-full min-w-[800px]"><thead><tr className="bg-gray-50 dark:bg-gray-800 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"><th className="px-4 py-3">{t('products__table_product')}</th><th className="px-4 py-3">{t('products__table_sku')}</th><th className="px-4 py-3">{t('products__table_cat')}</th><th className="px-4 py-3">{t('products__table_price')}</th><th className="px-4 py-3">{t('products__table_stock')}</th><th className="px-4 py-3">{t('products__table_img')}</th><th className="px-4 py-3">{t('products__table_status')}</th><th className="px-4 py-3"></th></tr></thead>
        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">{filtered.map(p=>(<tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50"><td className="px-4 py-3"><div className="flex items-center gap-3"><img src={p.imageUrl||`https://picsum.photos/seed/${p.id.replace(/-/g,'').slice(0,8)}/80/100`} className="w-10 h-12 rounded-lg object-cover bg-gray-100" alt="" /><div><p className="font-medium text-gray-900 dark:text-white text-sm">{p.name}</p><p className="text-xs text-gray-400">{p.brand||'-'}</p></div></div></td><td className="px-4 py-3 font-mono text-xs text-gray-500">{p.sku}</td><td className="px-4 py-3 text-xs text-gray-700 dark:text-gray-300">{p.categoryName}</td><td className="px-4 py-3 font-semibold text-sm text-gray-900 dark:text-white">${p.price.toFixed(2)}</td><td className="px-4 py-3"><span className={`font-semibold text-sm ${p.totalStock<=10?'text-red-500':'text-gray-900 dark:text-white'}`}>{p.totalStock<=10&&<AlertTriangle size={12} className="inline mr-1"/>}{p.totalStock}</span></td><td className="px-4 py-3 text-xs">{p.imageUrl ? <span className="text-green-500">✓</span> : <span className="text-gray-400" onClick={()=>setModal(p)} style={{cursor:'pointer'}}>{t('products__addImage')}</span>}</td><td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${p.status==='Active'?'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400':'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>{p.status}</span></td><td className="px-4 py-3"><button onClick={()=>handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={14}/></button></td></tr>))}</tbody></table>
      </div>}
    {modal && <ProductModal t={t} categories={categories} product={modal} onClose={()=>setModal(null)} onSave={(p:any)=>{if(p.id) setProducts(prev=>prev.map(x=>x.id===p.id?p:x)); else setProducts(prev=>[p,...prev]); setModal(null);}} />}
  </div>);
}

function ProductModal({ t, categories, product, onClose, onSave }: any) {
  const [form, setForm] = useState({ name:product.name||'', description:product.description||'', sku:product.sku||'', price:product.price||'', costPrice:product.costPrice||'', totalStock:product.totalStock||'', brand:product.brand||'', material:product.material||'', color:product.color||'', imageUrl:product.imageUrl||'', categoryId:product.categoryId||categories[0]?.id||'', sizes:product.sizes||[{size:'M',stock:10}] });
  const [loading, setLoading] = useState(false);
  const cls = "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500";

  const handleSubmit = async (e:React.FormEvent) => { e.preventDefault(); setLoading(true); try { const payload={...form,price:Number(form.price),costPrice:Number(form.costPrice),totalStock:Number(form.totalStock),sizes:form.sizes.map((s:any)=>({...s,stock:Number(s.stock)}))}; const res=product.id?await productsApi.update(product.id,payload):await productsApi.create(payload); onSave(res.data.data); toast.success(product.id?t('products__updated'):t('products__created')); } catch(err:any){toast.error(err.response?.data?.error?.message||t('products__error'));} setLoading(false); };

  return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e=>e.stopPropagation()}>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{product.id?t('products__modal_edit'):t('products__modal_new')}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input className={`${cls} col-span-2 sm:col-span-1`} placeholder={t('products__field_name')} required value={form.name} onChange={e=>setForm(s=>({...s,name:e.target.value}))}/>
          <input className={`${cls} col-span-2 sm:col-span-1`} placeholder={t('products__field_sku')} required value={form.sku} onChange={e=>setForm(s=>({...s,sku:e.target.value}))}/>
          <textarea className={`${cls} col-span-2`} placeholder={t('products__field_desc')} required rows={2} value={form.description} onChange={e=>setForm(s=>({...s,description:e.target.value}))}/>
          <input className={cls} type="number" step="0.01" placeholder={t('products__field_price')} required value={form.price} onChange={e=>setForm(s=>({...s,price:e.target.value}))}/>
          <input className={cls} type="number" step="0.01" placeholder={t('products__field_cost')} required value={form.costPrice} onChange={e=>setForm(s=>({...s,costPrice:e.target.value}))}/>
          <input className={cls} placeholder={t('products__field_brand')} value={form.brand} onChange={e=>setForm(s=>({...s,brand:e.target.value}))}/>
          <input className={cls} placeholder={t('products__field_material')} value={form.material} onChange={e=>setForm(s=>({...s,material:e.target.value}))}/>
          <input className={cls} placeholder={t('products__field_color')} value={form.color} onChange={e=>setForm(s=>({...s,color:e.target.value}))}/>
          <select className={cls} value={form.categoryId} onChange={e=>setForm(s=>({...s,categoryId:e.target.value}))}>{categories.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
          <input className={cls} type="number" placeholder={t('products__field_stock')} required value={form.totalStock} onChange={e=>setForm(s=>({...s,totalStock:e.target.value}))}/>
          <input className={`${cls} col-span-2`} placeholder={t('products__field_image')} value={form.imageUrl} onChange={e=>setForm(s=>({...s,imageUrl:e.target.value}))}/>
        </div>
        <div><p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{t('products__sizes')}</p>
          {form.sizes.map((s:any,i:number)=>(<div key={i} className="flex gap-2 mb-2"><select className={`${cls} w-24`} value={s.size} onChange={e=>{const sz=[...form.sizes];sz[i]={...sz[i],size:e.target.value};setForm(f=>({...f,sizes:sz}));}}>{['XS','S','M','L','XL','XXL','XXXL'].map(z=><option key={z} value={z}>{z}</option>)}</select><input className={`${cls} w-24`} type="number" placeholder={t('stock')} value={s.stock} onChange={e=>{const sz=[...form.sizes];sz[i]={...sz[i],stock:Number(e.target.value)};setForm(f=>({...f,sizes:sz}));}}/><button type="button" onClick={()=>setForm(f=>({...f,sizes:form.sizes.filter((_:any,j:number)=>j!==i)}))} className="text-red-500 px-2">×</button></div>))}
          <button type="button" onClick={()=>setForm(f=>({...f,sizes:[...f.sizes,{size:'M',stock:0}]}))} className="text-indigo-600 text-sm font-medium">{t('products__addSize')}</button>
        </div>
        <div className="flex gap-3 pt-4"><button type="button" onClick={onClose} className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-gray-600 dark:text-gray-400">{t('cancel')}</button><button type="submit" disabled={loading} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50">{loading?t('products__saving'):t('save')}</button></div>
      </form>
    </div>
  </div>);
}
