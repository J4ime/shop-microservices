import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const flags: Record<string, string> = { es: '🇪🇸', en: '🇬🇧', pt: '🇧🇷', fr: '🇫🇷' };
const names: Record<string, string> = { es: 'ES', en: 'EN', pt: 'PT', fr: 'FR' };

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="relative group">
      <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm font-medium">
        <Globe size={16} />
        <span>{names[i18n.language] || 'ES'}</span>
      </button>
      <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 w-36 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {Object.entries(flags).map(([code, flag]) => (
          <button key={code} onClick={() => i18n.changeLanguage(code)}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 ${i18n.language === code ? 'text-indigo-600 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>
            <span>{flag}</span> {names[code]}
          </button>
        ))}
      </div>
    </div>
  );
}
