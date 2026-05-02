import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

interface Props {
  product: {
    id: string; name: string; price: number; sku: string;
    brand?: string; color?: string; imageUrl?: string; sizes?: { size: string; stock: number }[];
    categoryName?: string; totalStock: number;
  };
}

function getImageUrl(p: Props['product']) {
  if (p.imageUrl) return p.imageUrl;
  // Stable random image based on product ID hash
  let hash = 0;
  for (let i = 0; i < p.id.length; i++) hash = ((hash << 5) - hash) + p.id.charCodeAt(i) | 0;
  const seed = Math.abs(hash % 200);
  // Use fashion-themed picsum images
  return `https://picsum.photos/seed/${seed + 100}/600/750`;
}

export default function ProductCard({ product }: Props) {
  const navigate = useNavigate();
  const img = getImageUrl(product);

  return (
    <div onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-gray-900/50 transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-100 dark:border-gray-800">
      <div className="h-64 relative overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img src={img} alt={product.name} loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute bottom-3 left-3">
          <span className="text-xs font-medium bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-2 py-1 rounded-full text-gray-700 dark:text-gray-200">{product.categoryName || 'Ropa'}</span>
        </div>
        {product.totalStock <= 10 && product.totalStock > 0 && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">¡Últimas!</div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">{product.brand || 'UrbanStyle'}</p>
        <h3 className="font-semibold text-gray-900 dark:text-white mt-1 truncate">{product.name}</h3>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">${product.price.toFixed(2)}</span>
          <button onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
            className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors">
            <ShoppingCart size={14} /> Comprar
          </button>
        </div>
        {product.sizes && product.sizes.length > 0 && (
          <div className="flex gap-1 mt-3">
            {product.sizes.slice(0, 4).map(s => (
              <span key={s.size} className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded font-medium">{s.size}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
