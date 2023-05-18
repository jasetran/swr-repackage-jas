import i18next from "i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from '../locales/en/translation.json'


i18next
    .use(LanguageDetector)
    .init({
        debug: true,
        load: 'languageOnly',
        fallbackLng: 'en',
        resources: {
            en: {
                translation: enTranslations
            },
            es: {
                translation: ''
            },
            it: {
                translation: ''
            }
        }
    })