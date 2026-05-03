import { useEffect, useState } from 'react';
import { productsApi, categoriesApi } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useTranslation } from '../i18n';
import { Filter, Search, X } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 mb-8 text-white">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">{t('home__hero')}</h1>
        <p className="text-indigo-100 text-lg mb-6 max-w-lg">{t('home__heroDesc')}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-3 text-gray-400" />
          <input type="text" placeholder={t('home__search')} value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"><X size={16} /></button>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          <button onClick={() => setSelectedCategory('')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${!selectedCategory ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{t('home__all')}</button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCategory === cat.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{cat.name}</button>
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">{resultsText}</p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (<div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-4 animate-pulse"><div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-xl mb-4" /><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2" /><div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/2" /></div>))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
}
