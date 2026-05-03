import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../i18n';
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { t } = useTranslation();
  const [isRegister, setIsRegister] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', phone: '' });
  const { login, register } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      if (isRegister) { await register(form); toast.success(t('login__accountCreated')); setIsRegister(false); }
      else { await login(form.email, form.password); toast.success(t('login__welcomeBack')); navigate('/'); }
    } catch (err: any) { toast.error(err.response?.data?.error?.message || t('login__authError')); }
    setLoading(false);
  };

  const inputClass = "w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500";
  const iconClass = "absolute left-3 top-3.5 text-gray-400 dark:text-gray-500";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-800">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">U</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{isRegister ? t('login__register') : t('login__title')}</h1>
            <p className="text-gray-400 dark:text-gray-500 mt-1">{isRegister ? t('login__registerTagline') : t('login__welcomeTagline')}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (<>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative"><User size={18} className={iconClass} /><input type="text" placeholder={t('login__firstName')} required value={form.firstName} onChange={e => setForm(s => ({ ...s, firstName: e.target.value }))} className={inputClass} /></div>
                <div className="relative"><User size={18} className={iconClass} /><input type="text" placeholder={t('login__lastName')} required value={form.lastName} onChange={e => setForm(s => ({ ...s, lastName: e.target.value }))} className={inputClass} /></div>
              </div>
              <div className="relative"><Phone size={18} className={iconClass} /><input type="tel" placeholder={t('login__phone')} value={form.phone} onChange={e => setForm(s => ({ ...s, phone: e.target.value }))} className={inputClass} /></div>
            </>)}
            <div className="relative"><Mail size={18} className={iconClass} /><input type="email" placeholder={t('login__email')} required value={form.email} onChange={e => setForm(s => ({ ...s, email: e.target.value }))} className={inputClass} /></div>
            <div className="relative">
              <Lock size={18} className={iconClass} />
              <input type={showPw ? 'text' : 'password'} placeholder={t('login__password')} required minLength={8} value={form.password} onChange={e => setForm(s => ({ ...s, password: e.target.value }))} className="w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3.5 text-gray-400">{showPw ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200">
              {loading ? t('login__processing') : isRegister ? t('login__register') : t('login__title')}
            </button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-6">
            {isRegister ? t('login__alreadyAccount') : t('login__noAccount')}
            <button onClick={() => setIsRegister(!isRegister)} className="text-indigo-600 font-semibold ml-1 hover:underline">{isRegister ? t('login__switchToLogin') : t('login__signUp')}</button>
          </p>
        </div>
      </div>
    </div>
  );
}
