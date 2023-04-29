import jsPsychPreload from "@jspsych/plugin-preload";

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

const importAll = (r) => r.keys().map(r);

const transformAudio = (array) => {
  const list = [];
  function addList(item) {
    list.push(item.default);
  }
  array.forEach(addList);
  return list;
};

const audiosGameFlow = transformAudio(importAll(require.context('./audios/shared_audios', false, /\.(wav|mp3)$/)));
const audiosKeyboardOnly = transformAudio(importAll(require.context('./audios/eng_keyboard', false, /\.(wav|mp3)$/)));
const audiosTabletOnly = transformAudio(importAll(require.context('./audios/eng_tablet', false, /\.(wav|mp3)$/)));

const images = importAll(require.context('./assets', false, /\.(png|jpe?g|svg|gif)$/));

const audioBlocks = {
  1: audiosGameFlow,
  2: audiosKeyboardOnly,
  3: audiosTabletOnly,
};

export const audioContent = preloadObj2contentObj(audioBlocks);

const preload_audio_trials = Object.entries(audioBlocks).map((element) => {
  const idx = element[0];
  const audio_block = element[1];
  return {
    type: jsPsychPreload,
    audio: audio_block,
    auto_preload: false,
    message: `${idx} Please wait while the experiment loads. This may take a few minutes.`,
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
    message: `${idx} Please wait while the experiment loads. This may take a few minutes.`,
    show_progress_bar: true,
    show_detailed_errors: true,
  };
});

export const preload_trials = [...preload_audio_trials, ...preload_img_trials];
