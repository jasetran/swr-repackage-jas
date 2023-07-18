import store from "store2";
import { getUserDataTimeline } from "../trials/getUserData.js";
import { enter_fullscreen } from "../trials/fullScreen.js";
import { corpusAll, corpusNew } from "./corpus.js";
import _omitBy from "lodash/omitBy.js";
import _isNull from "lodash/isNull.js";
import _isUndefined from "lodash/isUndefined.js";
import { jsPsych } from "../jsPsych.js";

const makePid = () => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 16; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

const initStore = (config) => {
  if (store.session.has("initialized") && store.local("initialized")) {
    return store.session;
  }
  if ((config.userMode === 'fullAdaptive') || (config.userMode === 'testAdaptive') || (config.userMode === "shortAdaptive") || ((config.userMode === "longAdaptive"))) {
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

  store.session.set("corpusAll", corpusAll); 
  store.session.set("corpusNew", corpusNew);

  return store.session;
};

export const setRandomUserMode = (mode) => {
  if (mode === "test") {
    return (Math.random() < 0.5) ? 'testAdaptive' : 'testRandom';
  } if (mode === "full") {
    return (Math.random() < 0.5) ? 'fullAdaptive' : 'fullRandom';
  } 
  return mode;
};

const stimulusRuleLists = {
  fullRandom: ["random", "random", "random"],
  fullAdaptive: ["adaptive", "adaptive", "adaptive"],
  shortAdaptive: ["adaptive", "adaptive", "adaptive"],
  longAdaptive: ["adaptive", "adaptive", "adaptive"],
  fullItemBank: ['random', 'random', 'random'],
  demo: ["demo"],
  testAdaptive: ["adaptive", "adaptive", "adaptive"],
  testRandom: ["adaptive", "adaptive", "adaptive"],
};

// Stimulus timing options in milliseconds
const stimulusTimeOptions = [null, 350, 1000, 2000];
// Fixation presentation time options in milliseconds
const fixationTimeOptions = [1000, 2000, 25000];
// Trial completion time options in milliseconds
const trialTimeOptions = [null, 5000, 8000, 100000];


// eslint-disable-next-line max-len
const divideTrial2Block = (n1, n2, nBlock) => {
  const n = parseInt(n1, 10) + parseInt(n2, 10);
  return [Math.floor(n / nBlock), Math.floor(n / nBlock), n - (2 * Math.floor(n / nBlock))];
};

export const getStimulusCount = (userMode, numAdaptive, numNew, numValidated) => {
  const stimulusCountMap = {
    fullAdaptive: [82, 82, 81],
    fullRandom: [25, 25, 25],
    shortAdaptive: divideTrial2Block(numAdaptive, numNew, 3),
    longAdaptive: divideTrial2Block(numAdaptive, numNew, 3),
    fullItemBank: divideTrial2Block(numValidated, numNew, 3),
    demo: [84],
    testAdaptive: [6, 4, 4],
    testRandom: [6, 4, 4],
  }

  return stimulusCountMap[userMode]
};


export const initConfig = async (firekit, params, displayElement) => {
  const cleanParams = _omitBy(_omitBy(params, _isNull), _isUndefined);

  const { userMode = 'shortAdaptive',
          pid, 
          labId, 
          schoolId, 
          taskVariant, 
          userMetadata, 
          testingOnly, 
          studyId, 
          classId, 
          urlParams,
          consent,
          audioFeedback,
          language,
          numAdaptive = (userMode === "shortAdaptive" ? 85 : 150),
          numNew = (userMode === "shortAdaptive" ? 15 : 25),
          numValidated = (userMode === "fullItemBank" ? 246 : 100),
          skipInstructions,
          assets,
          bucketURI
  } = cleanParams

  const config = {
          userMode,
          pid, 
          labId, 
          schoolId, 
          taskVariant: taskVariant || "pilot", 
          userMetadata, 
          testingOnly, 
          studyId, 
          classId, 
          urlParams,
          consent: consent || true,
          audioFeedback: audioFeedback || 'binary',
          language,
          skipInstructions,
          numAdaptive,
          numNew,
          numValidated,
          adaptive2new: Math.floor(numAdaptive / numNew),
          stimulusRuleList: stimulusRuleLists[userMode],
          stimulusCountList: getStimulusCount(userMode, numAdaptive, numNew, numValidated),
          totalTrialsPractice: 5,
          countSlowPractice: 2,
          nRandom: 5,

          timing: {
            stimulusTimePracticeOnly: stimulusTimeOptions[0], // null as default for practice trial only
            stimulusTime: stimulusTimeOptions[1],
            fixationTime: fixationTimeOptions[0],
            trialTimePracticeOnly: trialTimeOptions[0],
            trialTime: trialTimeOptions[0],
          },
          startTime: new Date(),
          userMetadata: {},
          firekit,
          displayElement: displayElement || null,
          assets,
          bucketURI
  }


  if (config.pid !== null) {
    // const userInfo = {
    //   id: config.pid,
    //   studyId: config.studyId || null,
    //   classId: config.classId || null,
    //   schoolId: config.schoolId || null,
    //   userMetadata: config.userMetadata,
    // };

    await config.firekit.updateUser({ assessmentPid: config.pid, ...userMetadata });
  }

  return config;
}

export const initRoarJsPsych = (config) => {

  if (config.displayElement) {
    jsPsych.opts.display_element = config.display_element
  }

  // Extend jsPsych's on_finish and on_data_update lifecycle functions to mark the
  // run as completed and write data to Firestore, respectively.
  const extend = (fn, code) =>
    function () {
      // eslint-disable-next-line prefer-rest-params
      fn.apply(fn, arguments);
      // eslint-disable-next-line prefer-rest-params
      code.apply(fn, arguments);
    };

  jsPsych.opts.on_finish = extend(jsPsych.opts.on_finish, () => {
    config.firekit.finishRun();
    if (config.experimentFinished) {
      config.experimentFinished()
    }
  });

  const timingData = {
    start_time_utc0: config.startTime.toISOString(),
    start_time_unix: config.startTime.getTime(),
    start_time_local: config.startTime.toLocaleString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  jsPsych.opts.on_data_update = extend(jsPsych.opts.on_data_update, (data) => {
    if (data.save_trial) {
      config.firekit.writeTrial({
        timingData,
        userInfo: config.firekit.userInfo,
        ...data,
      });
    }
  });

  // Add a special error handler that writes javascript errors to a special trial
  // type in the Firestore database
  window.addEventListener('error', (e) => {
    const { msg, url, lineNo, columnNo, error } = e;

    config.firekit?.writeTrial({
      task: 'error',
      lastTrial: jsPsych.data.getLastTrialData().trials[0],
      message: String(msg),
      source: url || null,
      lineNo: String(lineNo || null),
      colNo: String(columnNo || null),
      error: JSON.stringify(error || null),
      timeStamp: new Date().toISOString(),
    });
  });

  initStore(config);

  // return jsPsych;
};

export const initRoarTimeline = (config) => {
  // If the participant's ID was **not** supplied through the query string, then
  // ask the user to fill out a form with their ID, class and school.

  const initialTimeline = [ enter_fullscreen, ...getUserDataTimeline]
  
  const beginningTimeline = {
    timeline: initialTimeline,
    on_timeline_finish: async () => {
      // eslint-disable-next-line no-param-reassign
      config.pid = config.pid || makePid();
      await config.firekit.updateUser({ assessmentPid: config.pid, labId: config.labId, ...config.userMetadata });
    },
  };

  return beginningTimeline;
};


// export const initializeRoarFireKit = async () => {
//   config.pid = config.pid || makePid();
//   let prefix = config.pid.split("-")[0];
//   if (prefix === config.pid || config.taskVariant !== 'school'){
//     prefix = "pilot";
//   }
//   const userInfo = {
//     id: config.pid,
//     studyId: config.taskVariant + "-" + config.userMode,
//     schoolId: config.schoolId || prefix,
//     userMetadata: config.userMetadata,
//   };

//   firekit = new RoarFirekit({
//     config: roarConfig,
//     userInfo: userInfo,
//     taskInfo,
//   });
//   await firekit.startRun();
// }