import jsPsychAudioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";
import { audioContent } from "./preload";
import { initStore } from "./config";

const store = initStore();

const audio_response_correct = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.coinSound,
  choices: "NO_KEYS",
  trial_ends_after_audio: true,
  prompt: `<div class = stimulus_div><p class = 'stimulus' style="font-size:60px;"><br></p></div> 
              <img class="lower" src="assets/arrowkey_lex.png" alt="arrow keys" style=" width:698px; height:120px">`,
};

const if_audio_response_correct = {
  timeline: [audio_response_correct],
  conditional_function: () => store("currentTrialCorrect"),
};

const audio_response_wrong = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.failSound,
  choices: "NO_KEYS",
  trial_ends_after_audio: true,
  prompt: `<div class = stimulus_div><p class = 'stimulus' style="font-size:60px;"><br></p></div> 
              <img class="lower" src="assets/arrowkey_lex.png" alt="arrow keys" style=" width:698px; height:120px">`,
};

const if_audio_response_wrong = {
  timeline: [audio_response_wrong],
  conditional_function: () => !store("currentTrialCorrect"),
};

export { if_audio_response_correct, if_audio_response_wrong };
