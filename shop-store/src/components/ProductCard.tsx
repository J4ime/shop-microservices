import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useTranslation } from '../i18n';

interface Props {
  product: {
    id: string; name: string; price: number; sku: string;
    brand?: string; color?: string; imageUrl?: string; sizes?: { size: string; stock: number }[];
    categoryName?: string; totalStock: number;
  };
}

function getImageUrl(p: Props['product']) {
  if (p.imageUrl) return p.imageUrl;
  const catSeeds: Record<string, number> = {
    'Camisetas': 10, 'Pantalones': 20, 'Vestidos': 30, 'Chaquetas': 40,
    'Zapatos': 50, 'Accesorios': 60, 'Ropa Deportiva': 70, 'Ropa Infantil': 80,
  };
  const base = catSeeds[p.categoryName || ''] || 1;
  let hash = 0;
  for (let i = 0; i < p.id.length; i++) hash = ((hash << 5) - hash) + p.id.charCodeAt(i) | 0;
  const seed = base + Math.abs(hash % 10);
  return `https://picsum.photos/seed/${seed}/600/750`;
}

export default function ProductCard({ product }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const img = getImageUrl(product);

  return (
    <div onClick={() => navigate(`/product/${product.id}`)}
      className="group cursor-pointer overflow-hidden border border-base-200 dark:border-base-800 rounded-xl bg-white dark:bg-base-950 hover:border-base-300 dark:hover:border-base-700 transition-colors">
      <div className="h-56 relative overflow-hidden bg-base-100 dark:bg-base-900">
        <img src={img} alt={product.name} loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
        {product.totalStock <= 10 && product.totalStock > 0 && (
          <div className="absolute top-3 left-3 bg-base-900 dark:bg-white text-white dark:text-base-900 text-[10px] font-semibold px-2 py-1 rounded uppercase tracking-wide">{t('productCard__lastUnits')}</div>
        )}
      </div>
      <div className="p-4">
        <p className="text-[11px] text-base-400 font-medium uppercase tracking-wider">{product.brand || 'UrbanStyle'}</p>
        <h3 className="font-medium text-base-900 dark:text-white mt-1 text-sm leading-snug">{product.name}</h3>
        <div className="flex items-center justify-between mt-3">
          <span className="text-base font-semibold text-base-900 dark:text-white">${product.price.toFixed(2)}</span>
          <button onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
            className="flex items-center gap-1 bg-base-900 dark:bg-white text-white dark:text-base-900 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-base-700 dark:hover:bg-base-200 transition-colors">
            <ShoppingCart size={13} /> {t('product__buy')}
          </button>
        </div>
      </div>
    </div>
  );
}
