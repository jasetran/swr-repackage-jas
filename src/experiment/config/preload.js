import jsPsychPreload from "@jspsych/plugin-preload";
import { deviceType, primaryInput } from 'detect-it';
import i18next from "i18next";
import '../i18n'

export let isTouchScreen = false;

export const camelCase = (str) => str.replace(/_([a-z])/g, (match, letter) => {
  return letter.toUpperCase();
}).replace(/_/g, '');

const preloadObj2contentObj = (preloadObj) => {
  const contentArray = [].concat(...Object.values(preloadObj));
  return contentArray.reduce((o, val) => {
    const pathSplit = val.split("/");
    const fileName = pathSplit[pathSplit.length - 1];
    const key = fileName.split(".")[0];
    // eslint-disable-next-line no-param-reassign
    o[camelCase(key)] = val;
    return o;
  }, {});
};

const transformAudio = (array) => {
  const list = [];
  function addList(item) {
    list.push(item.default);
  }
  array.forEach(addList);
  return list;
};

const importAll = (r) => r.keys().map(r);

// Conditionally operate on audio files: keyboard or tablet
const sharedAudio = transformAudio(importAll(require.context('../../audios/shared_audios', false, /\.(wav|mp3)$/)));
const keyboardAudio = transformAudio(importAll(require.context('../../audios/eng_keyboard', false, /\.(wav|mp3)$/)));
const tabletAudio = transformAudio(importAll(require.context('../../audios/eng_tablet', false, /\.(wav|mp3)$/)));

const images = importAll(require.context('../../assets', false, /\.(png|jpe?g|svg|gif)$/));

const audioBlocksKeyboard = {
  1: sharedAudio,
  2: keyboardAudio
};

const audioBlocksTablet = {
  1: sharedAudio,
  2: tabletAudio
};

const deviceAudio = () => {
  if (deviceType === 'touchOnly' || ('hybrid' && primaryInput === 'touch')) {
    isTouchScreen = true
    return audioBlocksTablet
  } else {
    return audioBlocksKeyboard
  }
}

export const audioContent = preloadObj2contentObj(deviceAudio());

const preload_audio_trials = Object.entries(deviceAudio()).map((element) => {
  const idx = element[0];
  const audio_block = element[1];
  return {
    type: jsPsychPreload,
    audio: audio_block,
    auto_preload: false,
    message: () => `${idx} ${i18next.t('preloadTrial.messageText')}`,
    show_progress_bar: true,
    show_detailed_errors: true,
  };
});

const imageBlocks = {
  4: images,
};

// Automatically populate the audioContent object with the audio files
export const imgContent = preloadObj2contentObj(imageBlocks);

const preload_img_trials = Object.entries(imageBlocks).map((element) => {
  const idx = element[0];
  const img_block = element[1];
  return {
    type: jsPsychPreload,
    images: img_block,
    auto_preload: false,
    message: () => `${idx} ${i18next.t('preloadTrial.messageText')}`,
    show_progress_bar: true,
    show_detailed_errors: true,
  };
});

export const preload_trials = [...preload_audio_trials, ...preload_img_trials];
