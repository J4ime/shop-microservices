import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../i18n';
import { LayoutDashboard, Package, Tags, Users, ShoppingBag, LogOut, Sun, Moon, Globe } from 'lucide-react';

const flags: Record<string, string> = { es: '🇪🇸', en: '🇬🇧', pt: '🇧🇷', fr: '🇫🇷' };

export default function Layout() {
  const { logout } = useAuth();
  const { theme, toggle } = useTheme();
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const menu = [
    { path: '/', icon: LayoutDashboard, label: t('dashboard') },
    { path: '/products', icon: Package, label: t('products') },
    { path: '/categories', icon: Tags, label: t('categories') },
    { path: '/customers', icon: Users, label: t('customers') },
    { path: '/orders', icon: ShoppingBag, label: t('orders') },
  ];

  return (
    <div className="flex h-screen bg-base-50 dark:bg-base-950">
      <aside className="w-56 bg-white dark:bg-base-950 border-r border-base-200 dark:border-base-800 flex flex-col transition-colors">
        <div className="p-5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-tight text-base-900 dark:text-white">UrbanStyle</span>
            <span className="text-[10px] text-base-400 uppercase tracking-wider">{t('backoffice')}</span>
          </div>
        </div>
        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {menu.map(item => {
            const active = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link key={item.path} to={item.path} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${active ? 'bg-base-900 dark:bg-white text-white dark:text-base-900 font-medium' : 'text-base-500 hover:text-base-900 dark:text-base-400 dark:hover:text-white'}`}>
                <item.icon size={16} /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-base-200 dark:border-base-800 space-y-0.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5">
            <Globe size={13} className="text-base-400" />
            {Object.entries(flags).map(([code, flag]) => (
              <button key={code} onClick={() => i18n.changeLanguage(code)} className={`text-[11px] px-1.5 py-0.5 rounded ${i18n.language === code ? 'bg-base-900 dark:bg-white text-white dark:text-base-900 font-medium' : 'text-base-400 hover:text-base-900 dark:hover:text-white'}`}>{flag}</button>
            ))}
          </div>
          <button onClick={toggle} className="flex items-center gap-2 text-base-500 hover:text-base-900 dark:text-base-400 dark:hover:text-white text-sm w-full px-3 py-2 rounded-lg hover:bg-base-50 dark:hover:bg-base-900 transition-colors">
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />} {theme === 'light' ? t('darkMode') : t('lightMode')}
          </button>
          <button onClick={logout} className="flex items-center gap-2 text-base-500 hover:text-red-500 text-sm w-full px-3 py-2 rounded-lg hover:bg-base-50 dark:hover:bg-base-900 transition-colors">
            <LogOut size={15} /> {t('logout')}
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
