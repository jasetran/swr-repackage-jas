// import { QuestCreate } from "jsQUEST";
import { initJsPsych } from "jspsych";
import Papa from "papaparse";
import store from "store2";

const stimulusRuleLists = {
  beginner: ["random", "adaptive"],
  regularRandom: ["random", "random", "random"], //three adaptive blocks
  regularAdaptive: ["adaptive", "random", "random"], //1 adaptive, 2 random blocks
  test: ["adaptive", "random", "random"],
  demo: ["demo"]
};

const stimulusCountLists = {
  beginner: [84, 28],
  regularRandom: [84, 84, 84],
  regularAdaptive: [84, 84, 84],
  test: [10, 4, 4],
  demo: [84]
};

const numAdaptiveTrials = {
  beginner: 0,
  regularRandom: 0,
  regularAdaptive: 60,
  test: 8,
  demo: 24,
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
const userMode = urlParams.get("mode") || "regularRandom";
const taskVariant = urlParams.get("variant")|| "pilot";
const pid = urlParams.get("participant");

function configTaskInfo() {
  let taskInfo;
  if (userMode === "regularRandom"){
    taskInfo = {
      taskId: "swr",
      taskName: "Single Word Recognition",
      variantName: taskVariant + "-" + userMode,
      taskDescription:
          "This is a simple, two-alternative forced choice, time limited lexical decision task measuring the automaticity of word recognition. ROAR-SWR is described in further detail at https://doi.org/10.1038/s41598-021-85907-x",
      variantDescription:
          "This variant uses 3 random-ordered blocks.",
      blocks: [
        {
          blockNumber: 0,
          trialMethod: "random",
          corpus: "randomCorpusId",
        },
        {
          blockNumber: 1,
          trialMethod: "random",
          corpus: "randomwCorpusId",
        },
        {
          blockNumber: 2,
          trialMethod: "random",
          corpus: "random1CorpusId",
        },
      ],
    };
  } else if (userMode === "regularAdaptive") {
    taskInfo = {
      taskId: "swr",
      taskName: "Single Word Recognition",
      variantName: taskVariant + "-" + userMode,
      taskDescription:
          "This is a simple, two-alternative forced choice, time limited lexical decision task measuring the automaticity of word recognition. ROAR-SWR is described in further detail at https://doi.org/10.1038/s41598-021-85907-x",
      variantDescription:
          "This variant uses 1 adaptive-ordered and 2 random-order blocks. In the adaptive blocks, there are 60 validated words, and 24 new words.",
      blocks: [
        {
          blockNumber: 0,
          trialMethod: "adaptive",
          corpus: "adaptiveCorpusId",
        },
        {
          blockNumber: 1,
          trialMethod: "random",
          corpus: "randomCorpusId",
        },
        {
          blockNumber: 2,
          trialMethod: "random",
          corpus: "randomCorpusId",
        },
      ],
    };
  } else if (userMode === "beginner") {
    taskInfo = {
      taskId: "swr",
      taskName: "Single Word Recognition",
      variantName: taskVariant + "-" + userMode,
      taskDescription:
          "This is a simple, two-alternative forced choice, time limited lexical decision task measuring the automaticity of word recognition. ROAR-SWR is described in further detail at https://doi.org/10.1038/s41598-021-85907-x",
      variantDescription:
          "This variant uses 1 random-ordered full block and 1 random-ordered short block with 28 new words.",
      blocks: [
        {
          blockNumber: 0,
          trialMethod: "random",
          corpus: "randomCorpusId",
        },
        {
          blockNumber: 1,
          trialMethod: "new",
          corpus: "newCorpusId",
        },
      ],
    };
  } else if (userMode === "demo") {
    taskInfo = {
      taskId: "swr",
      taskName: "Single Word Recognition",
      variantName: taskVariant + "-" + userMode,
      taskDescription:
          "This is a simple, two-alternative forced choice, time limited lexical decision task measuring the automaticity of word recognition. ROAR-SWR is described in further detail at https://doi.org/10.1038/s41598-021-85907-x",
      variantDescription:
          "This variant uses 1 random-ordered full with 60 new words and 24 quest-ordered words, each quest-suggested word will be followed by 5 new words.",
      blocks: [
        {
          blockNumber: 0,
          trialMethod: "random",
          corpus: "newCorpusId",
        },
      ],
    };
  } else {
    taskInfo = {
      taskId: "swr",
      taskName: "Single Word Recognition",
      variantName: taskVariant + "-" + userMode,
      taskDescription:
          "This is a simple, two-alternative forced choice, time limited lexical decision task measuring the automaticity of word recognition. ROAR-SWR is described in further detail at https://doi.org/10.1038/s41598-021-85907-x",
      variantDescription:
          "This variant is in test mode with 1 adaptive block (10 words), 2 random blocks (4 words each).",
      blocks: [
        {
          blockNumber: 0,
          trialMethod: "adaptive",
          corpus: "adaptiveCorpusId",
        },
        {
          blockNumber: 1,
          trialMethod: "random",
          corpus: "randomCorpusId",
        },
        {
          blockNumber: 2,
          trialMethod: "random",
          corpus: "randomCorpusId",
        },
      ],
    };
  }
  return taskInfo;
}

export const taskInfo = configTaskInfo();

export const config = {
  userMode: userMode,
  pid: pid,
  sessionId: taskVariant,
  testingOnly: userMode === "test" || userMode === "demo" || taskVariant === "validate",

  // set order and rule for the experiment
  stimulusRuleList: stimulusRuleLists[userMode],

  // Number of trials in each block of the experiment
  stimulusCountList: stimulusCountLists[userMode],

  // number of adaptive trials
  totalAdaptiveTrials: numAdaptiveTrials[userMode],

  // set number of trials for practice block
  totalTrialsPractice: 5,

  // The number of practice trials that will keep stimulus on screen untill participant's input
  countSlowPractice:2,

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
  if (store.session.has("initialized") && store.local("initialized")) {
    return store.session;
  }

  store.session.set("practiceIndex", 0);

  // Counting vairables
  store.session.set("count_adaptive_trials", 0);
  store.session.set("currentBlockIndex", "");
  store.session.set("stimulusRule", "");
  store.session.set('stimulusLists', "");
  store.session.set("stimulusIndex", { corpusA: 0, corpusB: 0, corpusC: 0, corpusNew: 0 });
  store.session.set("trialNumBlock", 0); // counter for trials in block
  store.session.set("trialNumTotal", 0); // counter for trials in experiment
  store.session.set("demoCounter", 0);
  store.session.set("nextStimulus", []);
  store.session.set("response", "");

  // variables to track current state of the experiment
  store.session.set("currentStimulus", "");
  store.session.set("currentBlock", "");
  store.session.set("currentTrialCorrect", true); // return true or false

  store.session.set("trialCorrectAns", ""); // for storing the correct answer on a given trial
  store.session.set("startingDifficulty", 0); // where we begin in terms of difficulty
  store.session.set("currentDifficulty", 0); // to reference where participants currently are
  store.session.set("difficultyHistory", []); // easy logging of the participant's trajectory
  store.session.set("coinTrackingIndex", 0);

  store.session.set("initialized", true);

  store.session.set("myquest", "");

  return store.session;
};

initStore();

export const jsPsych = initJsPsych({
  show_progress_bar: true,
  auto_update_progress_bar: false,
  message_progress_bar: "Progress Complete",
  on_finish: () => {
    // jsPsych.data.displayData();
    if (userMode !== "demo"){
      if (taskVariant === "validate") {
        window.location.href = "https://reading.stanford.edu?g=910&c=1";
      } else {
        window.location.href = "https://reading.stanford.edu?g=901&c=1";
      }
    }
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
export const questConfig = {
  tGuess: 0,
  tGuessSd: 2,
  pThreshold: 0.75,
  beta: 1,
  delta: 0.05,
  gamma: 0.5,
};

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
