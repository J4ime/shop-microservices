import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

interface Props {
  product: {
    id: string; name: string; price: number; sku: string;
    brand?: string; color?: string; sizes?: { size: string; stock: number }[];
    categoryName?: string; totalStock: number;
  };
}

const colorMap: Record<string, string> = {
  Negro: '#1a1a1a', Blanco: '#f5f5f5', Azul: '#3b82f6', 'Azul Marino': '#1e3a5f',
  Rojo: '#ef4444', Gris: '#9ca3af', 'Gris Melange': '#b0b0b0', 'Verde Olivo': '#556b2f',
  Beige: '#d4c5a9', Café: '#8b4513', Verde: '#22c55e', 'Estampado Floral': '#ec4899',
  'Negro/Blanco': '#333',
};

export default function ProductCard({ product }: Props) {
  const navigate = useNavigate();
  const bgColor = product.color ? (colorMap[product.color] || '#e5e7eb') : '#e5e7eb';

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-gray-900/50 transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-100 dark:border-gray-800"
    >
      <div className="h-56 relative overflow-hidden" style={{ backgroundColor: bgColor + '20' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full" style={{ backgroundColor: bgColor, opacity: 0.3 }} />
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="text-xs font-medium bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-2 py-1 rounded-full text-gray-700 dark:text-gray-200">
            {product.categoryName || 'Ropa'}
          </span>
        </div>
        {product.totalStock <= 10 && product.totalStock > 0 && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            ¡Últimas!
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">{product.brand || 'UrbanStyle'}</p>
        <h3 className="font-semibold text-gray-900 dark:text-white mt-1 truncate">{product.name}</h3>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">${product.price.toFixed(2)}</span>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
            className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <ShoppingCart size={14} /> Comprar
          </button>
        </div>
        {product.sizes && product.sizes.length > 0 && (
          <div className="flex gap-1 mt-3">
            {product.sizes.slice(0, 4).map(s => (
              <span key={s.size} className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded font-medium">
                {s.size}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
