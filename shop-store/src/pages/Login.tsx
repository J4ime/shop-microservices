import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      if (isRegister) { await register(form); toast.success(t('login__accountCreated')); setIsRegister(false); }
      else { await login(form.email, form.password); toast.success(t('login__welcomeBack')); navigate('/'); }
    } catch (err: any) { toast.error(err.response?.data?.error?.message || t('login__authError')); }
    setLoading(false);
  };

  const inputClass = "w-full pl-10 pr-4 py-3 border border-base-200 dark:border-base-800 rounded-lg text-sm outline-none bg-white dark:bg-base-950 text-base-900 dark:text-white focus:border-base-400 transition-colors";
  const iconClass = "absolute left-3 top-3.5 text-base-400";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-semibold text-base-900 dark:text-white tracking-tight">{isRegister ? t('login__register') : t('login__title')}</h1>
          <p className="text-base-500 dark:text-base-400 mt-2 text-sm">{isRegister ? t('login__registerTagline') : t('login__welcomeTagline')}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          {isRegister && (<>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative"><User size={16} className={iconClass} /><input type="text" placeholder={t('login__firstName')} required value={form.firstName} onChange={e => setForm(s => ({ ...s, firstName: e.target.value }))} className={inputClass} /></div>
              <div className="relative"><User size={16} className={iconClass} /><input type="text" placeholder={t('login__lastName')} required value={form.lastName} onChange={e => setForm(s => ({ ...s, lastName: e.target.value }))} className={inputClass} /></div>
            </div>
            <div className="relative"><Phone size={16} className={iconClass} /><input type="tel" placeholder={t('login__phone')} value={form.phone} onChange={e => setForm(s => ({ ...s, phone: e.target.value }))} className={inputClass} /></div>
          </>)}
          <div className="relative"><Mail size={16} className={iconClass} /><input type="email" placeholder={t('login__email')} required value={form.email} onChange={e => setForm(s => ({ ...s, email: e.target.value }))} className={inputClass} /></div>
          <div className="relative">
            <Lock size={16} className={iconClass} />
            <input type={showPw ? 'text' : 'password'} placeholder={t('login__password')} required minLength={8} value={form.password} onChange={e => setForm(s => ({ ...s, password: e.target.value }))} className="w-full pl-10 pr-10 py-3 border border-base-200 dark:border-base-800 rounded-lg text-sm outline-none bg-white dark:bg-base-950 text-base-900 dark:text-white focus:border-base-400 transition-colors" />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3.5 text-base-400">{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-base-900 dark:bg-white text-white dark:text-base-900 py-3 rounded-lg font-medium hover:bg-base-700 dark:hover:bg-base-200 disabled:opacity-50 transition-colors mt-2">
            {loading ? t('login__processing') : isRegister ? t('login__register') : t('login__title')}
          </button>
        </form>
        <p className="text-center text-sm text-base-400 mt-6">
          {isRegister ? t('login__alreadyAccount') : t('login__noAccount')}
          <button onClick={() => setIsRegister(!isRegister)} className="text-base-900 dark:text-white font-medium ml-1 hover:underline">{isRegister ? t('login__switchToLogin') : t('login__signUp')}</button>
        </p>
      </div>
    </div>
  );
}
