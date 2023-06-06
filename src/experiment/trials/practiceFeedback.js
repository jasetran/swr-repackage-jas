/* eslint-disable no-param-reassign */
import jsPsychAudioMultiResponse from '@jspsych-contrib/plugin-audio-multi-response'
import store from "store2";
import { jsPsych, config } from "../config/config";
import { camelCase, imgContent, isTouchScreen } from "../config/preload";
import i18next from "i18next";
import '../i18n'
// import { audioContent } from '../config/preload';
import { audioContent } from '../config/importModules';

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
        <span class=${store.session("responseColor")}>${i18next.t('practiceFeedbackTrial.paragraph1', { direction: `${store.session("responseLR") === 'left' ? i18next.t('terms.left') : i18next.t('terms.right')}`, typeWord: `${store.session("answerRP") === 'real' ? i18next.t('terms.real') : i18next.t('terms.made-up')}`})}</span>
        <br></br>
        ${jsPsych.timelineVariable("stimulus")}
        <span class=${store.session("answerColor")}>${i18next.t('practiceFeedbackTrial.paragraph2', { direction: `${store.session("correctLR") === 'left' ? i18next.t('terms.left') : i18next.t('terms.right')}`, typeWord: `${store.session("correctRP") === 'real' ? i18next.t('terms.real') : i18next.t('terms.made-up')}`})}</span>
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

