import i18next from "i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from '../locales/en/translation.json'
import esTranslations from '../locales/es/translation.json'
import itTranslations from '../locales/it/translation.json'
import enDataPracticeURL from '../wordlist/en/ldt-items-practice.csv'
import enDataValidatedURL from '../wordlist/en/item_bank_new.csv'
import enDataNewURL from '../wordlist/en/ldt-new-items-v2.csv'


const languageDetector = new LanguageDetector();

languageDetector.addDetector({
  name: 'defaultToEnglish',
  lookup(options) {
    return 'en';
  },
});

// To change the language with a querystring, append "?lng=LANGUAGE" to the the URL
    // LANGUAGE here refers to the the language code
    // Ex. For Spanish: https://roar-swr-demo.web.app/?lng=es
    // With multiple querystrings: https://roar-swr-demo.web.app/?mode=demo&lng=es

i18next
    .use(LanguageDetector)
    // .on('initialized', handleLanguageDetection)
    .init({
        debug: false,
        // which langauage codes to use. Ex. if 'en-US' detected, will use 'en'
        load: 'languageOnly',
        fallbackLng: 'en',
        detection: {
            order: ['defaultToEnglish', 'querystring',],
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


export const wordlist = {
    en: {
        dataPracticeURL: enDataPracticeURL,
        dataValidatedURL: enDataValidatedURL,
        dataNewURL: enDataNewURL
    }, 
    es: {
        dataPracticeURL: '',
        dataValidatedURL: '',
        dataNewURL: ''
    }, 
    it: {
        dataPracticeURL: '',
        dataValidatedURL: '',
        dataNewURL: ''
    }, 
}


// FOR LANGUAGE SELECT TRIAL    

// export let islangaugeUndefined = false

// function handleLanguageDetection() {
//     if (!i18next.language) islangaugeUndefined = true
// }