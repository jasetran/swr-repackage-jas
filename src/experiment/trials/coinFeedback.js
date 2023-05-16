import jsPsychAudioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";
import store from "store2";
import { audioContent, imgContent } from "../config/preload";

/* coin tracking trial */
const coin_tracking_feedback = {
    type: jsPsychAudioKeyboardResponse,
    stimulus: audioContent.fairyCoin,
    prompt: `<div class = "stimulus_div"><img class = "coin_feedback" src="${imgContent.coinBag}" alt="gold"></div>`,
    choices: "NO_KEYS",
    trial_duration: 2000,
  };
  
  export const if_coin_tracking = {
    timeline: [coin_tracking_feedback],
    conditional_function: () => {
      const coinTrackingIndex = store.session("coinTrackingIndex");
      if (store.session("currentTrialCorrect") && coinTrackingIndex >= 10) {
        store.session.set("coinTrackingIndex", 0);
        return true;
      }
      store.session.set("coinTrackingIndex", coinTrackingIndex + 1);
      return false;
    },
  };