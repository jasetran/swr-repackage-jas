import i18next from "i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from '../locales/en/translation.json'
import esTranslations from '../locales/es/translation.json'
import itTranslations from '../locales/it/translation.json'

export let islangaugeUndefined = false

i18next
    .use(LanguageDetector)
    .on('initialized', handleLanguageDetection)
    .init({
        // which langauage codes to use. Ex. if 'en-US' detected, will use 'en'
        load: 'languageOnly',
        fallbackLng: 'en',
        detection: {
            order: ['querystring', 'navigator'],
        },
        resources: {
            en: {
                translation: enTranslations
            },
            es: {
                translation: esTranslations
            },
            it: {
                translation: itTranslations
            }
        }
    })


function handleLanguageDetection() {
    if (!i18next.language) islangaugeUndefined = true
}