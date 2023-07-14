import jsPsychAudioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";
import store from "store2";
import { mediaAssets, } from "../experiment";
import { isTouchScreen } from "../experimentSetup";

const audio_response = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: () => {
    if (store.session.get('config').audioFeedback === "binary" && store.session("currentTrialCorrect")) {
      return mediaAssets.audio.coin
    } else if (store.session.get('config').audioFeedback === "binary" && !store.session("currentTrialCorrect")) {
      return mediaAssets.audio.fail
    } else {
      // neutral case
      return mediaAssets.audio.select
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
                <img class='btn-arrows' src=${mediaAssets.images.staticLeftKey} alt='left arrow' />
              </div>
              <div class="countdown-arrows">
                <img class='btn-arrows' src=${mediaAssets.images.staticRightKey} alt='right arrow' />
              </div>
            </div>`
          ) : (
            `<img class="lower" src="${mediaAssets.images.arrowkeyLex}" alt="arrow keys">`
          )}
        </div>`
    )
  },
};

export { audio_response };
