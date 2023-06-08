import { getStimulus } from "../experimentSetup";
import jsPsychHtmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import { imgContent, isTouchScreen} from "../config/preload";
import { config, } from "../config/config";


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
                  <img class='btn-arrows' src=${imgContent.staticLeftKey} alt='left arrow' />
                </div>
                <div class="countdown-arrows">
                  <img class='btn-arrows' src=${imgContent.staticRightKey} alt='right arrow' />
                </div>
              </div>
           </div>`
        )
      }
  
      return `<img class="lower" src="${imgContent.arrowkeyLex}" alt = "arrow-key">`
    },
    choices: "NO_KEYS",
    trial_duration: config.timing.fixationTime,
    data: {
      task: "fixation",
    },
    on_finish: trial.onFinish
  }
})

export const setup_fixation_practice = setupFixationTrials[0]
export const setup_fixation_test = setupFixationTrials[1]

