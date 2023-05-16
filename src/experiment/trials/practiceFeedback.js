/* eslint-disable no-param-reassign */
import jsPsychAudioMultiResponse from '@jspsych-contrib/plugin-audio-multi-response'
import store from "store2";
import { jsPsych, config } from "../config/config";
import { audioContent, camelCase, imgContent, isTouchScreen } from "../config/preload";


const feedbackStimulus = () => {
  const previousTrialData = jsPsych.data.get().last(2).values()[0]

  let isCorrect

  if (previousTrialData.keyboard_response) {
    isCorrect = previousTrialData.keyboard_response === previousTrialData.correctResponse.toLowerCase()
  } else {
    if (previousTrialData.correctResponse === 'ArrowLeft' && previousTrialData.button_response === 0) {
      isCorrect = true
    } else if (previousTrialData.correctResponse === 'ArrowRight' && previousTrialData.button_response === 1) {
      isCorrect = true
    } else {
      isCorrect = false
    }
  }

  if (isCorrect) {
    return audioContent[camelCase(`feedback_${jsPsych.timelineVariable("stimulus")}_correct${isTouchScreen ? '_t' : ''}`)];
  }

  return audioContent[camelCase(`feedback_${jsPsych.timelineVariable("stimulus")}_wrong${isTouchScreen ? '_t' : ''}`)];
};


export const practice_feedback = {
  type: jsPsychAudioMultiResponse,
  response_allowed_while_playing: config.testingOnly,
  prompt_above_buttons: true,
  stimulus: () => feedbackStimulus(),
  prompt: () => {
    return (`<div class = stimulus_div>
      <p class="feedback">
        <span class=${store.session("responseColor")}>You pressed the ${store.session("responseLR")} arrow which is for ${store.session("answerRP")} words!</span>
        <br></br>
        ${jsPsych.timelineVariable("stimulus")}
        <span class=${store.session("answerColor")}> is a ${store.session("correctRP")}  word. Press the ${store.session("correctLR")} arrow to continue.</span>
      </p>
    </div>
    ${!isTouchScreen ? `<img class="lower" src="${store.session("correctRP") === "made-up" ? `${imgContent.arrowkeyLexLeft}` : `${imgContent.arrowkeyLexRight}`}" alt="arrow keys">` : ''}`)
  },
  keyboard_choices: () => store.session("correctRP") === "made-up" ? ["ArrowLeft"] : ["ArrowRight"],
  button_choices: () => isTouchScreen ? store.session("correctRP") === "made-up" ? ["Left"] : ["Right"] : [],
  button_html: () => {
    return (
      `<button style="background-color: transparent;">
        <img class='lower' src=${store.session("correctRP") === "made-up" ? `${imgContent.arrowkeyLexLeft}` : `${imgContent.arrowkeyLexRight}`} alt="Arrow choices"/>
      </button>`
    )
  },
};

