/* eslint-disable no-param-reassign */
import jsPsychHtmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
<<<<<<< HEAD
import jsPsychHTMLMultiResponse from '@jspsych-contrib/plugin-html-multi-response';
import jsPsychAudioMultiResponse from '@jspsych-contrib/plugin-audio-multi-response'
import store from "store2";
import { isTouchScreen } from "./introduction"
=======
import jsPsychAudioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";
import jsPsychHTMLSwipeResponse from '@jspsych-contrib/plugin-html-swipe-response';
import jsPsychAudioMultiResponse from '@jspsych-contrib/plugin-audio-multi-response'
import store from "store2";
import { isTouchScreen } from "./introduction";
>>>>>>> f02460cc (Rewritting lexicallity practice trial, practice feedback trial, and feedbackStimulus function)

import { jsPsych, config } from "./config";
import {
  audioContent, camelCase, imgContent,
} from "./preload";

/* For Practice Trial Only */
export const setup_fixation_practice = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: () => `<div class='stimulus_div'>
                      <p class='stimulus'>+</p>
                   </div>`,             
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
  //config.timing.fixationTime
  trial_duration: 1000,
  data: {
    task: "fixation",
  },
<<<<<<< HEAD
=======
  on_load: () => console.log('This is setup fixation practice'),
  on_finish: function () {
    jsPsych.setProgressBar(0);
  },
>>>>>>> f02460cc (Rewritting lexicallity practice trial, practice feedback trial, and feedbackStimulus function)
};


export const lexicality_test_practice = {
<<<<<<< HEAD
  type: jsPsychHTMLMultiResponse,
  stimulus: () => {
    return (
      `<div class='stimulus_div'>
        <p class='stimulus'>${jsPsych.timelineVariable("stimulus")}</p>
      </div>`
    )
  },
  prompt: () => !isTouchScreen ? `<img class="lower" src="${imgContent.arrowkeyLex}" alt = "arrow-key">` : '',
=======
  type: jsPsychHTMLSwipeResponse,
<<<<<<< HEAD
  stimulus: () => `<div class = stimulus_div><p class = 'stimulus'>${jsPsych.timelineVariable("stimulus")}</p></div>`,
  prompt: `<div><img class="lower" src="${imgContent.arrowkeyLex}" alt="arrow keys">`,
>>>>>>> f02460cc (Rewritting lexicallity practice trial, practice feedback trial, and feedbackStimulus function)
=======
  stimulus: () => {
    return (
      `<div class='stimulus_div'>
        <p class = 'stimulus'>${jsPsych.timelineVariable("stimulus")}</p>
      </div>`
    )
  },
  prompt: `
            <div>
              <img class="lower" src="${imgContent.arrowkeyLex}" alt="arrow keys">
            </div>
          `,
>>>>>>> aa45ead8 (CSS changes)
  stimulus_duration: () => {
    store.session.transact("practiceIndex", (oldVal) => oldVal + 1);
    if (store.session("practiceIndex") > config.countSlowPractice) {
      return config.timing.stimulusTime;
    }
    return config.timing.stimulusTimePracticeOnly;
  },
  trial_duration: config.timing.trialTime,
  keyboard_choices: ["ArrowLeft", "ArrowRight"],
<<<<<<< HEAD
  button_choices: () => isTouchScreen ? ["ArrowLeft", "ArrowRight"] : [],
  button_html: () => {
    if (isTouchScreen) {
      return (
        [
        `<button class="lexicality-trial-arrows">
          <img class='btn-arrows' src=${imgContent.staticLeftKey} alt='left arrow' />
        </button>`,
        `<button class="lexicality-trial-arrows">
          <img class='btn-arrows' src=${imgContent.staticRightKey} alt='right arrow' />
        </button>`
        ]
      )
    }
  },
=======
>>>>>>> f02460cc (Rewritting lexicallity practice trial, practice feedback trial, and feedbackStimulus function)
  data: {
    save_trial: true,
    task: "practice_response" /* tag the test trials with this taskname so we can filter data later */,
    word: jsPsych.timelineVariable("stimulus"),
  },
  on_load: () => {
    if (isTouchScreen) {
      document.getElementById("jspsych-html-multi-response-button-0").style.margin = '0rem 5rem 0rem 5rem'
      document.getElementById("jspsych-html-multi-response-button-1").style.margin = '0rem 5rem 0rem 5rem'
    }
  },
  on_finish: (data) => {
<<<<<<< HEAD
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


=======
    if (data.keyboard_response) {
      data.correct = jsPsych.pluginAPI.compareKeys(
        data.keyboard_response,
        jsPsych.timelineVariable("correct_response"),
      )
    } else {
      let correctSwipeDirection = jsPsych.timelineVariable("correct_response").toLowerCase().substring(5)
      data.correct = correctSwipeDirection === data.swipe_response
    }

>>>>>>> f02460cc (Rewritting lexicallity practice trial, practice feedback trial, and feedbackStimulus function)
    if (data.correct) {
      store.session.set("response", 1);
    } else {
      store.session.set("response", 0);
    }
    store.session.set("currentTrialCorrect", data.correct);

<<<<<<< HEAD
    const isLeftResponse = (data.keyboard_response === 'arrowleft' || data.button_response === 0)
=======
    const isLeftResponse = data.keyboard_response === 'arrowleft' || data.swipe_response === 'left'   
>>>>>>> f02460cc (Rewritting lexicallity practice trial, practice feedback trial, and feedbackStimulus function)
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
<<<<<<< HEAD
    isCorrect = previousTrialData.keyboard_response === previousTrialData.correctResponse.toLowerCase()
  } else {
    if (previousTrialData.correctResponse === 'ArrowLeft' && previousTrialData.button_response === 0) {
      isCorrect = true
    } else if (previousTrialData.correctResponse === 'ArrowRight' && previousTrialData.button_response === 1) {
      isCorrect = true
    } else {
      isCorrect = false
    }
=======
    isCorrect = previousTrialData.keyboard_response.toLowerCase() === previousTrialData.correctResponse.toLowerCase()
  } else {
    isCorrect = previousTrialData.swipe_response === previousTrialData.correctResponse.toLowerCase().substring(5)
>>>>>>> f02460cc (Rewritting lexicallity practice trial, practice feedback trial, and feedbackStimulus function)
  }

  if (isCorrect) {
    return audioContent[camelCase(`feedback_${jsPsych.timelineVariable("stimulus")}_correct`)];
  }

  return audioContent[camelCase(`feedback_${jsPsych.timelineVariable("stimulus")}_wrong`)];
};


export const practice_feedback = {
<<<<<<< HEAD
<<<<<<< HEAD
  type: jsPsychAudioMultiResponse,
  response_allowed_while_playing: config.testingOnly,
  prompt_above_buttons: true,
=======
  type: jsPsychAudioSwipeResponse,
=======
  type: jsPsychAudioMultiResponse,
>>>>>>> aa45ead8 (CSS changes)
  response_allowed_while_playing: config.testingOnly,
>>>>>>> f02460cc (Rewritting lexicallity practice trial, practice feedback trial, and feedbackStimulus function)
  stimulus: () => feedbackStimulus(),
  prompt_above_buttons: true,
  prompt: () => {
    return (`<div class = stimulus_div>
      <p class="feedback">
<<<<<<< HEAD
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
      `<button style="background-color: transparent;">
        <img class='lower' src=${store.session("correctRP") === "made-up" ? `${imgContent.arrowkeyLexLeft}` : `${imgContent.arrowkeyLexRight}`} alt="Arrow choices"/>
      </button>`
    )
  },
};

=======
        ${isTouchScreen ? `<span class=${store.session("responseColor")}>You swiped ${store.session("responseLR")} which is for ${store.session("answerRP")} words!</span>` : `<span class=${store.session("responseColor")}>You pressed the ${store.session("responseLR")} arrow key, which is for ${store.session("answerRP")} words! </span>`}
        <br></br>
        ${jsPsych.timelineVariable("stimulus")}
        ${isTouchScreen ? `<span class=${store.session("answerColor")}> is a ${store.session("correctRP")}  word. Press the ${store.session("correctLR")} arrow to continue.</span>` : `<span class=${store.session("answerColor")}> is a ${store.session("correctRP")}  word. Press the ${store.session("correctLR")} arrow key to continue.</span>`}
      </p>
    </div>
    ${!isTouchScreen ? `<img class="lower" src="${store.session("correctRP") === "made-up" ? `${imgContent.arrowkeyLexLeft}` : `${imgContent.arrowkeyLexRight}`}" alt="arrow keys">` : ''}`)
  },
  keyboard_choices: () => store.session("correctRP") === "made-up" ? ["ArrowLeft"] : ["ArrowRight"],
  button_choices: () => isTouchScreen ? store.session("correctRP") === "made-up" ? ["Left"] : ["Right"] : [],
  button_html: `
      <button class='practice-feedback-btn'>
        <img class='practice-feedback-img' src=${store.session("correctRP") === "made-up" ? `${imgContent.arrowkeyLexLeft}` : `${imgContent.arrowkeyLexRight}`} alt="Arrow choices"/>
      </button
  `,
};

export const if_node_left = {
  // timeline: [practice_feedback_left],
  conditional_function: () => store.session("correctRP") === "made-up",
};

export const if_node_right = {
  // timeline: [practice_feedback_right],
  conditional_function: () => store.session("correctRP") === "real",
};
>>>>>>> f02460cc (Rewritting lexicallity practice trial, practice feedback trial, and feedbackStimulus function)
