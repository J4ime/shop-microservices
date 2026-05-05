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
    <div className="min-h-screen flex items-center justify-center bg-base-50 dark:bg-base-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-semibold text-base-900 dark:text-white tracking-tight">{t('login__title')}</h1>
          <p className="text-base-500 dark:text-base-400 mt-2 text-sm">{t('login__subtitle')}</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-base-950 border border-base-200 dark:border-base-800 rounded-xl p-6 space-y-4">
          <div className="relative"><Mail size={16} className="absolute left-3 top-3.5 text-base-400" />
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-transparent border border-base-200 dark:border-base-800 rounded-lg text-base-900 dark:text-white text-sm focus:border-base-400 outline-none transition-colors placeholder-base-400" placeholder={t('login__email')} />
          </div>
          <div className="relative"><Lock size={16} className="absolute left-3 top-3.5 text-base-400" />
            <input type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-transparent border border-base-200 dark:border-base-800 rounded-lg text-base-900 dark:text-white text-sm focus:border-base-400 outline-none transition-colors" placeholder={t('login__password')} />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3.5 text-base-400">{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-base-900 dark:bg-white text-white dark:text-base-900 py-3 rounded-lg font-medium hover:bg-base-700 dark:hover:bg-base-200 disabled:opacity-50 transition-colors">
            {loading ? t('login__signingIn') : t('login__signIn')}
          </button>
        </form>
        <p className="text-center text-xs text-base-400 mt-4">admin@shop.com / Test1234!</p>
      </div>
    </div>
  );
}
