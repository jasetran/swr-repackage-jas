import jsPsychAudioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";
import store from "store2";
import { audioContent, imgContent } from "./preload";
import { config } from "./config";
<<<<<<< HEAD
<<<<<<< HEAD
import { isTouchScreen } from "./introduction";
=======
>>>>>>> 383261b6 (Removing unused trials, consolidating audio feedback trial, minor fixes and CSS changes)
=======
import { isTouchScreen } from "./introduction";
>>>>>>> fe861e2d (Changing countdown and fixation to be same size as buttons on mobile)

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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> fe861e2d (Changing countdown and fixation to be same size as buttons on mobile)
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
<<<<<<< HEAD
};

=======
  prompt: `<div class = stimulus_div><p class = 'stimulus'><br></p></div> 
              <img class="lower" src="${imgContent.arrowkeyLex}" alt="arrow keys">`,
};


>>>>>>> 383261b6 (Removing unused trials, consolidating audio feedback trial, minor fixes and CSS changes)
=======
};

>>>>>>> fe861e2d (Changing countdown and fixation to be same size as buttons on mobile)
export { audio_response };
