import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span className="text-xl font-bold text-gray-900">UrbanStyle</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Tienda</Link>

            {isAuthenticated ? (
              <>
                <Link to="/orders" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1">
                  <Package size={16} /> Mis Pedidos
                </Link>
                <span className="text-sm text-gray-400">Hola, {user?.firstName}</span>
                <button onClick={logout} className="text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1">
                  <LogOut size={16} /> Salir
                </button>
              </>
            ) : (
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1">
                <User size={16} /> Iniciar Sesión
              </Link>
            )}

            <button onClick={() => navigate('/cart')} className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
