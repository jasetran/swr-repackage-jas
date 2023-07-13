/* eslint-disable import/prefer-default-export */
import { log } from './logger';
import store from 'store2'
import configStore from '../configStore';
// import { labId } from './config';

let configValues = configStore.getConfig();

// console.log('store: ', store.get('config'))
// console.log('configStore: ', configValues)

const setLabId = store.get('config')?.labId || 'yeatmanlab';

const prodDoc = setLabId === 'yeatmanlab' ? ['prod', 'roar-prod'] : ['external', setLabId];
// eslint-disable-next-line no-undef
const rootDoc = ROAR_DB_DOC === 'production' ? prodDoc : ['dev', 'anya-swr'];

/* eslint-disable import/prefer-default-export */
export const roarConfig = {
  firebaseConfig: {
    apiKey: 'AIzaSyCX9WR-j9yv1giYeFsMpbjj2G3p7jNHxIU',
    authDomain: 'gse-yeatmanlab.firebaseapp.com',
    projectId: 'gse-yeatmanlab',
    storageBucket: 'gse-yeatmanlab.appspot.com',
    messagingSenderId: '292331000426',
    appId: '1:292331000426:web:91a04220991e3405737013',
    measurementId: 'G-0TBTMDS993',
  },
  rootDoc: rootDoc,
};

// eslint-disable-next-line operator-linebreak
const logMessage =
  `This ROAR app will write data to the ${roarConfig.firebaseConfig.projectId} `
  + `Firestore database under the document ${rootDoc.join(' > ')}.`;
log.info(logMessage);
