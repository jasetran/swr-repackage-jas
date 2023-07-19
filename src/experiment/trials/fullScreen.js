// @ts-check
import jsPsychFullScreen from "@jspsych/plugin-fullscreen";
import fscreen from "fscreen";
import i18next from "i18next";
import "../i18n";

const fullScreenTrialData = [
  {
    onFinish: () => {
      document.body.style.cursor = "none";
    },
  },
  {
    onFinish: () => {
      document.body.style.cursor = "none";
    },
  },
];

const fullScreenTrials = fullScreenTrialData.map((trial) => ({
  type: jsPsychFullScreen,
  fullscreen_mode: true,
  message: () =>
    `<div class='text_div'><h1>${i18next.t(
      "fullScreenTrial.prompt",
    )}</h1></div>`,
  delay_after: 0,
  button_label: () => `${i18next.t("fullScreenTrial.buttonText")}`,
  on_start: () => {
    document.body.style.cursor = "default";
  },
  on_finish: trial.onFinish,
}));

export const enter_fullscreen = fullScreenTrials[0];
const reenter_fullscreen = fullScreenTrials[1];

export const if_not_fullscreen = {
  timeline: [reenter_fullscreen],
  conditional_function: () => fscreen.fullscreenElement === null,
};

export const exit_fullscreen = {
  type: jsPsychFullScreen,
  fullscreen_mode: false,
  delay_after: 0,
};
