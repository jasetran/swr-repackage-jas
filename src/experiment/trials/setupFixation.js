import { getStimulus } from "../expirementHelpers";
import jsPsychHtmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import { isTouchScreen, imgContent } from "../config/preload";
import { config, jsPsych } from "../config/config";

// set-up screen
export const setup_fixation = {
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
    on_finish: () => {
      const trialId = jsPsych.getCurrentTimelineNodeID()

      // If it's not a practice trial
      if (trialId !== '0.0-10.0-0.0' && trialId !== '0.0-11.0-0.0' && trialId !== '0.0-12.0-0.0' && trialId !== '0.0-13.0-0.0' && trialId !== '0.0-14.0-0.0') {
        getStimulus(); // get the current stimuli for the trial
      }
    },
  };
