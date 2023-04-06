/* eslint-disable no-param-reassign */
import jsPsychHtmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import jsPsychAudioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";
import jsPsychHTMLMultiResponse from '@jspsych-contrib/plugin-html-multi-response';
import jsPsychAudioMultiResponse from '@jspsych-contrib/plugin-audio-multi-response'
import store from "store2";
import { isTouchScreen } from "./introduction";

import { jsPsych, config } from "./config";
import {
  audioContent, camelCase, imgContent,
} from "./preload";

/* For Practice Trial Only */
export const setup_fixation_practice = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: () => `<div class = stimulus_div><p class = 'stimulus'>+</p></div>`,
  prompt: `<img class="lower" src="${imgContent.arrowkeyLex}" alt = "arrow-key">`,
  choices: "NO_KEYS",
  trial_duration: config.timing.fixationTime,
  data: {
    task: "fixation",
  },
};


export const lexicality_test_practice = {
  type: jsPsychHTMLMultiResponse,
  stimulus: () => {
    return (
      `<div class='stimulus_div'>
        <p class='stimulus'>${jsPsych.timelineVariable("stimulus")}</p>
      </div>`
    )
  },
  stimulus_duration: () => {
    store.session.transact("practiceIndex", (oldVal) => oldVal + 1);
    if (store.session("practiceIndex") > config.countSlowPractice) {
      return config.timing.stimulusTime;
    }
    return config.timing.stimulusTimePracticeOnly;
  },
  trial_duration: config.timing.trialTime,
  keyboard_choices: ["ArrowLeft", "ArrowRight"],
  button_choices: ["ArrowLeft", "ArrowRight"],
  button_html: [
    `<button>
      <img class="btn-arrows" src=${imgContent.leftArrow} alt='left arrow' />
    </button>`,
    `<button>
      <img class="btn-arrows" src=${imgContent.rightArrow} alt='right arrow' />
    </button>`
  ],
  data: {
    save_trial: true,
    task: "practice_response" /* tag the test trials with this taskname so we can filter data later */,
    word: jsPsych.timelineVariable("stimulus"),
  },
  on_finish: (data) => {
    const correctResponse = jsPsych.timelineVariable("correct_response")

    if (data.keyboard_response) {
      data.correct = jsPsych.pluginAPI.compareKeys(
        data.keyboard_response,
        correctResponse,
      )
    } else {
      if (correctResponse === 'ArrowLeft' && data.button_response === 0) {
        data.correct = true
      } else if (correctResponse === 'ArrowRight' && data.button_response === 1) {
        data.correct = true
      } else {
        data.correct = false
      }
    }


    if (data.correct) {
      store.session.set("response", 1);
    } else {
      store.session.set("response", 0);
    }
    store.session.set("currentTrialCorrect", data.correct);

    const isLeftResponse = (data.keyboard_response === 'arrowleft' || data.button_response === 0)
    store.session.set("responseLR", isLeftResponse ? "left" : "right");
    store.session.set("answerRP", isLeftResponse ? "made-up" : "real");
    store.session.set("responseColor", isLeftResponse ? "orange" : "blue");

    const isLeftAnswer = jsPsych.timelineVariable("correct_response") === "ArrowLeft";
    store.session.set("correctLR", isLeftAnswer ? "left" : "right");
    store.session.set("correctRP", isLeftAnswer ? "made-up" : "real");
    store.session.set("answerColor", isLeftAnswer ? "orange" : "blue");

    jsPsych.data.addDataToLastTrial({
      correct: store.session("response"),
      correctResponse: jsPsych.timelineVariable("correct_response"),
      realpseudo: jsPsych.timelineVariable("realpseudo"),
      block: "Practice",
      corpusId: "Practice",
      trialNumPractice: store.session("practiceIndex"),
      pid: config.pid,
    });

    jsPsych.setProgressBar(0);
  },
};

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
    return audioContent[camelCase(`feedback_${jsPsych.timelineVariable("stimulus")}_correct`)];
  }

  return audioContent[camelCase(`feedback_${jsPsych.timelineVariable("stimulus")}_wrong`)];
};


export const practice_feedback = {
  type: jsPsychAudioMultiResponse,
  response_allowed_while_playing: config.testingOnly,
  prompt_above_buttons: true,
  stimulus: () => feedbackStimulus(),
  prompt: () => {
    return (`<div class = stimulus_div>
      <p class="feedback">
        ${isTouchScreen ? `<span class=${store.session("responseColor")}>You pressed the ${store.session("responseLR")} arrow which is for ${store.session("answerRP")} words!</span>` : `<span class=${store.session("responseColor")}>You pressed the ${store.session("responseLR")} arrow key, which is for ${store.session("answerRP")} words! </span>`}
        <br></br>
        ${jsPsych.timelineVariable("stimulus")}
        ${isTouchScreen ? `<span class=${store.session("answerColor")}> is a ${store.session("correctRP")}  word. Press the ${store.session("correctLR")} arrow to continue.</span>` : `<span class=${store.session("answerColor")}> is a ${store.session("correctRP")}  word. Press the ${store.session("correctLR")} arrow key to continue.</span>`}
      </p>
    </div>
    ${!isTouchScreen ? `<img class="lower" src="${store.session("correctRP") === "made-up" ? `${imgContent.arrowkeyLexLeft}` : `${imgContent.arrowkeyLexRight}`}" alt="arrow keys">` : ''}`)
  },
  keyboard_choices: () => store.session("correctRP") === "made-up" ? ["ArrowLeft"] : ["ArrowRight"],
  button_choices: () => isTouchScreen ? store.session("correctRP") === "made-up" ? ["Left"] : ["Right"] : [],
  button_html: () => {
    return (
      `
      <div class='practice-feedback-btn-container'>
        <button class='practice-feedback-btn'>
          <img class='practice-feedback-img' src=${store.session("correctRP") === "made-up" ? `${imgContent.arrowkeyLexLeft}` : `${imgContent.arrowkeyLexRight}`} alt="Arrow choices"/>
        </button
      </div>
      `
    )
  },
};

