import i18next from "i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from '../locales/en/translation.json'
import esTranslations from '../locales/es/translation.json'

i18next
    .use(LanguageDetector)
    .on('initialized', () => console.log('i18 instance init'))
    .init({
        debug: true,
        load: 'languageOnly',
        fallbackLng: 'poop',
        detection: {
            order: ['querystring', 'navigator',],
        },
        resources: {
            en: {
                translation: enTranslations
            },
            es: {
                translation: esTranslations
            },
            it: {
                translation: ''
            }
        }
    })