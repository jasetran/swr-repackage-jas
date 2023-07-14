/* eslint-disable import/prefer-default-export */
import { log } from './logger';
import store from 'store2'
// import { labId } from './config';

// let configValues = configStore.getConfig();

// console.log('store: ', store.get('config'))
// console.log('configStore: ', configValues)

const setLabId = store.session.get('config')?.labId || 'yeatmanlab';

const prodDoc = setLabId === 'yeatmanlab' ? ['prod', 'roar-prod'] : ['external', setLabId];
// eslint-disable-next-line no-undef
const rootDoc = ROAR_DB === 'production' ? prodDoc : ['dev', 'anya-swr'];

/* eslint-disable import/prefer-default-export */
const devFirebaseConfig = {
  apiKey: 'AIzaSyCX9WR-j9yv1giYeFsMpbjj2G3p7jNHxIU',
  authDomain: 'gse-yeatmanlab.firebaseapp.com',
  projectId: 'gse-yeatmanlab',
  storageBucket: 'gse-yeatmanlab.appspot.com',
  messagingSenderId: '292331000426',
  appId: '1:292331000426:web:91a04220991e3405737013',
  measurementId: 'G-0TBTMDS993',
};

const productionFirebaseConfig = {
  apiKey: "AIzaSyDw0TnTXbvRyoVo5_oa_muhXk9q7783k_g",
  authDomain: "gse-roar-assessment.firebaseapp.com",
  projectId: "gse-roar-assessment",
  storageBucket: "gse-roar-assessment.appspot.com",
  messagingSenderId: "757277423033",
  appId: "1:757277423033:web:d6e204ee2dd1047cb77268"
};

export const firebaseConfig = ROAR_DB === 'production' ? productionFirebaseConfig : devFirebaseConfig

export const roarConfig = {
  firebaseConfig,
  rootDoc,
}


// eslint-disable-next-line operator-linebreak
const logMessage =
  `This ROAR app will write data to the ${roarConfig.firebaseConfig.projectId} `
  + `Firestore database under the document ${rootDoc.join(' > ')}.`;
log.info(logMessage);
