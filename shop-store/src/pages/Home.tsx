import { useEffect, useState } from 'react';
import { productsApi, categoriesApi } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useTranslation } from '../i18n';
import { Search, X } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([productsApi.getAll({ pageSize: 500 }), categoriesApi.getAll()])
      .then(([pRes, cRes]) => { setProducts(pRes.data.data?.items || []); setCategories(cRes.data.data || []); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => {
    if (selectedCategory && p.categoryId !== selectedCategory) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase()) && !(p.brand || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const resultsKey = filtered.length !== 1 ? 'home__results_plural' : 'home__results';
  const resultsText = t(resultsKey).replace('{{count}}', String(filtered.length));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-base-900 dark:text-white mb-3">{t('home__hero')}</h1>
        <p className="text-base-500 dark:text-base-400 text-lg max-w-md">{t('home__heroDesc')}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-3 text-base-400" />
          <input type="text" placeholder={t('home__search')} value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 border border-base-200 dark:border-base-800 rounded-lg text-sm bg-white dark:bg-base-950 text-base-900 dark:text-white outline-none focus:border-base-400 transition-colors" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-2.5 text-base-400 hover:text-base-600"><X size={14} /></button>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setSelectedCategory('')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${!selectedCategory ? 'bg-base-900 dark:bg-white text-white dark:text-base-900 border-base-900 dark:border-white' : 'bg-white dark:bg-base-950 text-base-500 border-base-200 dark:border-base-800 hover:border-base-300 dark:hover:border-base-700'}`}>{t('home__all')}</button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${selectedCategory === cat.id ? 'bg-base-900 dark:bg-white text-white dark:text-base-900 border-base-900 dark:border-white' : 'bg-white dark:bg-base-950 text-base-500 border-base-200 dark:border-base-800 hover:border-base-300 dark:hover:border-base-700'}`}>{cat.name}</button>
          ))}
        </div>
      </div>
      <p className="text-xs text-base-400 mb-6">{resultsText}</p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="border border-base-200 dark:border-base-800 rounded-xl p-3 animate-pulse">
              <div className="h-48 bg-base-100 dark:bg-base-900 rounded-lg mb-3" />
              <div className="h-3 bg-base-100 dark:bg-base-900 rounded w-2/3 mb-2" />
              <div className="h-4 bg-base-100 dark:bg-base-900 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
}
