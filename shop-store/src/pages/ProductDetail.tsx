import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Minus, Plus, Star, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

const colorMap: Record<string, string> = {
  Negro: '#1a1a1a', Blanco: '#f5f5f5', Azul: '#3b82f6', 'Azul Marino': '#1e3a5f',
  Rojo: '#ef4444', Gris: '#9ca3af', 'Gris Melange': '#b0b0b0', 'Verde Olivo': '#556b2f',
  Beige: '#d4c5a9', Café: '#8b4513', Verde: '#22c55e', 'Estampado Floral': '#ec4899', 'Negro/Blanco': '#333',
};

export default function ProductDetail() {
  const { id } = useParams(); const navigate = useNavigate(); const { addItem } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState(''); const [quantity, setQuantity] = useState(1);

  useEffect(() => { if (id) productsApi.getById(id).then(r => setProduct(r.data.data)).catch(() => navigate('/')); }, [id]);
  if (!product) return <div className="max-w-7xl mx-auto px-4 py-20 text-center dark:text-white">Cargando...</div>;

  const addToCart = () => {
    if (!selectedSize) { toast.error('Selecciona una talla'); return; }
    const sizeStock = product.sizes?.find((s: any) => s.size === selectedSize);
    if (sizeStock && quantity > sizeStock.stock) { toast.error('Stock insuficiente'); return; }
    addItem({ productId: product.id, name: product.name, price: product.price, size: selectedSize, quantity }); toast.success('¡Agregado!'); setQuantity(1);
  };

  const bgColor = product.color ? (colorMap[product.color] || '#e5e7eb') : '#e5e7eb';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="rounded-3xl h-96 md:h-[500px] flex items-center justify-center" style={{ backgroundColor: bgColor + '15' }}>
          <div className="w-48 h-48 rounded-full" style={{ backgroundColor: bgColor, opacity: 0.3 }} />
        </div>
        <div>
          <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wide">{product.brand || 'UrbanStyle'}</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{product.name}</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mt-4">{product.description}</p>
          <div className="flex items-center gap-2 mt-4">
            {[...Array(4)].map((_, i) => <Star key={i} size={18} className="text-amber-400 fill-amber-400" />)}
            <Star size={18} className="text-gray-300 dark:text-gray-600" /><span className="text-sm text-gray-400 ml-1">4.0 (128 reseñas)</span>
          </div>
          <div className="mt-6 flex items-baseline gap-3"><span className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">${product.price.toFixed(2)}</span><span className="text-lg text-gray-400 line-through">${(product.price * 1.3).toFixed(2)}</span></div>
          <div className="mt-8"><p className="font-semibold text-gray-900 dark:text-white mb-3">Talla: {selectedSize || 'Selecciona'}</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes?.map((s: any) => (
                <button key={s.size} disabled={s.stock === 0} onClick={() => setSelectedSize(s.size)} className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${selectedSize === s.size ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'} ${s.stock === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}>{s.size} {s.stock <= 5 && s.stock > 0 && `(${s.stock})`}</button>
              ))}
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4"><p className="font-semibold text-gray-900 dark:text-white">Cantidad:</p>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><Minus size={16} /></button>
              <span className="w-10 text-center font-semibold dark:text-white">{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(99, q + 1))} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><Plus size={16} /></button>
            </div>
          </div>
          <button onClick={addToCart} className="mt-8 w-full bg-indigo-600 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"><ShoppingCart size={20} /> Agregar al Carrito — ${(product.price * quantity).toFixed(2)}</button>
          <div className="mt-6 flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400"><span className="flex items-center gap-1"><Truck size={16} /> Envío gratis +$999</span><span>SKU: {product.sku}</span><span className="capitalize">{product.material}</span></div>
        </div>
      </div>
    </div>
  );
}
