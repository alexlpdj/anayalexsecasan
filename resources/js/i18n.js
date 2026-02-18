import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import es from './locales/es.json';
import ptBR from './locales/pt-BR.json';
import fr from './locales/fr.json';

i18n.use(initReactI18next).init({
    resources: {
        es: { translation: es },
        'pt-BR': { translation: ptBR },
        fr: { translation: fr },
    },
    lng: (typeof localStorage !== 'undefined' && localStorage.getItem('i18nextLng')) || 'es',
    fallbackLng: 'es',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
