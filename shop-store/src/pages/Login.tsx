import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', phone: '' });
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await register(form);
        toast.success('¡Cuenta creada!');
        setIsRegister(false);
      } else {
        await login(form.email, form.password);
        toast.success('¡Bienvenido!');
        navigate('/');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Error de autenticación');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">U</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}</h1>
            <p className="text-gray-400 mt-1">{isRegister ? 'Únete a UrbanStyle' : 'Bienvenido de vuelta'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative"><User size={18} className="absolute left-3 top-3.5 text-gray-400" />
                    <input type="text" placeholder="Nombre" required value={form.firstName}
                      onChange={e => setForm(s => ({ ...s, firstName: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div className="relative"><User size={18} className="absolute left-3 top-3.5 text-gray-400" />
                    <input type="text" placeholder="Apellido" required value={form.lastName}
                      onChange={e => setForm(s => ({ ...s, lastName: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                </div>
                <div className="relative"><Phone size={18} className="absolute left-3 top-3.5 text-gray-400" />
                  <input type="tel" placeholder="Teléfono" value={form.phone}
                    onChange={e => setForm(s => ({ ...s, phone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </>
            )}
            <div className="relative"><Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input type="email" placeholder="Correo electrónico" required value={form.email}
                onChange={e => setForm(s => ({ ...s, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input type={showPw ? 'text' : 'password'} placeholder="Contraseña" required minLength={8} value={form.password}
                onChange={e => setForm(s => ({ ...s, password: e.target.value }))}
                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3.5 text-gray-400">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200">
              {loading ? 'Procesando...' : isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
            <button onClick={() => setIsRegister(!isRegister)} className="text-indigo-600 font-semibold ml-1 hover:underline">
              {isRegister ? 'Inicia sesión' : 'Regístrate'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
