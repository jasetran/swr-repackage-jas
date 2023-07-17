import { getStimulus } from "../experimentSetup.js";
import jsPsychHtmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import { isTouchScreen } from "../experimentSetup.js";
import store from "store2";
import { mediaAssets } from "../experiment.js";

// set-up screen
const setupFixationData = [
  {
    onFinish: () => {}
  },
  {
    onFinish: () => getStimulus()
  },
]

const setupFixationTrials = setupFixationData.map((trial, i) => {
  return {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
      return `<div class='stimulus_div'>
                <p class='stimulus'>+</p>
              </div>`;
    },
    prompt: () => {
      if (isTouchScreen) {
        return (
          `<div id='${isTouchScreen ? 'countdown-wrapper' : ''}'>
              <div id='countdown-arrows-wrapper'>
                <div class="countdown-arrows">
                  <img class='btn-arrows' src=${mediaAssets.images.staticLeftKey} alt='left arrow' />
                </div>
                <div class="countdown-arrows">
                  <img class='btn-arrows' src=${mediaAssets.images.staticRightKey} alt='right arrow' />
                </div>
              </div>
           </div>`
        )
      }
  
      return `<img class="lower" src="${mediaAssets.images.arrowkeyLex}" alt = "arrow-key">`
    },
    choices: "NO_KEYS",
    trial_duration: () => store.session.get('config').timing.fixationTime,
    data: {
      task: "fixation",
    },
    on_finish: trial.onFinish
  }
})

export const setup_fixation_practice = setupFixationTrials[0]
export const setup_fixation_test = setupFixationTrials[1]

