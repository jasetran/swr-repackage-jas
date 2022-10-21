import jsPsychAudioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";
import store from "store2";
import {
  config,
} from "./config";
import { imgContent, audioContent } from "./preload";

/* define instructions trial */
const intro_1 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.intro1,
  choices: "ALL_KEYS",
  response_allowed_while_playing: config.testingOnly,
  prompt: `<h1>Welcome to the world of Lexicality!</h1>
        <div class="row">
          <div class="column_1">
            <img class="characterleft" src="${imgContent.wizardMagic}" alt="animation of a wizard waving a magic wand">
            </div>
          <div class="column_3">
            <p class="middle"> You are a wizard searching for the gate that will return you to your home on Earth. To reach the gate, you must journey over lands ruled by magical guardians.</p>
            <p class="middle"> In order for the guardians to let you pass through the land, you will have to tell the difference between made-up words and real words.&nbsp;</p>
          </div>
        </div>
        <div class="button">Press <span class="yellow">ANY KEY</span> to continue </div>`,
  on_start: () => {
    document.body.style.cursor = "none";
  },
};

const intro_2 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.intro2,
  response_allowed_while_playing: config.testingOnly,
  prompt: `
    <h1>A real or made-up word will flash very quickly <br/> at the center of the screen.</h1>
    <div class="row">
     <div class="column_2_upper" style="background-color:#f2f2f2;">
       <p style = "text-align:left;">The made-up words might look like English words, but they do not mean anything in English. For example, laip, bove, or cigbert are made-up words. <span class="orange"><b>If you see a made-up word, press the LEFT ARROW KEY.</b></span></p>
     </div>
     <div class="column_2_upper" style="background-color:#f2f2f2;">
       <p style = "text-align:left;"> The real words will be ones you recognize. They are real English words like is, and, basket, or lion. <span class="blue"><b> If you see a real word, press the RIGHT ARROW KEY.</b></span></p>
     </div>
    </div>
    <div class="row">
     <div class="column_2_lower" style="background-color:#f2f2f2;">
     <img width="100%" src="${imgContent.arrowLeftP2}" alt="Magic Word, Press the Left Arrow Key" align="right">
     </div>
     <div class="column_2_lower" style="background-color:#f2f2f2;">
     <img width="100%" src="${imgContent.arrowRightP2}" alt="Real Word, Press the Right Arrow key">
     </div>
    </div>
    <div class="button">Press <span class="yellow">ANY KEY</span> to continue</div>
      `,
  // post_trial_gap: 2000,
  choices: "ALL_KEYS",
};

// class = stimulus_div style = "margin-top:20%">
const intro_3 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.intro3,
  response_allowed_while_playing: config.testingOnly,
  prompt: `
    <h1>Let us review which key we press for made-up words and real words.</h1>
    <div>
        <img class = 'cues' src="${imgContent.keyP3}" alt="arrow keys">
        <p class = "center"> Try to be as accurate as possible. <br> 
        Some words will be hard, and that&#39s okay. If you&#39re not sure, just give your best guess! </p>
    </div>
    <div class="button">Press <span class="yellow">ANY KEY</span> to practice</div>`,
  choices: "ALL_KEYS",
};

export const introduction_trials = {
  timeline: [intro_1, intro_2, intro_3],
};

export const post_practice_intro = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.coinIntro,
  response_allowed_while_playing: config.testingOnly,
  prompt: `
    <h1>Great work, you are ready to begin the journey! </h1>
      <div>
        <p class="center"> You will earn gold coins along the way.</p>
        <img class = "coin" src="${imgContent.goldCoin}" alt="gold">
      </div>
    <div class="button">Press <span class="yellow">ANY KEY</span> to begin</div>`,
  choices: "ALL_KEYS",
};

// Countdown trial
const countdown_trial_3 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.countdown3,
  prompt: `
        <div class = stimulus_div><p class = 'stimulus'>3</p></div>
        <img class="lower" src="${imgContent.arrowkeyLex}" alt="arrow keys">`,
  choices: "NO_KEYS",
  trial_duration: 1000,
  data: {
    task: "countdown",
  },
};

const countdown_trial_2 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.countdown2,
  prompt: `<div class = stimulus_div><p class = 'stimulus'>2</p></div>
   <img class="lower" src="${imgContent.arrowkeyLex}" alt="arrow keys" >`,
  choices: "NO_KEYS",
  trial_duration: 1000,
  data: {
    task: "countdown",
  },
};

const countdown_trial_1 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.countdown1,
  prompt: `<div class = stimulus_div><p class = 'stimulus'>1</p></div>
<img class="lower" src="${imgContent.arrowkeyLex}" alt="arrow keys">`,
  choices: "NO_KEYS",
  trial_duration: 1000,
  data: {
    task: "countdown",
  },
};

const countdown_trial_0 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.countdown0,
  prompt: `<div class = stimulus_div><p class = 'stimulus'>0</p></div>
<img class="lower" src="${imgContent.arrowkeyLex}" alt="arrow keys">`,
  choices: "NO_KEYS",
  trial_duration: 1000,
  data: {
    task: "countdown",
  },
};

export const countdown_trials = {
  timeline: [
    countdown_trial_3,
    countdown_trial_2,
    countdown_trial_1,
    countdown_trial_0,
  ],
};

/* coin tracking trial */
const coin_tracking_feedback = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.fairyCoin,
  prompt: `<div class = "stimulus_div"><img class = "coin_feedback" src="${imgContent.coinBag}" alt="gold"></div>`,
  choices: "NO_KEYS",
  trial_duration: 2000,
};

export const if_coin_tracking = {
  timeline: [coin_tracking_feedback],
  conditional_function: () => {
    const coinTrackingIndex = store.session("coinTrackingIndex");
    if (store.session("currentTrialCorrect") && coinTrackingIndex >= 10) {
      store.session.set("coinTrackingIndex", 0);
      return true;
    }
    store.session.set("coinTrackingIndex", coinTrackingIndex + 1);
    return false;
  },
};
