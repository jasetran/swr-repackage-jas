/* eslint-disable no-param-reassign */
import jsPsychHtmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import jsPsychAudioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";
import store from "store2";

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
  on_finish: function () {
    jsPsych.setProgressBar(0);
  },
};

export const lexicality_test_practice = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: () => `<div class = stimulus_div><p class = 'stimulus'>${jsPsych.timelineVariable("stimulus")}</p></div>`,
  prompt: `<div><img class="lower" src="${imgContent.arrowkeyLex}" alt="arrow keys">`,
  stimulus_duration: () => {
    store.session.transact("practiceIndex", (oldVal) => oldVal + 1);
    if (store.session("practiceIndex") > config.countSlowPractice) {
      return config.timing.stimulusTime;
    }
    return config.timing.stimulusTimePracticeOnly;
  },
  trial_duration: config.timing.trialTime,
  choices: ["ArrowLeft", "ArrowRight"],
  data: {
    task: "practice_response" /* tag the test trials with this taskname so we can filter data later */,
    word: jsPsych.timelineVariable("stimulus"),
    start_time: config.startTime.toLocaleString("PST"),
    start_time_unix: config.startTime.getTime(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  on_finish: (data) => {
    data.correct = jsPsych.pluginAPI.compareKeys(
      data.response,
      jsPsych.timelineVariable("correct_response"),
    );
    store.session.set("currentTrialCorrect", data.correct);

    const isLeftResponse = data.response === "arrowleft";
    store.session.set("responseLR", isLeftResponse ? "left" : "right");
    store.session.set("answerRP", isLeftResponse ? "made-up" : "real");
    store.session.set("responseColor", isLeftResponse ? "orange" : "blue");

    const isLeftAnswer = jsPsych.timelineVariable("correct_response") === "ArrowLeft";
    store.session.set("correctLR", isLeftAnswer ? "left" : "right");
    store.session.set("correctRP", isLeftAnswer ? "made-up" : "real");
    store.session.set("answerColor", isLeftAnswer ? "orange" : "blue");

    jsPsych.data.addDataToLastTrial({
      correct: data.correct,
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
  const isCorrect = jsPsych.pluginAPI.compareKeys(
    jsPsych.data.get().last(2).values()[0].response,
    jsPsych.timelineVariable("correct_response"),
  );

  if (isCorrect) {
    return audioContent[camelCase(`feedback_${jsPsych.timelineVariable("stimulus")}_correct`)];
  }

  return audioContent[camelCase(`feedback_${jsPsych.timelineVariable("stimulus")}_wrong`)];
};

// define practice feedback trial
const practice_feedback_left = {
  type: jsPsychAudioKeyboardResponse,
  response_allowed_while_playing: config.testingOnly,
  stimulus: feedbackStimulus,
  prompt: () => `
<div class = stimulus_div><p class="feedback"><span class=${store.session("responseColor")}>You pressed the ${store.session("responseLR")} arrow key, which is for ${store.session("answerRP")} words! </span>
<br></br>${jsPsych.timelineVariable("stimulus")}<span class=${store.session("answerColor")}> is a ${store.session("correctRP")}  word. Press the ${store.session("correctLR")} arrow key to continue.</span></p></div>
<img class="lower" src= "${imgContent.arrowkeyLexLeft}" alt="arrow keys" >
      `,
  choices: ["ArrowLeft"],
};

const practice_feedback_right = {
  type: jsPsychAudioKeyboardResponse,
  response_allowed_while_playing: config.testingOnly,
  stimulus: feedbackStimulus,
  prompt: () => `<div class = stimulus_div>
\t<p class="feedback"><span class=${store.session("responseColor")}>You pressed the ${store.session("responseLR")} arrow key, which is for ${store.session("answerRP")} words! </span>
<br></br>${jsPsych.timelineVariable("stimulus")}<span class=${store.session("answerColor")}> is a ${store.session("correctRP")}  word. Press the ${store.session("correctLR")} arrow key to continue.</span></p>
</div><img class="lower" src="${imgContent.arrowkeyLexRight}" alt="arrow keys"> 
      `,
  choices: ["ArrowRight"],
};

export const if_node_left = {
  timeline: [practice_feedback_left],
  conditional_function: () => store.session("correctRP") === "made-up",
};

export const if_node_right = {
  timeline: [practice_feedback_right],
  conditional_function: () => store.session("correctRP") === "real",
};
