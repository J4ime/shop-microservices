import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, Package, Tags, Users, ShoppingBag, LogOut, ChevronRight, Sun, Moon } from 'lucide-react';

const menu = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/products', icon: Package, label: 'Productos' },
  { path: '/categories', icon: Tags, label: 'Categorías' },
  { path: '/customers', icon: Users, label: 'Clientes' },
  { path: '/orders', icon: ShoppingBag, label: 'Pedidos' },
];

export default function Layout() {
  const { logout } = useAuth();
  const { theme, toggle } = useTheme();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
      <aside className="w-64 bg-gray-900 dark:bg-black text-white flex flex-col transition-colors">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center"><span className="font-bold text-lg">U</span></div>
            <div><h1 className="font-bold text-lg">UrbanStyle</h1><p className="text-xs text-gray-400">Backoffice</p></div>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {menu.map(item => {
            const active = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <item.icon size={18} /> {item.label} {active && <ChevronRight size={16} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-800 space-y-1">
          <button onClick={toggle} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors w-full px-4 py-2">
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />} {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
          </button>
          <button onClick={logout} className="flex items-center gap-2 text-gray-400 hover:text-red-400 text-sm font-medium transition-colors w-full px-4 py-2">
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-8"><Outlet /></div>
      </main>
    </div>
  );
}
