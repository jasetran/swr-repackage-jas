/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import store from "store2";

// // Import necessary for async in the top level of the experiment script
// import "regenerator-runtime/runtime.js";

// setup
import { initRoarJsPsych, initRoarTimeline } from './config/config.js';
import { csvTransformed } from "./config/corpus.js";
import { generateAssetObject, createPreloadTrials } from "@bdelab/roar-utils";
import { Cat } from '@bdelab/jscat';
import { jsPsych } from "./jsPsych.js";

// trials
import { audio_response } from "./trials/audioFeedback.js";
import { introduction_trials, post_practice_intro,} from "./trials/introduction.js";
import { practice_feedback } from "./trials/practiceFeedback.js";
import { mid_block_page_list, post_block_page_list, final_page, } from "./trials/gameBreak.js";
import { if_not_fullscreen, exit_fullscreen } from './trials/fullScreen.js';
import { setup_fixation_test, setup_fixation_practice } from './trials/setupFixation.js';
import { lexicalityTest, leixcalityPractice } from './trials/stimulus.js'
import { countdown_trials } from "./trials/countdown.js";
import { if_coin_tracking } from "./trials/coinFeedback.js";


export let cat
export let cat2

export let mediaAssets
export let preloadTrials


export function buildExperiment(config) {
  mediaAssets = generateAssetObject(config.assets, config.bucketURI)
  preloadTrials = createPreloadTrials(config.assets, config.bucketURI).default

  // Initialize jsPsych and timeline
  initRoarJsPsych(config);
  const initialTimeline = initRoarTimeline(config);

  cat = new Cat({method: 'MLE', minTheta: -6, maxTheta: 6, itemSelect: store.session("itemSelect")});

  // Include new items in thetaEstimate
  cat2 = new Cat({method: 'MLE', minTheta: -6, maxTheta: 6, itemSelect: store.session("itemSelect")});

  const timeline = [preloadTrials, ...initialTimeline.timeline, introduction_trials, if_not_fullscreen, countdown_trials]

  // the core procedure
  const pushPracticeTotimeline = (array) => {
    array.forEach((element) => {
      const block = {
        timeline: [
          setup_fixation_practice,
          leixcalityPractice,
          audio_response,
          practice_feedback,
        ],
        timeline_variables: [element],
      };
      timeline.push(block);
    });
  }

  const blockPracticeTrials = csvTransformed.practice.slice(0, config.totalTrialsPractice);

  pushPracticeTotimeline(blockPracticeTrials);
  timeline.push(post_practice_intro);
  timeline.push(if_not_fullscreen);

  const core_procedure = {
    timeline: [
      setup_fixation_test,
      lexicalityTest,
      audio_response,
      if_coin_tracking,
    ],
  };

  const pushTrialsTotimeline = (stimulusCounts) => {
    for (let i = 0; i < stimulusCounts.length; i++) {
      // for each block: add trials
      /* add first half of block */
      const roar_mainproc_block_half_1 = {
        timeline: [core_procedure],
        conditional_function: () => {
          if (stimulusCounts[i] === 0) {
            return false;
          }
          store.session.set("currentBlockIndex", i);
          return true;
        },
        repetitions: Math.floor(stimulusCounts[i] / 2) + 1,
      };
      /* add second half of block */
      const roar_mainproc_block_half_2 = {
        timeline: [core_procedure],
        conditional_function: () => {
          return stimulusCounts[i] !== 0;
        },
        repetitions: stimulusCounts[i] - 1 - Math.floor(stimulusCounts[i] / 2),
      };
      const total_roar_mainproc_line = {
        timeline: [
          countdown_trials,
          roar_mainproc_block_half_1,
          mid_block_page_list[i],
          if_not_fullscreen,
          countdown_trials,
          roar_mainproc_block_half_2,
        ],
      };
      timeline.push(total_roar_mainproc_line);
      if (i < stimulusCounts.length - 1) {
        timeline.push(post_block_page_list[i]);
        timeline.push(if_not_fullscreen)
      }
    }
  }

  pushTrialsTotimeline(config.stimulusCountList);
  timeline.push(final_page, exit_fullscreen);

  return { jsPsych, timeline }
}


