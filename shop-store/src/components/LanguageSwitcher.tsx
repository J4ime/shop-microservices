import { useTranslation } from '../i18n';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const flags: Record<string, string> = { es: '🇪🇸', en: '🇬🇧', pt: '🇧🇷', fr: '🇫🇷' };
const names: Record<string, string> = { es: 'ES', en: 'EN', pt: 'PT', fr: 'FR' };

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1 text-base-500 hover:text-base-900 dark:text-base-400 dark:hover:text-white transition-colors text-sm">
        <Globe size={15} />
        <span>{names[i18n.language] || 'ES'}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white dark:bg-base-950 rounded-lg shadow-lg border border-base-200 dark:border-base-800 py-1 w-36 z-50">
          {Object.entries(flags).map(([code, flag]) => (
            <button key={code} onClick={() => { i18n.changeLanguage(code); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-base-50 dark:hover:bg-base-900 flex items-center gap-2 transition-colors ${i18n.language === code ? 'text-base-900 dark:text-white font-medium' : 'text-base-500 dark:text-base-400'}`}>
              <span>{flag}</span> {names[code]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
