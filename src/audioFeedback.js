import jsPsychAudioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";
import store from "store2";
import { audioContent, imgContent } from "./preload";
import { config } from "./config";

const audio_response = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: () => {
    if (config.audioFeedback === "binary" && store.session("currentTrialCorrect")) {
      return audioContent.coin
    } else if (config.audioFeedback === "binary" && !store.session("currentTrialCorrect")) {
      return audioContent.fail
    } else {
      // neutral case
      return audioContent.select
    }

  },
  choices: "NO_KEYS",
  trial_ends_after_audio: true,
  prompt: `<div class = stimulus_div><p class = 'stimulus'><br></p></div> 
              <img class="lower" src="${imgContent.arrowkeyLex}" alt="arrow keys">`,
};


export { audio_response };
