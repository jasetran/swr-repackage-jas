// @ts-check
import { RoarFirekit } from "@bdelab/roar-firekit";
import { roarConfig } from "../config/firebaseConfig";
import jsPsychFullScreen from "@jspsych/plugin-fullscreen";
import fscreen from 'fscreen';
import { jsPsych, config, taskInfo } from "../config/config";
import { makePid } from "../experimentSetup";
import i18next from "i18next";
import '../i18n'

export let firekit;

export const enter_fullscreen = {
    type: jsPsychFullScreen,
    fullscreen_mode: true,
    message: () => `<div class='text_div'><h1>${i18next.t('fullScreenTrial.prompt')}</h1></div>`,
    delay_after: 450,
    button_label: () => `${i18next.t('fullScreenTrial.buttonText')}`,
    on_start: () => {
      console.log('set language: ', i18next.language)
        if (jsPsych.getProgress().percent_complete > 13) document.body.style.cursor = "default"
    },
    on_finish: async () => {
        document.body.style.cursor = "none";

        // First fullscreen is always in the same place in the timeline
        if (jsPsych.getCurrentTimelineNodeID() === '0.0-6.0') {
            config.pid = config.pid || makePid();
            let prefix = config.pid.split("-")[0];
            if (prefix === config.pid ||  config.taskVariant !== 'school'){
              prefix = "pilot";
            }
            const userInfo = {
              id: config.pid,
              studyId: config.taskVariant + "-" + config.userMode,
              schoolId: config.schoolId || prefix,
              userMetadata: config.userMetadata,
            };
        
            firekit = new RoarFirekit({
              config: roarConfig,
              userInfo: userInfo,
              taskInfo,
            });
            await firekit.startRun();
        }
    },
  };
  
export const if_not_fullscreen = {
    timeline: [enter_fullscreen],
    conditional_function: () => {
      return fscreen.fullscreenElement === null
    }
  }

export const exit_fullscreen = {
    type: jsPsychFullScreen,
    fullscreen_mode: false,
    delay_after: 0,
  };