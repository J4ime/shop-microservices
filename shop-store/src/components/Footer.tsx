import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span className="text-lg font-bold text-white">UrbanStyle</span>
          </div>
          <p className="text-sm text-gray-400">Tu tienda de ropa favorita. Estilo, calidad y tendencias en un solo lugar.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Enlaces</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">Tienda</Link></li>
            <li><Link to="/login" className="hover:text-white transition-colors">Mi Cuenta</Link></li>
            <li><Link to="/cart" className="hover:text-white transition-colors">Carrito</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Contacto</h4>
          <ul className="space-y-2 text-sm">
            <li>contacto@urbanstyle.com</li>
            <li>+52 55 1234 5678</li>
            <li>CDMX, México</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
        © 2026 UrbanStyle. Todos los derechos reservados.
      </div>
    </footer>
  );
}
