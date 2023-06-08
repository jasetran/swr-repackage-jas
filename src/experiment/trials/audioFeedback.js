import jsPsychAudioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";
import store from "store2";
import { imgContent, audioContent, isTouchScreen } from "../config/preload";
import { config } from "../config/config";

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
  prompt: () => {
    return (`
        <div id='${isTouchScreen ? 'countdown-wrapper' : ''}'>
          ${isTouchScreen ? (
            `<div id='countdown-arrows-wrapper'>
              <div class="countdown-arrows">
                <img class='btn-arrows' src=${imgContent.staticLeftKey} alt='left arrow' />
              </div>
              <div class="countdown-arrows">
                <img class='btn-arrows' src=${imgContent.staticRightKey} alt='right arrow' />
              </div>
            </div>`
          ) : (
            `<img class="lower" src="${imgContent.arrowkeyLex}" alt="arrow keys">`
          )}
        </div>`
    )
  },
};

export { audio_response };
