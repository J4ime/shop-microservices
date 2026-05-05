import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-base-200 dark:border-base-800 bg-white dark:bg-base-950 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-tight text-base-900 dark:text-white">UrbanStyle</span>
            <span className="text-xs text-base-400">{t('footer__desc')}</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-base-500">
            <Link to="/" className="hover:text-base-900 dark:hover:text-white transition-colors">{t('footer__store')}</Link>
            <Link to="/login" className="hover:text-base-900 dark:hover:text-white transition-colors">{t('footer__account')}</Link>
            <Link to="/cart" className="hover:text-base-900 dark:hover:text-white transition-colors">{t('footer__cart')}</Link>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-base-100 dark:border-base-900 text-center text-xs text-base-400">
          {t('footer__rights')}
        </div>
      </div>
    </footer>
  );
}
