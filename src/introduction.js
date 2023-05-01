import jsPsychAudioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";
import store from "store2";
import {
  config,
} from "./config";
import { imgContent, audioContent } from "./preload";
import AudioMultiResponsePlugin from "@jspsych-contrib/plugin-audio-multi-response";
import { isTouchScreen } from "./preload";


/* define instructions trial */

const introTrialsContent = [
  { stimulus: () => isTouchScreen ? audioContent.intro1T : audioContent.intro1,
    prompt: () => {
      return (`
        <h1 id='lexicality-intro-header'>Welcome to the world of Lexicality!</h1>
        <div class="row">
          <div class="column_1">
            <img class="characterleft" src="${imgContent.wizardMagic}" alt="animation of a wizard waving a magic wand">
          </div>
          <div class="column_3">
            <p class="middle"> You are a wizard searching for the gate that will return you to your home on Earth. To reach the gate, you must journey over lands ruled by magical guardians.</p>
            <p class="middle"> In order for the guardians to let you pass through the land, you will have to tell the difference between made-up words and real words.&nbsp;</p>
          </div>
        </div>
        ${!isTouchScreen ? '<div class="button">Press <span class="yellow">ANY KEY</span> to continue </div>' : ''}`
      )
    } ,
  },
  { stimulus: () => isTouchScreen ? audioContent.intro2T : audioContent.intro2,
    prompt: () => { 
      return (`
        <h1>A real or made-up word will flash very quickly at the center of the screen.</h1>
        <div class="row">
          <div class="column_2_upper" style="background-color:#f2f2f2;">
            <p style = "text-align:left;">The made-up words might look like English words, but they do not mean anything in English. For example, laip, bove, or cigbert are made-up words. <span class="orange"><b>If you see a made-up word, press the LEFT ARROW.</b></span></p>
          </div>
          <div class="column_2_upper" style="background-color:#f2f2f2;">
            <p style = "text-align:left;"> The real words will be ones you recognize. They are real English words like is, and, basket, or lion. <span class="blue"><b> If you see a real word, press the RIGHT ARROW.</b></span></p>
          </div>
        </div>
        <div class="row">
          <div class="column_2_lower" style="background-color:#f2f2f2;">
            <img width="100%" src=${imgContent.arrowLeftP2} alt="Magic Word, Press the Left Arrow Key" align="right">
          </div>
          <div class="column_2_lower" style="background-color:#f2f2f2;">
            <img width="100%" src=${imgContent.arrowRightP2} alt="Real Word, Press the Right Arrow key">
        </div>
        ${!isTouchScreen ? '<div class="button">Press <span class="yellow">ANY KEY</span> to continue</div>' : ''}`
      )
    },
  },
  { stimulus: () => isTouchScreen ? audioContent.intro3T : audioContent.intro3,
    prompt: () => {
      return (
        ` <h1>Let us review which arrow we press for made-up words and real words.</h1>
          <div>
            <img class = 'cues' src="${imgContent.keyP3}" alt="arrow keys">
            <p class = "center"> Try to be as accurate as possible.</p>
            <p>Some words will be hard, and that&#39s okay. If you&#39re not sure, just give your best guess!</p>
          </div>
          ${!isTouchScreen ? '<div class="button">Press <span class="yellow">ANY KEY</span> to practice</div>' : ''}`
      )
    },
  },
]

const introTrialsMapped = introTrialsContent.map((trial, i) => {
  return (
    {
      type: AudioMultiResponsePlugin,
      stimulus: trial.stimulus,
      keyboard_choices: () => isTouchScreen ? "NO_KEYS" : "ALL_KEYS",
      button_choices: () => isTouchScreen ? ["HERE"] : [],
      button_html: `<button class='button'>Press <span class='yellow'>%choice%</span> to ${isTouchScreen && i === 2 ? 'practice' : 'continue'}</button>`,
      response_allowed_while_playing: config.testingOnly,
      prompt: trial.prompt,
      prompt_above_buttons: true,
      on_start: () => console.log({isTouchScreen}),
      on_load: () => console.log({audioContent}),
    }
  )
})

// const introTrialsWithCheck = []

// introTrialsMapped.forEach(trial => {
//   introTrialsWithCheck.push(trial)
//   introTrialsWithCheck.push(if_not_fullscreen)
// })

export const introduction_trials = {
  timeline: [...introTrialsMapped],
};

export const post_practice_intro = {
  type: AudioMultiResponsePlugin,
  stimulus: () => isTouchScreen ? audioContent.coinIntroT : audioContent.coinIntro,
  keyboard_choices: () => isTouchScreen ? "NO_KEYS" : "ALL_KEYS",
  button_choices: () => isTouchScreen ? ["HERE"] : [],
  button_html: "<button class='button'>Press <span class='yellow'>%choice%</span> to begin</button>",
  response_allowed_while_playing: config.testingOnly,
  prompt: `
    <h1>Great work, you are ready to begin the journey! </h1>
      <div>
        <p class="center"> You will earn gold coins along the way.</p>
        <img class = "coin" src="${imgContent.goldCoin}" alt="gold">
      </div>
    ${!isTouchScreen ? '<div class="button">Press <span class="yellow">ANY KEY</span> to begin</div>' : ''}`,
  prompt_above_buttons: true
};

const countDownData = [
  {audio: audioContent.countdown3, count: 3}, 
  {audio: audioContent.countdown2, count: 2},
  {audio: audioContent.countdown1, count: 1},
  {audio: audioContent.countdown0, count: 0},
]

const countDownTrials = countDownData.map(trial => {
  return (
    {
      type: jsPsychAudioKeyboardResponse,
      stimulus: trial.audio,
      prompt: () => {
        return (`
          <div id='${isTouchScreen ? 'countdown-wrapper' : ''}'>
            <div class='stimulus_div'>
              <p class='stimulus'>${trial.count}</p>
            </div>
            ${isTouchScreen ? (
                `<div id='countdown-arrows-wrapper'>
                  <div class="countdown-arrows">
                    <img class='btn-arrows' src=${imgContent.staticLeftKey} alt='left arrow' />
                  </div>
                  <div class="countdown-arrows">
                    <img class='btn-arrows' src=${imgContent.staticRightKey} alt='right arrow' />
                  </div>
                </div>`
            ) : (
                `<img class="lower" src="${imgContent.arrowkeyLex}" alt="arrow keys">`
            )}
          </div>
          `
        )
      },
      choices: "NO_KEYS",
      trial_duration: 1000,
      data: {
        task: 'countdown'
      }
    }
  )
})


export const countdown_trials = {
  timeline: countDownTrials
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
