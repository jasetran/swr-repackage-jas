import jsPsychAudioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";
import { jsPsych, initStore, updateProgressBar } from "./config";
import { imgContent, audioContent } from "./preload";

const store = initStore();
const startTime = new Date(store("startTime"));

/* define instructions trial */
const intro_1 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.intro1,
  choices: "ALL_KEYS",
  response_allowed_while_playing: store("testingOnly"),
  prompt: `<h1>Welcome to the world of Lexicality!</h1>
        <div class="row">
          <div class="column_1">
            <img class="characterleft" src="${imgContent.wizardMagic}" height="320px" alt="animation of a wizard waving a magic wand">
            </div>
          <div class="column_3">
            <p class="middle"> You are a wizard searching for the gate that will return you to your home on Earth. To reach the gate, you must journey over lands ruled by magical guardians.</p>
            <p class="middle"> In order for the guardians to let you pass through the land, you will have to tell the difference between made-up words and real words.&nbsp;</p>
          </div>
        </div>
        <div class="button">Press <span class="yellow">ANY KEY</span> to continue </div>`,
  data: {
    start_time: startTime.toLocaleString("PST"),
    start_time_unix: startTime.getTime(),
  },
};

const intro_2 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.intro2,
  response_allowed_while_playing: store("testingOnly"),
  prompt: `
    <h1>A real or made-up word will flash very quickly <br/> at the center of the screen.</h1>
    <div class="row">
     <div class="column_2_upper" style="background-color:#f2f2f2;">
       <p>The made-up words might look like English words, but they do not mean anything in English. For example, laip, bove, or cigbert are made-up words. <span class="orange"><b>If you see a made-up word, press the LEFT ARROW KEY.</b></span></p>
     </div>
     <div class="column_2_upper" style="background-color:#f2f2f2;">
       <p> The real words will be ones you recognize. They are real English words like is, and, basket, or lion. <span class="blue"><b> If you see a real word, press the RIGHT ARROW KEY.</b></span></p>
     </div>
    </div>
    <div class="row">
     <div class="column_2_lower" style="background-color:#f2f2f2;">
     <img width="100%" src="${imgContent.arrowLeftP2}" alt="Magic Word, Press the Left Arrow Key" align="right">
     </div>
     <div class="column_2_lower" style="background-color:#f2f2f2; height: 180px;">
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
  response_allowed_while_playing: store("testingOnly"),
  prompt: `
    <h1>Let us review which key we press for made-up words and real words.</h1>
    <div>
        <img src="${imgContent.keyP3}" style= "margin-top: 10%" alt="arrow keys">
        <p class = "center"> Try to be as accurate as possible. </p>
        <p class = "center">Some words will be hard, and that&#39s okay. If you&#39re not sure, just give your best guess! </p>
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
  response_allowed_while_playing: store("testingOnly"),
  prompt: `
    <h1>Great work, you are ready to begin the journey! </h1>
      <div>
        <p class="center"> You will earn gold coins along the way.</p>
        <img style="position: relative; top: 100px;" width="400px" src="${imgContent.goldCoin}" alt="gold">
      </div>
    <div class="button">Press <span class="yellow">ANY KEY</span> to begin</div>`,
  choices: "ALL_KEYS",
};

// define practice feedback trial
const practice_feedback_left = {
  type: jsPsychAudioKeyboardResponse,
  response_allowed_while_playing: store("testingOnly"),
  stimulus: () => store("practiceFeedbackAudio"),
  prompt: function () {
    return `
<div class = stimulus_div><p class="feedback"><span class=${responseColor}>You pressed the ${responseLR} arrow key, which is for ${answerRP} words! </span>
<br></br>${jsPsych.timelineVariable("stimulus")}<span class=${answerColor}>  is a ${correctRP}  word. Press ${correctLR} arrow key to continue.</span></p></div>
<img class="lower" src= "${imgContent.arrowkeyLexLeft}" alt="arrow keys" style=" width:698px; height:120px">
      `;
  },
  choices: ["ArrowLeft"],
  on_start: function () {
    console.log("practice_feedback_lef", store("practiceFeedbackAudio"));
  },
};

const practice_feedback_right = {
  type: jsPsychAudioKeyboardResponse,
  response_allowed_while_playing: store("testingOnly"),
  stimulus: () => store("practiceFeedbackAudio"),
  prompt: function () {
    return `<div class = stimulus_div>
\t<p class="feedback"><span class=${responseColor}>You pressed the ${responseLR} arrow key, which is for ${answerRP} words! </span>
<br></br>${jsPsych.timelineVariable("stimulus")}<span class=${answerColor}>  is a ${correctRP}  word. Press ${correctLR} arrow key to continue.</span></p>
</div><img class="lower" src= "${imgContent.arrowkeyLexRight}" alt="arrow keys" style=" width:698px; height:120px"> 
      `;
  },
  choices: ["ArrowRight"],
  on_start: function () {},
};

export const if_node_left = {
  timeline: [practice_feedback_left],
  conditional_function: function () {
    return correctRP === "made-up";
  },
};

export const if_node_right = {
  timeline: [practice_feedback_right],
  conditional_function: function () {
    return correctRP === "real";
  },
};

// Countdown trial
const countdown_trial_3 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.countdown3,
  prompt: `
        <div class = stimulus_div><p class = 'stimulus' style="font-size:60px;">3</p></div>
        <img class="lower" src="${imgContent.arrowkeyLex}" alt="arrow keys" style=" width:698px; height:120px">`,
  choices: "NO_KEYS",
  trial_duration: 1000,
  data: {
    task: "countdown",
  },
  on_finish: updateProgressBar,
};

const countdown_trial_2 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.countdown2,
  prompt: function () {
    return `<div class = stimulus_div><p class = 'stimulus' style="font-size:60px;">2</p></div>
   <img class="lower" src="${imgContent.arrowkeyLex}" alt="arrow keys" style=" width:698px; height:120px">`;
  },
  choices: "NO_KEYS",
  trial_duration: 1000,
  data: {
    task: "countdown",
  },
  on_finish: updateProgressBar,
};

const countdown_trial_1 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.countdown1,
  prompt: function () {
    return `<div class = stimulus_div><p class = 'stimulus' style="font-size:60px;">1</p></div>
<img class="lower" src="${imgContent.arrowkeyLex}" alt="arrow keys" style=" width:698px; height:120px">`;
  },
  choices: "NO_KEYS",
  trial_duration: 1000,
  data: {
    task: "countdown",
  },
  on_finish: updateProgressBar,
};

const countdown_trial_0 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.countdown0,
  prompt: function () {
    return `<div class = stimulus_div><p class = 'stimulus' style="font-size:60px;">1</p></div>
<img class="lower" src="${imgContent.arrowkeyLex}" alt="arrow keys" style=" width:698px; height:120px">`;
  },
  choices: "NO_KEYS",
  trial_duration: 1000,
  data: {
    task: "countdown",
  },
  on_finish: updateProgressBar,
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
  on_finish: updateProgressBar,
};

export const if_coin_tracking = {
  timeline: [coin_tracking_feedback],
  conditional_function: function () {
    if (Boolean(currentTrialCorrect) && coinTrackingIndex >= 10) {
      coinTrackingIndex = 0;
      return true;
    }
    coinTrackingIndex += 1;
    return false;
  },
};
