import { useTranslation } from 'react-i18next';

const LANGUAGES = [
    { code: 'es', label: 'ES', flag: '🇪🇸' },
    { code: 'pt-BR', label: 'PT', flag: '🇧🇷' },
    { code: 'fr', label: 'FR', flag: '🇫🇷' },
];

export default function LanguageSelector() {
    const { i18n } = useTranslation();

    const changeLanguage = (code) => {
        i18n.changeLanguage(code);
        localStorage.setItem('i18nextLng', code);
        localStorage.setItem('lang-user-chosen', '1');
    };

    const currentLang = i18n.language;

    return (
        <div className="flex items-center gap-1">
            {LANGUAGES.map(({ code, label, flag }) => (
                <button
                    key={code}
                    onClick={() => changeLanguage(code)}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
                        currentLang === code || currentLang?.startsWith(code)
                            ? 'bg-[#8b7355] text-white shadow-sm'
                            : 'text-[#a89584] hover:text-[#8b7355]'
                    }`}
                    title={label}
                >
                    {flag} {label}
                </button>
            ))}
        </div>
    );
}
