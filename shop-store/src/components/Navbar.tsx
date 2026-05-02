import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">UrbanStyle</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">{t('nav.store')}</Link>

            {isAuthenticated ? (
              <>
                <Link to="/orders" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1">
                  <Package size={16} /> {t('nav.orders')}
                </Link>
                <span className="text-sm text-gray-400 dark:text-gray-500 hidden sm:inline">{t('nav.hello')}, {user?.firstName}</span>
                <button onClick={logout} className="text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1">
                  <LogOut size={16} /> {t('nav.logout')}
                </button>
              </>
            ) : (
              <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1">
                <User size={16} /> {t('nav.login')}
              </Link>
            )}

            <LanguageSwitcher />

            <button onClick={toggle} className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}>
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button onClick={() => navigate('/cart')} className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
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
