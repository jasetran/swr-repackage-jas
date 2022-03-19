import { jsPsych } from "jspsych";

const audio_response_correct = {
  type: "audio-keyboard-response",
  stimulus: "audio/coin_sound.wav",
  choices: jsPsych.NO_KEYS,
  trial_ends_after_audio: true,
  prompt: `<div class = stimulus_div><p class = 'stimulus' style="font-size:60px;"><br></p></div> 
              <img class="lower" src="assets/arrowkey_lex.png" alt="arrow keys" style=" width:698px; height:120px">`,
};

const if_audio_response_correct = {
  timeline: [audio_response_correct],
  conditional_function: function () {
    return currentTrial == true;
  },
};

const audio_response_wrong = {
  type: "audio-keyboard-response",
  stimulus: "audio/fail_sound.wav",
  choices: jsPsych.NO_KEYS,
  trial_ends_after_audio: true,
  prompt: `<div class = stimulus_div><p class = 'stimulus' style="font-size:60px;"><br></p></div> 
              <img class="lower" src="assets/arrowkey_lex.png" alt="arrow keys" style=" width:698px; height:120px">`,
};

const if_audio_response_wrong = {
  timeline: [audio_response_wrong],
  conditional_function: function () {
    return currentTrial == false;
  },
};

export { if_audio_response_correct, if_audio_response_wrong };
