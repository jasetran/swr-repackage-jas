/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
import jsPsychAudioMultiResponse from "@jspsych-contrib/plugin-audio-multi-response";
import store from "store2";
import i18next from "i18next";
import "../i18n";
import { isTouchScreen } from "../experimentSetup";
import { mediaAssets } from "../experiment";
import { jsPsych } from "../jsPsych";

let count = 0;

const feedbackStimulus = () => {
  // const jsPsych = jsPsychStore.getJsPsych()

  const previousTrialData = jsPsych.data.get().last(2).values()[0];

  let isCorrect;

  if (previousTrialData.keyboard_response) {
    isCorrect =
      previousTrialData.keyboard_response ===
      previousTrialData.correctResponse.toLowerCase();
  } else if (
    previousTrialData.correctResponse === "ArrowLeft" &&
    previousTrialData.button_response === 0
  ) {
    isCorrect = true;
  } else if (
    previousTrialData.correctResponse === "ArrowRight" &&
    previousTrialData.button_response === 1
  ) {
    isCorrect = true;
  } else {
    isCorrect = false;
  }

  count += 1;

  if (isCorrect) {
    if (store.session.get("config").story) {
      return mediaAssets.audio[`feedback${count}Correct`] }
    return mediaAssets.audio[`feedback${count}CorrectNs`]
  }
  if (store.session.get("config").story) { 
    return mediaAssets.audio[`feedback${count}Wrong`] }
  return mediaAssets.audio[`feedback${count}WrongNs`];
};

export const practice_feedback = {
  type: jsPsychAudioMultiResponse,
  response_allowed_while_playing: () =>
    store.session.get("config").skipInstructions,
  prompt_above_buttons: true,
  stimulus: () => feedbackStimulus(),
  prompt: () => `
  <div class = stimulus_div>
    <p class="feedback">
      <span class=${store.session("responseColor")}>${i18next.t(
        "practiceFeedbackTrial.paragraph1",
        {
          direction: `${
            store.session("responseLR") === "left"
              ? i18next.t("terms.left")
              : i18next.t("terms.right")
          }`,
          typeWord: `${
            store.session("answerRP") === "real"
              ? i18next.t("terms.real")
              : i18next.t("terms.made-up")
          }`,
        },
      )}</span>
      <br></br>
      ${jsPsych.timelineVariable("stimulus")}
      <span class=${store.session("answerColor")}>${i18next.t(
        "practiceFeedbackTrial.paragraph2",
        {
          direction: `${
            store.session("correctLR") === "left"
              ? i18next.t("terms.left")
              : i18next.t("terms.right")
          }`,
          typeWord: `${
            store.session("correctRP") === "real"
              ? i18next.t("terms.real")
              : i18next.t("terms.made-up")
          }`,
        },
      )}</span>
    </p>
  </div>
  ${
    !isTouchScreen
      ? `<img class="lower" src="${
          store.session("correctRP") === "made-up"
            ? `${mediaAssets.images.arrowkeyLexLeft}`
            : `${mediaAssets.images.arrowkeyLexRight}`
        }" alt="arrow keys">`
      : ""
  }`,
  keyboard_choices: () =>
    store.session("correctRP") === "made-up" ? ["ArrowLeft"] : ["ArrowRight"],
  button_choices: () => {
    if (isTouchScreen) {
      return store.session("correctRP") === "made-up" ? ["Left"] : ["Right"];
    }
    return [];
  },
  button_html: () => `
  <button style="background-color: transparent;">
    <img class='lower' src=${
      store.session("correctRP") === "made-up"
        ? `${mediaAssets.images.arrowkeyLexLeft}`
        : `${mediaAssets.images.arrowkeyLexRight}`
    } alt="Arrow choices"/>
  </button>`,
};
