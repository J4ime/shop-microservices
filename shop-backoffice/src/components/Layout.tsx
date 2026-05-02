import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Package, Tags, Users, ShoppingBag, LogOut, ChevronRight, Sun, Moon, Globe } from 'lucide-react';

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
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
      <aside className="w-64 bg-gray-900 dark:bg-black text-white flex flex-col transition-colors">
        <div className="p-6"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center"><span className="font-bold text-lg">U</span></div><div><h1 className="font-bold text-lg">UrbanStyle</h1><p className="text-xs text-gray-400">{t('backoffice')}</p></div></div></div>
        <nav className="flex-1 px-4 py-4 space-y-1">{menu.map(item => {const active = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));return (<Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><item.icon size={18} /> {item.label} {active && <ChevronRight size={16} className="ml-auto" />}</Link>);})}</nav>
        <div className="p-4 border-t border-gray-800 space-y-1">
          <div className="flex items-center gap-2 px-4 py-1">
            <Globe size={14} className="text-gray-400" />
            {Object.entries(flags).map(([code, flag]) => (
              <button key={code} onClick={() => i18n.changeLanguage(code)} className={`text-xs px-1.5 py-0.5 rounded ${i18n.language === code ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}>{flag}</button>
            ))}
          </div>
          <button onClick={toggle} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors w-full px-4 py-2">{theme === 'light' ? <Moon size={16} /> : <Sun size={16} />} {theme === 'light' ? t('darkMode') : t('lightMode')}</button>
          <button onClick={logout} className="flex items-center gap-2 text-gray-400 hover:text-red-400 text-sm font-medium transition-colors w-full px-4 py-2"><LogOut size={16} /> {t('logout')}</button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto"><div className="p-8"><Outlet /></div></main>
    </div>
  );
}
