import { useEffect, useState } from 'react';
import { productsApi, categoriesApi } from '../services/api';
import ProductCard from '../components/ProductCard';
import { Filter, Search } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([productsApi.getAll({ pageSize: 100 }), categoriesApi.getAll()])
      .then(([pRes, cRes]) => {
        setProducts(pRes.data.data?.items || []);
        setCategories(cRes.data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = selectedCategory
    ? products.filter(p => p.categoryId === selectedCategory)
    : products;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 mb-10 text-white">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">Nueva Colección Primavera</h1>
        <p className="text-indigo-100 text-lg mb-6 max-w-lg">Descubre las últimas tendencias en moda. Estilo, comodidad y calidad en cada prenda.</p>
        <button className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-indigo-50 transition-colors">
          Ver Colección
        </button>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <Filter size={16} className="text-gray-400" />
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!selectedCategory ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Todos
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-xl mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
