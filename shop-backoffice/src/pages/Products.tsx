import { useEffect, useState } from 'react'; import { productsApi, categoriesApi } from '../services/api'; import { useTranslation } from '../i18n'; import { Plus, Trash2, Edit2, AlertTriangle, Search, X, ImageIcon } from 'lucide-react'; import toast from 'react-hot-toast';

export default function Products() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<any[]>([]); const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); const [modal, setModal] = useState<any>(null);
  const [search, setSearch] = useState('');

  useEffect(() => { Promise.all([productsApi.getAll({pageSize:500}), categoriesApi.getAll()]).then(([p,c])=>{setProducts(p.data.data?.items||[]);setCategories(c.data.data||[])}).finally(()=>setLoading(false)); }, []);
  const handleDelete = async (id: string) => { if(!confirm(t('products__confirmDelete'))) return; await productsApi.delete(id); setProducts(p=>p.filter(x=>x.id!==id)); toast.success(t('products__deleted')); };
  const filtered = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));

  return (<div>
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
      <h1 className="text-xl font-semibold text-base-900 dark:text-white tracking-tight">{t('products')} <span className="text-base-400 font-normal">({filtered.length})</span></h1>
      <div className="relative flex-1 max-w-xs">
        <Search size={15} className="absolute left-3 top-2.5 text-base-400" />
        <input placeholder={t('search')} value={search} onChange={e=>setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-base-200 dark:border-base-800 rounded-lg text-sm bg-white dark:bg-base-950 text-base-900 dark:text-white outline-none focus:border-base-400 transition-colors" />
        {search && <button onClick={()=>setSearch('')} className="absolute right-3 top-2 text-base-400"><X size={13}/></button>}
      </div>
      <button onClick={()=>setModal({})} className="flex items-center gap-1.5 bg-base-900 dark:bg-white text-white dark:text-base-900 px-4 py-2 rounded-lg font-medium text-sm hover:bg-base-700 dark:hover:bg-base-200 transition-colors ml-auto"><Plus size={16}/> {t('products__new')}</button>
    </div>
    {loading ? <div className="space-y-2">{[1,2,3,4,5].map(i=><div key={i} className="h-14 bg-base-100 dark:bg-base-900 rounded-lg animate-pulse"/>)}</div> :
      <div className="bg-white dark:bg-base-950 rounded-xl border border-base-200 dark:border-base-800 overflow-auto">
        <table className="w-full min-w-[900px]"><thead><tr className="text-left text-[11px] font-medium text-base-400 uppercase tracking-wider border-b border-base-100 dark:border-base-900"><th className="px-4 py-3">{t('products__table_product')}</th><th className="px-4 py-3">{t('products__table_sku')}</th><th className="px-4 py-3">{t('products__table_cat')}</th><th className="px-4 py-3">{t('products__field_gender')}</th><th className="px-4 py-3">{t('products__table_price')}</th><th className="px-4 py-3">{t('products__table_stock')}</th><th className="px-4 py-3">{t('products__table_status')}</th><th className="px-4 py-3"></th></tr></thead>
        <tbody className="divide-y divide-base-100 dark:divide-base-900">{filtered.map(p=>(<tr key={p.id} className="hover:bg-base-50 dark:hover:bg-base-900/50 transition-colors"><td className="px-4 py-3"><div className="flex items-center gap-3"><img src={p.hasImage?`http://localhost:5000/api/products/${p.id}/image`:(p.imageUrl||`https://picsum.photos/seed/${p.id.replace(/-/g,'').slice(0,8)}/80/100`)} className="w-9 h-11 rounded object-cover bg-base-100" alt="" /><div><p className="font-medium text-base-900 dark:text-white text-sm">{p.name}</p><p className="text-[11px] text-base-400">{p.brand||'-'}</p></div></div></td><td className="px-4 py-3 font-mono text-[11px] text-base-400">{p.sku}</td><td className="px-4 py-3 text-xs text-base-600 dark:text-base-400">{p.categoryName}</td><td className="px-4 py-3 text-xs text-base-600 dark:text-base-400">{normGender(p.gender)}</td><td className="px-4 py-3 font-semibold text-sm text-base-900 dark:text-white">${p.price.toFixed(2)}</td><td className="px-4 py-3"><span className={`font-medium text-sm ${p.totalStock<=10?'text-red-500':''}`}>{p.totalStock<=10&&<AlertTriangle size={11} className="inline mr-1"/>}{p.totalStock}</span></td><td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wide ${normStatus(p.status)==='Active'?'bg-base-100 text-base-600 dark:bg-base-900 dark:text-base-400':normStatus(p.status)==='Inactive'?'bg-base-100 text-base-600 dark:bg-base-900 dark:text-base-400':'bg-base-100 text-base-600 dark:bg-base-900 dark:text-base-400'}`}>{t('products__status_'+normStatus(p.status))}</span></td><td className="px-4 py-3"><div className="flex items-center gap-1"><button onClick={()=>setModal(p)} className="p-1.5 text-base-400 hover:text-base-900 dark:hover:text-white" title={t('products__edit')}><Edit2 size={13}/></button><button onClick={()=>handleDelete(p.id)} className="p-1.5 text-base-400 hover:text-red-500"><Trash2 size={13}/></button></div></td></tr>))}</tbody></table>
      </div>}
    {modal && <ProductModal t={t} categories={categories} product={modal} onClose={()=>setModal(null)} onSave={(p:any)=>{if(p.id) setProducts(prev=>prev.map(x=>x.id===p.id?p:x)); else setProducts(prev=>[p,...prev]); setModal(null);}} />}
  </div>);
}

const genderNum: Record<number,string> = {0:'Men',1:'Women',2:'Unisex',3:'Kids'};
function normGender(v:any){ return typeof v==='number'?genderNum[v]||'Men':v||'Men'; }
const statusNum: Record<number,string> = {0:'Active',1:'Inactive',2:'Discontinued'};
function normStatus(s:any){ return typeof s==='number'?statusNum[s]||s:s||''; }

function ProductModal({ t, categories, product, onClose, onSave }: any) {
  const [form, setForm] = useState({ name:product.name||'', description:product.description||'', sku:product.sku||'', price:product.price??'', costPrice:product.costPrice??'', totalStock:product.totalStock??0, brand:product.brand||'', material:product.material||'', color:product.color||'', imageUrl:product.imageUrl||'', categoryId:product.categoryId||categories[0]?.id||'', gender:normGender(product.gender), sizes:product.sizes?.length?product.sizes:[{size:'M',stock:10}] });
  const [imageFile, setImageFile] = useState<File|null>(null);
  const [imagePreview, setImagePreview] = useState<string|null>(product.hasImage?`http://localhost:5000/api/products/${product.id}/image`:(product.imageUrl||null));
  const [loading, setLoading] = useState(false);
  const cls = "border border-base-200 dark:border-base-800 bg-white dark:bg-base-950 text-base-900 dark:text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:border-base-400 transition-colors";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e:React.FormEvent) => { e.preventDefault(); setLoading(true); try { const payload:any={...form,price:Number(form.price),costPrice:Number(form.costPrice),totalStock:Number(form.totalStock),sizes:form.sizes.map((s:any)=>({...s,stock:Number(s.stock)}))}; const res=product.id?await productsApi.update(product.id,payload):await productsApi.create(payload); const saved = res.data.data;
      if (imageFile && saved?.id) {
        await productsApi.uploadImage(saved.id, imageFile);
        saved.hasImage = true;
        saved.imageUrl = `/api/products/${saved.id}/image`;
      }
      onSave(saved); toast.success(product.id?t('products__updated'):t('products__created')); } catch(err:any){toast.error(err.response?.data?.error?.message||t('products__error'));} setLoading(false); };

  return (<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
    <div className="bg-white dark:bg-base-950 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-base-200 dark:border-base-800 shadow-xl" onClick={e=>e.stopPropagation()}>
      <h2 className="text-lg font-semibold text-base-900 dark:text-white mb-5">{product.id?t('products__modal_edit'):t('products__modal_new')}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <input className={`${cls} col-span-2 sm:col-span-1`} placeholder={t('products__field_name')} required value={form.name} onChange={e=>setForm(s=>({...s,name:e.target.value}))}/>
          <input className={`${cls} col-span-2 sm:col-span-1`} placeholder={t('products__field_sku')} required value={form.sku} onChange={e=>setForm(s=>({...s,sku:e.target.value}))}/>
          <textarea className={`${cls} col-span-2`} placeholder={t('products__field_desc')} required rows={2} value={form.description} onChange={e=>setForm(s=>({...s,description:e.target.value}))}/>
          <input className={cls} type="number" step="0.01" placeholder={t('products__field_price')} required value={form.price} onChange={e=>setForm(s=>({...s,price:e.target.value}))}/>
          <input className={cls} type="number" step="0.01" placeholder={t('products__field_cost')} required value={form.costPrice} onChange={e=>setForm(s=>({...s,costPrice:e.target.value}))}/>
          <input className={cls} placeholder={t('products__field_brand')} value={form.brand} onChange={e=>setForm(s=>({...s,brand:e.target.value}))}/>
          <input className={cls} placeholder={t('products__field_material')} value={form.material} onChange={e=>setForm(s=>({...s,material:e.target.value}))}/>
          <input className={cls} placeholder={t('products__field_color')} value={form.color} onChange={e=>setForm(s=>({...s,color:e.target.value}))}/>
          <select className={cls} value={form.categoryId} onChange={e=>setForm(s=>({...s,categoryId:e.target.value}))}>{categories.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
          <select className={cls} value={form.gender} required onChange={e=>setForm(s=>({...s,gender:e.target.value}))}><option value="Men">{t('categories__gender_men')}</option><option value="Women">{t('categories__gender_women')}</option><option value="Unisex">{t('categories__gender_unisex')}</option><option value="Kids">{t('categories__gender_kids')}</option></select>
          <input className={cls} type="number" placeholder={t('products__field_stock')} required value={form.totalStock} onChange={e=>setForm(s=>({...s,totalStock:e.target.value}))}/>
          <div className={`${cls} col-span-2 flex items-center gap-3`}>
            {imagePreview ? <img src={imagePreview} className="w-12 h-12 rounded object-cover bg-base-100" alt="preview" /> : <div className="w-12 h-12 rounded bg-base-100 flex items-center justify-center text-base-400"><ImageIcon size={18}/></div>}
            <div className="flex-1">
              <label className="block text-xs text-base-500 mb-1">{t('products__field_image')}</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="text-xs text-base-600 dark:text-base-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-base-900 file:text-white dark:file:bg-white dark:file:text-base-900" />
            </div>
          </div>
        </div>
        <div><p className="text-sm font-medium text-base-900 dark:text-white mb-2">{t('products__sizes')}</p>
          {form.sizes.map((s:any,i:number)=>(<div key={i} className="flex gap-2 mb-2"><select className={`${cls} w-24`} value={s.size} onChange={e=>{const sz=[...form.sizes];sz[i]={...sz[i],size:e.target.value};setForm(f=>({...f,sizes:sz}));}}>{['XS','S','M','L','XL','XXL','XXXL'].map(z=><option key={z} value={z}>{z}</option>)}</select><input className={`${cls} w-24`} type="number" placeholder={t('stock')} value={s.stock} onChange={e=>{const sz=[...form.sizes];sz[i]={...sz[i],stock:Number(e.target.value)};setForm(f=>({...f,sizes:sz}));}}/><button type="button" onClick={()=>setForm(f=>({...f,sizes:form.sizes.filter((_:any,j:number)=>j!==i)}))} className="text-red-500 px-2 text-sm">×</button></div>))}
          <button type="button" onClick={()=>setForm(f=>({...f,sizes:[...f.sizes,{size:'M',stock:0}]}))} className="text-base-900 dark:text-white text-sm font-medium hover:underline">{t('products__addSize')}</button>
        </div>
        <div className="flex gap-3 pt-3"><button type="button" onClick={onClose} className="flex-1 py-2.5 border border-base-200 dark:border-base-800 rounded-lg font-medium text-base-600 dark:text-base-400 hover:bg-base-50 dark:hover:bg-base-900 transition-colors">{t('cancel')}</button><button type="submit" disabled={loading} className="flex-1 py-2.5 bg-base-900 dark:bg-white text-white dark:text-base-900 rounded-lg font-medium hover:bg-base-700 dark:hover:bg-base-200 disabled:opacity-50 transition-colors">{loading?t('products__saving'):t('save')}</button></div>
      </form>
    </div>
  </div>);
}
