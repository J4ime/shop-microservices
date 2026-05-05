import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useTranslation } from '../i18n';
import { getProductImageUrl } from '../utils/images';
import { ShoppingCart, Minus, Plus, Truck, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { t } = useTranslation();
  const { id } = useParams(); const navigate = useNavigate(); const { addItem } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState(''); const [quantity, setQuantity] = useState(1);

  useEffect(() => { if (id) productsApi.getById(id).then(r => setProduct(r.data.data)).catch(() => navigate('/')); }, [id]);
  if (!product) return <div className="max-w-7xl mx-auto px-4 py-20 text-center dark:text-white text-base-500">{t('product__loading')}</div>;

  const addToCart = () => {
    if (!selectedSize) { toast.error(t('product__selectSizeError')); return; }
    const sizeStock = product.sizes?.find((s: any) => s.size === selectedSize);
    if (sizeStock && quantity > sizeStock.stock) { toast.error(t('product__stockError')); return; }
    addItem({ productId: product.id, name: product.name, price: product.price, size: selectedSize, quantity }); toast.success(t('product__added')); setQuantity(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-base-500 hover:text-base-900 dark:hover:text-white mb-8 transition-colors">
        <ArrowLeft size={16} /> {t('cart__keepBuying')}
      </button>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="rounded-xl overflow-hidden bg-base-100 dark:bg-base-900 aspect-[4/5]">
          <img src={getProductImageUrl(product, 800, 1000)} alt={product.name} referrerPolicy="no-referrer"
            className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
          <p className="text-xs text-base-400 font-medium uppercase tracking-wider">{product.brand || 'UrbanStyle'}</p>
          <h1 className="text-3xl font-semibold text-base-900 dark:text-white mt-2 tracking-tight">{product.name}</h1>
          <p className="text-base-500 dark:text-base-400 mt-4 leading-relaxed">{product.description}</p>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-base-900 dark:text-white">${product.price.toFixed(2)}</span>
            <span className="text-base-400 line-through">${(product.price * 1.3).toFixed(2)}</span>
          </div>
          <div className="mt-8">
            <p className="text-sm font-medium text-base-900 dark:text-white mb-3">{t('product__size')}: <span className="text-base-500 font-normal">{selectedSize || t('product__selectSize')}</span></p>
            <div className="flex flex-wrap gap-2">
              {product.sizes?.map((s: any) => (
                <button key={s.size} disabled={s.stock === 0} onClick={() => setSelectedSize(s.size)} className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-colors border ${selectedSize === s.size ? 'bg-base-900 dark:bg-white text-white dark:text-base-900 border-base-900 dark:border-white' : 'bg-white dark:bg-base-950 text-base-700 dark:text-base-300 border-base-200 dark:border-base-800 hover:border-base-400 dark:hover:border-base-600'} ${s.stock === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}>{s.size} {s.stock <= 5 && s.stock > 0 && `(${s.stock})`}</button>
              ))}
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <p className="text-sm font-medium text-base-900 dark:text-white">{t('product__quantity')}:</p>
            <div className="flex items-center gap-3 border border-base-200 dark:border-base-800 rounded-lg px-2 py-1">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-1 hover:bg-base-100 dark:hover:bg-base-900 rounded-md"><Minus size={14} /></button>
              <span className="w-8 text-center font-medium text-sm dark:text-white">{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(99, q + 1))} className="p-1 hover:bg-base-100 dark:hover:bg-base-900 rounded-md"><Plus size={14} /></button>
            </div>
          </div>
          <button onClick={addToCart} className="mt-8 w-full bg-base-900 dark:bg-white text-white dark:text-base-900 py-3.5 rounded-lg font-medium hover:bg-base-700 dark:hover:bg-base-200 transition-colors flex items-center justify-center gap-2">
            <ShoppingCart size={18} /> {t('product__addToCart')} — ${(product.price * quantity).toFixed(2)}
          </button>
          <div className="mt-6 flex items-center gap-6 text-xs text-base-400">
            <span className="flex items-center gap-1"><Truck size={14} /> {t('product__freeShipping')}</span>
            <span>SKU: {product.sku}</span>
            <span className="capitalize">{product.material}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
