import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, Sun, Moon, Menu, X } from 'lucide-react';
import { useTranslation } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useState } from 'react';

export default function Navbar() {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-base-950/80 backdrop-blur-md border-b border-base-200 dark:border-base-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tight text-base-900 dark:text-white">UrbanStyle</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm text-base-500 hover:text-base-900 dark:text-base-400 dark:hover:text-white transition-colors">{t('nav__store')}</Link>

            {isAuthenticated ? (
              <>
                <Link to="/orders" className="text-sm text-base-500 hover:text-base-900 dark:text-base-400 dark:hover:text-white transition-colors flex items-center gap-1.5">
                  <Package size={15} /> {t('nav__orders')}
                </Link>
                <span className="text-sm text-base-400 hidden sm:inline">{user?.firstName}</span>
                <button onClick={logout} className="text-sm text-base-400 hover:text-red-500 transition-colors flex items-center gap-1">
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              <Link to="/login" className="text-sm text-base-500 hover:text-base-900 dark:text-base-400 dark:hover:text-white transition-colors flex items-center gap-1">
                <User size={15} /> {t('nav__login')}
              </Link>
            )}

            <LanguageSwitcher />

            <button onClick={toggle} className="p-1.5 text-base-400 hover:text-base-900 dark:hover:text-white transition-colors" title={theme === 'light' ? t('navbar__darkMode') : t('navbar__lightMode')}>
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            <button onClick={() => navigate('/cart')} className="relative p-1.5 text-base-600 dark:text-base-300 hover:text-base-900 dark:hover:text-white transition-colors">
              <ShoppingCart size={18} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-base-900 dark:bg-white text-white dark:text-base-900 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          <button className="md:hidden p-1.5 text-base-600" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-base-200 dark:border-base-800 bg-white dark:bg-base-950 px-4 py-4 space-y-3">
          <Link to="/" onClick={() => setMobileOpen(false)} className="block text-sm text-base-600 dark:text-base-300">{t('nav__store')}</Link>
          {isAuthenticated ? (
            <>
              <Link to="/orders" onClick={() => setMobileOpen(false)} className="block text-sm text-base-600 dark:text-base-300">{t('nav__orders')}</Link>
              <button onClick={() => { logout(); setMobileOpen(false); }} className="block text-sm text-base-400 hover:text-red-500">{t('nav__logout')}</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-sm text-base-600 dark:text-base-300">{t('nav__login')}</Link>
          )}
        </div>
      )}
    </nav>
  );
}
