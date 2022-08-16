import jsPsychAudioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";
import store from "store2";
import { audioContent, imgContent } from "./preload";
import { config } from "./config";

const audio_response_correct = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.coin,
  choices: "NO_KEYS",
  trial_ends_after_audio: true,
  prompt: `<div class = stimulus_div><p class = 'stimulus'><br></p></div> 
              <img class="lower" src="${imgContent.arrowkeyLex}" alt="arrow keys">`,
};

const if_audio_response_correct = {
  timeline: [audio_response_correct],
  conditional_function: () => (config.audioFeedback === "binary" && store.session("currentTrialCorrect")),
};

const audio_response_wrong = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.fail,
  choices: "NO_KEYS",
  trial_ends_after_audio: true,
  prompt: `<div class = stimulus_div><p class = 'stimulus'><br></p></div> 
              <img class="lower" src="${imgContent.arrowkeyLex}" alt="arrow keys">`,
};

const if_audio_response_wrong = {
  timeline: [audio_response_wrong],
  conditional_function: () => (config.audioFeedback === "binary" && !store.session("currentTrialCorrect")),
};

const audio_response_neutral = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.select,
  choices: "NO_KEYS",
  trial_ends_after_audio: true,
  prompt: `<div class = stimulus_div><p class = 'stimulus'><br></p></div> 
              <img class="lower" src="${imgContent.arrowkeyLex}" alt="arrow keys">`,
};

const if_audio_response_neutral = {
  timeline: [audio_response_neutral],
  conditional_function: () => config.audioFeedback === "neutral",
};

export { if_audio_response_correct, if_audio_response_wrong, if_audio_response_neutral };
