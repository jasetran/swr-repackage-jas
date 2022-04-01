import { QuestCreate } from "jsQUEST";
import { initJsPsych } from "jspsych";
import Papa from "papaparse";
import store from "store2";

const stimulusRuleLists = {
  beginner: ["random", "adaptive"],
  regular: ["adaptive", "random", "random"],
  test: ["adaptive", "random", "random"],
};

const stimulusCountLists = {
  beginner: [84, 28],
  regular: [84, 84, 84],
  test: [10, 4, 4],
};

const numAdaptiveTrials = {
  beginner: 0,
  regular: 60,
  test: 8,
};

// Stimulus timing options in milliseconds
const stimulusTimeOptions = [null, 350, 1000, 2000];
// Fixation presentation time options in milliseconds
const fixationTimeOptions = [1000, 2000, 25000];
// Trial completion time options in milliseconds
const trialTimeOptions = [null, 5000, 8000, 100000];

/* set user mode */
// "beginner": block A only with random words, a new block with 28 new words;
// "regular":  3 blocks in random order with one block consisting 56 adaptive
// words and 28 new words
const queryString = new URL(window.location).search;
const urlParams = new URLSearchParams(queryString);
const userMode = urlParams.get("mode");

export const config = {
  userMode: userMode,
  pid: urlParams.get("pid"),
  sessionId: urlParams.get("sessionId"),
  testingOnly: urlParams.get("test")
    ? urlParams.get("test") === "true"
    : false,

  // set order and rule for the experiment
  stimulusRuleList: stimulusRuleLists[userMode],

  // Number of trials in each block of the experiment
  stimulusCountList: stimulusCountLists[userMode],

  // number of adaptive trials
  totalAdaptiveTrials: numAdaptiveTrials[userMode],

  // set number of trials for practice block
  totalTrialsPractice: 5,

  // TODO: Check use of timing in other js files
  timing: {
    stimulusTimePracticeOnly: stimulusTimeOptions[0], // null as default for practice trial only
    stimulusTime: stimulusTimeOptions[1],
    fixationTime: fixationTimeOptions[0],
    trialTimePracticeOnly: trialTimeOptions[0],
    trialTime: trialTimeOptions[0],
  },

  /* record date */
  startTime: new Date(),
};

export const initStore = () => {
  if (store.session.has("initialized") && store.session("initialized")) {
    return store.session;
  }

  store.session.set("practiceIndex", 0);
  // The number of practice trials that will keep stimulus on screen untill participant's input
  store.session.set("countSlowPractice", 2);

  // Counting vairables
  store.session.set("count_adaptive_trials", 0);
  store.session.set("newword_index", 0);
  store.session.set("block_new", "");
  store.session.set("currentBlockIndex", "");
  store.session.set("stimulusRule", "");
  store.session.set("stimulusIndex", { blockA: 0, blockB: 0, blockC: 0 });
  store.session.set("nextStimulus", []);
  store.session.set("response", "");

  store.session.set("responseLR", "");
  store.session.set("answerRP", "");
  store.session.set("correctRP", "");
  store.session.set("answerColor", "");
  store.session.set("responseColor", "");
  store.session.set("arrowDisplay", "");
  store.session.set("correctLR", "");

  // variables to track current state of the experiment
  store.session.set("currentStimulus", "");
  store.session.set("currentBlock", "");
  store.session.set("currentTrialCorrect", ""); // return true or false

  store.session.set("trialCorrectAns", ""); // for storing the correct answer on a given trial
  store.session.set("startingDifficulty", 0); // where we begin in terms of difficulty
  store.session.set("currentDifficulty", 0); // to reference where participants currently are
  store.session.set("difficultyHistory", []); // easy logging of the participant's trajectory
  store.session.set("roarTrialNum", 1); // counter for trials
  store.session.set("coinTrackingIndex", 0);

  return store.session;
};

export const jsPsych = initJsPsych({
  show_progress_bar: true,
  auto_update_progress_bar: false,
  message_progress_bar: "Progress Complete",
  on_finish: function () {
    /* display data on exp end - useful for dev */
    // jsPsych.data.displayData();
  },
});

/* simple variable for calculating sum of an array */
const arrSum = (arr) => arr.reduce((a, b) => a + b, 0);

/* csv helper function */
export const readCSV = (url) =>
  new Promise((resolve) => {
    Papa.parse(url, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: function (results) {
        const csv_stimuli = results.data;
        resolve(csv_stimuli);
      },
    });
  });

/* set QUEST param */
const questConfig = {
  tGuess: 2,
  tGuessSd: 1,
  pThreshold: 0.75,
  beta: 1,
  delta: 0.05,
  gamma: 0.5,
};

export const myquest = QuestCreate(
  questConfig.tGuess,
  questConfig.tGuessSd,
  questConfig.pThreshold,
  questConfig.beta,
  questConfig.delta,
  questConfig.gamma,
);

const getClosest = (arr, val1, val2, target) => {
  if (target - arr[val1].difficulty >= arr[val2].difficulty - target) {
    return val2;
  }
  return val1;
};

export const findClosest = (arr, target) => {
  const n = arr.length;
  // Corner cases
  if (target <= arr[0].difficulty) return 0;
  if (target >= arr[n - 1].difficulty) return n - 1;
  // Doing binary search
  let i = 0;
  let j = n;
  let mid = 0;
  while (i < j) {
    mid = Math.ceil((i + j) / 2);
    if (arr[mid].difficulty === target) return mid;
    // If target is less than array
    // element,then search in left
    if (target < arr[mid].difficulty) {
      // If target is greater than previous
      // to mid, return closest of two
      if (mid > 0 && target > arr[mid - 1].difficulty) {
        return getClosest(arr, mid - 1, mid, target);
      }
      // Repeat for left half
      j = mid;
    } else {
      // If target is greater than mid
      if (mid < n - 1 && target < arr[mid + 1].difficulty) {
        return getClosest(arr, mid, mid + 1, target);
      }
      i = mid + 1; // update i
    }
  }
  // Only single element left after search
  return mid;
};

export const updateProgressBar = () => {
  const curr_progress_bar_value = jsPsych.getProgressBarCompleted();
  jsPsych.setProgressBar(curr_progress_bar_value + 1 / arrSum(config.stimulusCountList));
};

export const realpseudo2arrow = (realpseudo) =>
  (realpseudo === "real" ? "ArrowRight" : "ArrowLeft");
