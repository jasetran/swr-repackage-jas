import { initJsPsych } from "jspsych";
import Papa from "papaparse";
import store from "store2";

const randomAssignment = (mode) => {
  if (mode === "test") {
    return (Math.random() < 0.5) ? 'testAdaptive' : 'testRandom';
  } if (mode === "full") {
    return (Math.random() < 0.5) ? 'fullAdaptive' : 'fullRandom';
  } return mode;
};

const stimulusRuleLists = {
  fullRandom: ["random", "random", "random"],
  fullAdaptive: ["adaptive", "adaptive", "adaptive"],
  shortAdaptive: ["adaptive", "adaptive", "adaptive"],
  longAdaptive: ["adaptive", "adaptive", "adaptive"],
  demo: ["demo"],
  test: ["adaptive", "adaptive", "adaptive"],
};

// Stimulus timing options in milliseconds
const stimulusTimeOptions = [null, 350, 1000, 2000];
// Fixation presentation time options in milliseconds
const fixationTimeOptions = [1000, 2000, 25000];
// Trial completion time options in milliseconds
const trialTimeOptions = [null, 5000, 8000, 100000];

/* set user mode */
const queryString = new URL(window.location).search;
const urlParams = new URLSearchParams(queryString);
const userMode = randomAssignment(urlParams.get("mode")) || "shortAdaptive";
const taskVariant = urlParams.get("variant") || "pilot";
const pid = urlParams.get("participant");
const schoolId = urlParams.get("schoolId");
const skip = urlParams.get("skip");
const audioFeedback = urlParams.get("feedback") || "binary";
const numAdaptive = urlParams.get("numAdaptive") || (userMode === "shortAdaptive" ? 85 : 150);
const numNew = urlParams.get("numNew") || (userMode === "shortAdaptive" ? 15 : 25);
export const labId = urlParams.get('labId');
const gameId = urlParams.get('gameId') || null;

// eslint-disable-next-line max-len
const divideTrial2Block = (n1, n2, nBlock) => {
  const n = parseInt(n1, 10) + parseInt(n2, 10);
  return [Math.floor(n / nBlock), Math.floor(n / nBlock), n - (2 * Math.floor(n / nBlock))];
};

export const stimulusCountLists = {
  fullAdaptive: [82, 82, 81],
  fullRandom: [82, 82, 81],
  shortAdaptive: divideTrial2Block(numAdaptive, numNew, 3),
  longAdaptive: divideTrial2Block(numAdaptive, numNew, 3),
  demo: [84],
  test: [6, 4, 4],
};

const redirect = () => {
  if (gameId === null) {
    // If no game token was passed, we refresh the page rather than
    // redirecting back to the dashboard
    // window.location.reload();
  } else {
    // Else, redirect back to the dashboard with the game token that
    // was originally provided
    window.location.href = `https://reading.stanford.edu/?g=${gameId}&c=1`;
  }
};

const configTaskInfo = () => {
  let taskInfo;
  if (userMode === "shortAdaptive") {
    taskInfo = {
      taskId: "swr",
      taskName: "Single Word Recognition",
      variantName: userMode,
      taskDescription:
        "This is a simple, two-alternative forced choice, time limited lexical decision task measuring the automaticity of word recognition. ROAR-SWR is described in further detail at https://doi.org/10.1038/s41598-021-85907-x",
      variantDescription:
        "This variant uses 3 short adaptive blocks mixed with validated and new words.",
      blocks: [
        {
          blockNumber: 0,
          trialMethod: "adaptive",
          corpus: "full245",
        },
        {
          blockNumber: 1,
          trialMethod: "adaptive",
          corpus: "full245",
        },
        {
          blockNumber: 2,
          trialMethod: "adaptive",
          corpus: "full245",
        },
      ],
    };
  } else if (userMode === "longAdaptive") {
    taskInfo = {
      taskId: "swr",
      taskName: "Single Word Recognition",
      variantName: userMode,
      taskDescription:
        "This is a simple, two-alternative forced choice, time limited lexical decision task measuring the automaticity of word recognition. ROAR-SWR is described in further detail at https://doi.org/10.1038/s41598-021-85907-x",
      variantDescription:
        "This variant uses 3 short adaptive blocks mixed with validated and new words.",
      blocks: [
        {
          blockNumber: 0,
          trialMethod: "adaptive",
          corpus: "full245",
        },
        {
          blockNumber: 1,
          trialMethod: "adaptive",
          corpus: "full245",
        },
        {
          blockNumber: 2,
          trialMethod: "adaptive",
          corpus: "full245",
        },
      ],
    };
  } else if (userMode === "demo") {
    taskInfo = {
      taskId: "swr",
      taskName: "Single Word Recognition",
      variantName: userMode,
      taskDescription:
          "This is a simple, two-alternative forced choice, time limited lexical decision task measuring the automaticity of word recognition. ROAR-SWR is described in further detail at https://doi.org/10.1038/s41598-021-85907-x",
      variantDescription:
          "This variant uses 1 random-ordered full with 60 new words and 24 adaptive-ordered words, each cat-suggested word will be followed by 5 new words.",
      blocks: [
        {
          blockNumber: 0,
          trialMethod: "random",
          corpus: "newCorpusId",
        },
      ],
    };
  } else if (userMode === "fullRandom") {
    taskInfo = {
      taskId: "swr",
      taskName: "Single Word Recognition",
      variantName: userMode,
      taskDescription:
        "This is a simple, two-alternative forced choice, time limited lexical decision task measuring the automaticity of word recognition. ROAR-SWR is described in further detail at https://doi.org/10.1038/s41598-021-85907-x",
      variantDescription:
        "This variant uses fully random design split into 3 game blocks (82 each).",
      blocks: [
        {
          blockNumber: 0,
          trialMethod: "random",
          corpus: "full245",
        },
        {
          blockNumber: 1,
          trialMethod: "random",
          corpus: "full245",
        },
        {
          blockNumber: 2,
          trialMethod: "random",
          corpus: "full245",
        },
      ],
    };
  } else if (userMode === "fullAdaptive") {
    taskInfo = {
      taskId: "swr",
      taskName: "Single Word Recognition",
      variantName: userMode,
      taskDescription:
        "This is a simple, two-alternative forced choice, time limited lexical decision task measuring the automaticity of word recognition. ROAR-SWR is described in further detail at https://doi.org/10.1038/s41598-021-85907-x",
      variantDescription:
        "This variant uses fully adaptive design split into 3 game blocks (82 each).",
      blocks: [
        {
          blockNumber: 0,
          trialMethod: "adaptive",
          corpus: "full245",
        },
        {
          blockNumber: 1,
          trialMethod: "adaptive",
          corpus: "full245",
        },
        {
          blockNumber: 2,
          trialMethod: "adaptive",
          corpus: "full245",
        },
      ],
    };
  } else {
    taskInfo = {
      taskId: "swr",
      taskName: "Single Word Recognition",
      variantName: userMode,
      taskDescription:
          "This is a simple, two-alternative forced choice, time limited lexical decision task measuring the automaticity of word recognition. ROAR-SWR is described in further detail at https://doi.org/10.1038/s41598-021-85907-x",
      variantDescription:
          "This variant is in test mode with 1 adaptive block (10 words), 2 random blocks (4 words each).",
      blocks: [
        {
          blockNumber: 0,
          trialMethod: "adaptive/random",
          corpus: "adaptiveCorpusId/randomCorpusId",
        },
        {
          blockNumber: 1,
          trialMethod: "adaptive/random",
          corpus: "adaptiveCorpusId/randomCorpusId",
        },
        {
          blockNumber: 2,
          trialMethod: "adaptive/random",
          corpus: "adaptiveCorpusId/randomCorpusId",
        },
      ],
    };
  }
  return taskInfo;
};

export const taskInfo = configTaskInfo();

export const config = {
  userMode: userMode,
  pid: pid,
  labId: labId,
  schoolId: schoolId,
  taskVariant: taskVariant,
  userMetadata: {},
  testingOnly: skip === null,
  audioFeedback: audioFeedback,

  // after how many adaptive trials, the test gives 1 new word
  adaptive2new: Math.floor(numAdaptive / numNew),

  // set order and rule for the experiment
  stimulusRuleList: stimulusRuleLists[userMode],

  // Number of trials in each block of the experiment
  stimulusCountList: stimulusCountLists[userMode],

  // set number of trials for practice block
  totalTrialsPractice: 5,

  // The number of practice trials that will keep stimulus on screen untill participant's input
  countSlowPractice: 2,

  // set number of trials to keep random in adaptive block
  nRandom: 5,

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
  if ((userMode === 'fullAdaptive') || (userMode === 'testAdaptive')) {
    store.session.set("itemSelect", "mfi");
  } else {
    store.session.set("itemSelect", "random");
  }
  store.session.set("practiceIndex", 0);
  // Counting variables
  store.session.set("currentBlockIndex", 0);
  store.session.set("trialNumBlock", 0); // counter for trials in block
  store.session.set("trialNumTotal", 0); // counter for trials in experiment
  store.session.set("demoCounter", 0);
  store.session.set("nextStimulus", null);
  store.session.set("response", "");

  // variables to track current state of the experiment
  store.session.set("currentTrialCorrect", true); // return true or false
  store.session.set("coinTrackingIndex", 0);

  store.session.set("initialized", true);

  return store.session;
};

initStore();

export const jsPsych = initJsPsych({
  show_progress_bar: true,
  auto_update_progress_bar: false,
  message_progress_bar: "Progress Complete",
  on_finish: () => redirect(),
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

export const updateProgressBar = () => {
  const curr_progress_bar_value = jsPsych.getProgressBarCompleted();
  jsPsych.setProgressBar(curr_progress_bar_value + 1 / arrSum(config.stimulusCountList));
};

export const realpseudo2arrow = (realpseudo) =>
  (realpseudo === "real" ? "ArrowRight" : "ArrowLeft");
