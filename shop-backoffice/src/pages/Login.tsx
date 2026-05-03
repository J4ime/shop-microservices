import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('admin@shop.com');
  const [password, setPassword] = useState('Test1234!');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try { await login(email, password); toast.success(t('login__welcome')); navigate('/'); }
    catch (err: any) { toast.error(t('login__invalidCreds')); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">U</span>
          </div>
          <h1 className="text-2xl font-bold text-white">{t('login__title')}</h1>
          <p className="text-gray-400 mt-1">{t('login__subtitle')}</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="relative"><Mail size={18} className="absolute left-3 top-3.5 text-gray-500" />
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-500" placeholder={t('login__email')} />
          </div>
          <div className="relative"><Lock size={18} className="absolute left-3 top-3.5 text-gray-500" />
            <input type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder={t('login__password')} />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3.5 text-gray-500">{showPw ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all">
            {loading ? t('login__signingIn') : t('login__signIn')}
          </button>
        </form>
        <p className="text-center text-xs text-gray-500 mt-4">admin@shop.com / Test1234!</p>
      </div>
    </div>
  );
}
