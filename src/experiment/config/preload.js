import jsPsychPreload from "@jspsych/plugin-preload";
import { deviceType, primaryInput } from 'detect-it';
import i18next from "i18next";
import '../i18n'
import { keyboardPaths, sharedPaths, tabletPaths } from "./audioFileList.js";

export const camelCase = (str) => str.replace(/_([a-z])/g, (match, letter) => {
  return letter.toUpperCase();
}).replace(/_/g, '');


export const preloadObj2contentObj = (preloadObj) => {
  const contentArray = [].concat(...Object.values(preloadObj));
  const reducedContent = contentArray.reduce((o, val) => {
    const pathSplit = val.split("/");
    const fileName = pathSplit[pathSplit.length - 1];
    const key = fileName.split(".")[0];
    // eslint-disable-next-line no-param-reassign
    o[camelCase(key)] = val;
    return o;
  }, {});

  return reducedContent
};

export let isTouchScreen = false;
export let audioContent
export let preload_audio_trials = []

const lng = i18next.language

// Dynamic import

if (lng) {

  if (deviceType === 'touchOnly' || ('hybrid' && primaryInput === 'touch')) {
    isTouchScreen = true
  }

  async function preloadFunc() {
    const audioDirectories = ['shared/', isTouchScreen ? `${lng}/tablet/` : `${lng}/keyboard/`]
    const audioPaths = [sharedPaths, isTouchScreen ? tabletPaths : keyboardPaths]

    const sharedAudio = []
    const deviceAudio = []

    const promises = audioPaths.flatMap((files, i) => {
        return files.map(async (file) => {
          const module = await import(`../../audio/${audioDirectories[i]}${file}`);
      
          if (i === 0) {
            sharedAudio.push(module.default);
          } else {
            deviceAudio.push(module.default)
          }
        });
    });
    
    await Promise.all(promises);

    const audioBlock = {
        1: sharedAudio,
        2: deviceAudio
    };

    audioContent = preloadObj2contentObj(audioBlock)

    preload_audio_trials = Object.entries(audioBlock).map((element) => {
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
  }

  preloadFunc()
}

// Static import

const importAll = (r) => r.keys().map(r);

const images = importAll(require.context('../../assets', false, /\.(png|jpe?g|svg|gif)$/));

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


export const preload_image_trials = [ ...preload_img_trials];