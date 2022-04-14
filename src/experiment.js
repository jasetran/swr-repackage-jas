/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
// QUEST imports
import { QuestUpdate, QuestQuantile, QuestCreate } from "jsQUEST";

// jsPsych imports
import jsPsychSurveyText from "@jspsych/plugin-survey-text";
import jsPsychFullScreen from "@jspsych/plugin-fullscreen";
import jsPsychHtmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import store from "store2";

// Import necessary for async in the top level of the experiment script
// TODO Adam: Is this really necessary
import "regenerator-runtime/runtime";

// Firebase imports
import { RoarFirekit } from "@bdelab/roar-firekit";
import { rootDoc } from "./firebaseConfig";

// Local modules
import {
  jsPsych, config, updateProgressBar, questConfig, findClosest,
} from "./config";
import { if_audio_response_correct, if_audio_response_wrong } from "./audio";
import { imgContent, preload_trials } from "./preload";
import {
  introduction_trials, post_practice_intro, countdown_trials, if_coin_tracking,
} from "./introduction";
import {
  if_node_left, if_node_right, setup_fixation_practice, lexicality_test_practice,
} from "./practice";
import {
  mid_block_page_list, post_block_page_list, final_page,
} from "./gameBreak";
import { stimulusLists, blockNew, blockPractice } from "./corpus";
import jsPsychPavlovia from "./jsPsychPavlovia";

// CSS imports
// import "jspsych/css/jspsych.css";
import "./css/game_v4.css";

let firekit;

store.session.set("stimulusLists", stimulusLists);

// TODO: consider editing taskInfo based on config
const taskInfo = {
  taskId: "swr",
  taskName: "Single Word Recognition",
  variantName: "quest",
  taskDescription:
    "This is a simple, two-alternative forced choice, time limited lexical decision task measuring the automaticity of word recognition. ROAR-SWR is described in further detail at https://doi.org/10.1038/s41598-021-85907-x",
  variantDescription:
    "This variant uses adaptive stimulus selection using the Quest algorithm.",
  blocks: [
    {
      blockNumber: 0,
      trialMethod: "practice",
      corpus: "practiceCorpusId",
    },
    {
      blockNumber: 1,
      trialMethod: "adaptive",
      corpus: "adaptiveCorpusId",
    },
    {
      blockNumber: 2,
      trialMethod: "random",
      corpus: "newCorpusId",
    },
    {
      blockNumber: 3,
      trialMethod: "random",
      corpus: "random1CorpusId",
    },
    {
      blockNumber: 4,
      trialMethod: "random",
      corpus: "random2CorpusId",
    },
  ],
};

if (config.pid) {
  const minimalUserInfo = {
    id: config.pid,
    studyId: config.sessionId,
  };

  firekit = new RoarFirekit({
    rootDoc,
    userInfo: minimalUserInfo,
    taskInfo,
  });

  await firekit.startRun();
}

const timeline = [];

/* init connection with pavlovia.org */
const pavlovia_init = {
  type: jsPsychPavlovia,
  command: "init",
};

preload_trials.forEach((trial) => {
  timeline.push(trial);
});

const pavlovia_finish = {
  type: jsPsychPavlovia,
  command: "finish",
};

// add introduction trials
const enter_fullscreen = {
  type: jsPsychFullScreen,
  fullscreen_mode: true,
};

// collect participant id
const survey_pid = {
  type: jsPsychSurveyText,
  questions: [
    { prompt: "Please enter your User ID", name: "pid", required: true },
  ],
  on_finish: function (data) {
    config.pid = data.response.pid;
  },
};

const if_get_pid = {
  timeline: [survey_pid],
  conditional_function: function () {
    return Boolean(config.pid) !== true;
  },
  on_timeline_finish: async () => {
    const minimalUserInfo = { id: config.pid, studyId: config.sessionId };

    firekit = new RoarFirekit({
      rootDoc,
      userInfo: minimalUserInfo,
      taskInfo,
    });

    await firekit.startRun();
  },
};

const extend = (fn, code) => function () {
  // eslint-disable-next-line prefer-rest-params
  fn.apply(fn, arguments);
  // eslint-disable-next-line prefer-rest-params
  code.apply(fn, arguments);
};

jsPsych.opts.on_finish = extend(jsPsych.opts.on_finish, () => {
  firekit.finishRun();
});

jsPsych.opts.on_data_update = extend(
  jsPsych.opts.on_data_update,
  (data) => {
    if (["test_response", "practice_response"].includes(data.task)) {
      firekit?.writeTrial(data);
    }
  },
);

/* init connection with pavlovia.org */
const isOnPavlovia = window.location.href.includes("run.pavlovia.org");

if (isOnPavlovia) {
  timeline.push(pavlovia_init);
}

timeline.push(if_get_pid);
timeline.push(enter_fullscreen);
timeline.push(introduction_trials);
timeline.push(countdown_trials);

// debrief trials
const debrief_block = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    const trials = jsPsych.data.get().filter({ task: "test_response" });
    const correct_trials = trials.filter({ correct: true });
    const incorrect_trials = trials.filter({ correct: false });
    const accuracy = Math.round((correct_trials.count() / trials.count()) * 100);
    const rt = Math.round(correct_trials.select("rt").mean());
    const irt = Math.round(incorrect_trials.select("rt").mean());

    return `<p>You responded correctly on ${accuracy}% of the trials.</p>
          <p>Your average response time on correct trials was ${rt}ms.</p>
          <p>Your average response time on incorrect trials was ${irt}ms.</p>
          <p>Press any key to complete the experiment. Thank you!</p>`;
  },
};

function updateQuest() {
  let closestIndex;
  let resultStimulus;
  let currentCorpus;
  let corpusType;
  const randomBoolean = Math.random() < 0.5;
  corpusType = randomBoolean ? "corpus_real" : "corpus_pseudo";
  currentCorpus = store.session("stimulusLists")[store.session("currentBlockIndex")][corpusType];
  if (currentCorpus.length < 1) {
    if (corpusType === "corpus_pseudo") {
      corpusType = "corpus_real";
    } else {
      corpusType = "corpus_pseudo";
    }
    currentCorpus = store.session("stimulusLists")[store.session("currentBlockIndex")][corpusType];
  }
  if (store.session("stimulusIndex")[store.session("currentBlock")] === 0) {
    store.session.set("myquest", QuestCreate(
      questConfig.tGuess,
      questConfig.tGuessSd,
      questConfig.pThreshold,
      questConfig.beta,
      questConfig.delta,
      questConfig.gamma,
    ));
    const tTest = QuestQuantile(store.session("myquest"));
    closestIndex = findClosest(currentCorpus, tTest);
    resultStimulus = currentCorpus[closestIndex];
  } else {
    store.session.set("myquest", QuestUpdate(store.session("myquest"), store.session("nextStimulus").difficulty, store.session("response")));
    const tTest = QuestQuantile(store.session("myquest"));
    closestIndex = findClosest(currentCorpus, tTest);
    const d_list = [];
    currentCorpus.forEach((item) => {
      d_list.push(item.difficulty);
    });
    resultStimulus = currentCorpus[closestIndex];
  }

  const copyStimulusLists = store.session("stimulusLists");
  copyStimulusLists[store.session("currentBlockIndex")][corpusType].splice(closestIndex, 1);
  store.session.set("stimulusLists", copyStimulusLists);
  return resultStimulus;
}

function getStimulus() {
  let resultStimulus;
  const currentBlock = store.session("currentBlock");
  if (store.session("stimulusRule") === "random") {
    // console.log("this is random");
    resultStimulus = store.session("stimulusLists")[store.session("currentBlockIndex")].corpus_random[
      store.session("stimulusIndex")[currentBlock]
    ];

    // store.session.set("stimulusIndex", {store.session("currentBlock"):
    // store.session("currentBlock") + 1});
    const copyStimulusIndex = store.session("stimulusIndex");
    copyStimulusIndex[currentBlock] += 1;
    store.session.set("stimulusIndex", copyStimulusIndex);
  } else {
    const count_adaptive_trials = store.session("count_adaptive_trials");
    if (count_adaptive_trials < config.totalAdaptiveTrials) {
      store.session.set("count_adaptive_trials", count_adaptive_trials + 1);
      // console.log("this is adaptive");
      resultStimulus = updateQuest();
      // stimulusIndex[currentBlock] += 1;
      const copyStimulusIndex = store.session("stimulusIndex");
      copyStimulusIndex[currentBlock] += 1;
      store.session.set("stimulusIndex", copyStimulusIndex);
    } else {
      store.session.set("stimulusRule", "new");
      // console.log("this is new");
      const newword_index = store.session("newword_index");
      resultStimulus = blockNew[newword_index];
      store.session.set("newword_index", newword_index + 1);
    }
  }
  // console.log("getStimulus", store.session("stimulusLists"), store.session("stimulusIndex"));
  return resultStimulus;
}

// set-up screen
const setup_fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    return `<div class = stimulus_div><p class = 'stimulus' style="font-size:60px;">+</p></div>`;
  },
  prompt: `<div><img class="lower" src="${imgContent.arrowkeyLex}" alt="arrow keys" style=" width:698px; height:120px"></div>`,
  choices: "NO_KEYS",
  trial_duration: config.timing.fixationTime,
  data: {
    task: "fixation",
  },
  on_finish: function () {
    store.session.set("nextStimulus", getStimulus()); // get the current stimuli for the trial
    store.session.set("roarTrialNum", store.session.get("roarTrialNum") + 1); // add 1 to the total trial count
  },
};

// This is to track correct trials
function updateCorrectChecker() {
  const trials = jsPsych.data.get().filter({ task: "test_response" });
  const correct_trials = trials.filter({ correct: true });
  console.log(`CORRECT TRIALS COUNT ${correct_trials.count()}`);
}

const lexicality_test = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    return `<div class = stimulus_div><p class = 'stimulus' style="font-size:60px;">${store.session("nextStimulus").stimulus}</p></div>`;
  },
  prompt: `<div></div><img class="lower" src="${imgContent.arrowkeyLex}" alt="arrow keys" style=" width:698px; height:120px"></div>`,
  stimulus_duration: config.timing.stimulusTime,
  trial_duration: config.timing.trialTime,
  choices: ["ArrowLeft", "ArrowRight"],
  data: {
    task: "test_response" /* tag the test trials with this taskname so we can filter data later */,
    start_time: config.startTime.toLocaleString("PST"),
    start_time_unix: config.startTime.getTime(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  on_finish: function (data) {
    data.correct = jsPsych.pluginAPI.compareKeys(
      data.response,
      store.session("nextStimulus").correct_response,
    );
    store.session.set("currentTrialCorrect", data.correct);
    if (data.correct) {
      store.session.set("response", 1);
    } else {
      store.session.set("response", 0);
    }
    jsPsych.data.addDataToLastTrial({
      block: store.session("currentBlockIndex"),
      corpusId: store.session("currentBlock"),
      word: store.session("nextStimulus").stimulus,
      correct: data.correct,
      correctResponse: store.session("nextStimulus").correct_response,
      difficulty: store.session("nextStimulus").difficulty,
      stimulusRule: store.session("stimulusRule"),
      trialCountTotal: store.session("roarTrialNum"),
      // trialCountBlock:store.session("stimulusIndex")[store.session("currentBlock")],
      pid: config.pid,
    });
    updateCorrectChecker();
    updateProgressBar();
  },
};

const exit_fullscreen = {
  type: jsPsychFullScreen,
  fullscreen_mode: false,
  delay_after: 0,
};

async function roarBlocks() {
  // the core procedure
  function pushPracticeToTimeline(array) {
    array.forEach((element) => {
      const block = {
        timeline: [
          setup_fixation_practice,
          lexicality_test_practice,
          if_audio_response_correct,
          if_audio_response_wrong,
          if_node_left,
          if_node_right,
        ],
        timeline_variables: [element],
      };
      timeline.push(block);
    });
  }

  pushPracticeToTimeline(blockPractice);
  timeline.push(post_practice_intro);

  const core_procedure = {
    timeline: [
      setup_fixation,
      lexicality_test,
      if_audio_response_correct,
      if_audio_response_wrong,
      if_coin_tracking,
    ],
  };

  const total_roar_mainproc_line = [];

  function pushTrialsToTimeline(stimulusCounts) {
    for (let i = 0; i < stimulusCounts.length; i++) {
      // for each block: add trials
      /* add first half of block */
      total_roar_mainproc_line.push(countdown_trials);
      const roar_mainproc_block_half_1 = {
        timeline: [core_procedure],
        conditional_function: function () {
          if (stimulusCounts[i] === 0) {
            return false;
          }
          store.session.set("currentBlock", store.session("stimulusLists")[i].name);
          store.session.set("currentBlockIndex", i);
          store.session.set("stimulusRule", config.stimulusRuleList[i]);
          return true;
        },
        repetitions: stimulusCounts[i] / 2,
      };
      total_roar_mainproc_line.push(roar_mainproc_block_half_1);
      total_roar_mainproc_line.push(mid_block_page_list[i]);
      total_roar_mainproc_line.push(countdown_trials);
      /* add second half of block */
      const roar_mainproc_block_half_2 = {
        timeline: [core_procedure],
        conditional_function: function () {
          return stimulusCounts[i] !== 0;
        },
        repetitions: stimulusCounts[i] / 2,
      };
      total_roar_mainproc_line.push(roar_mainproc_block_half_2);
      if (i < stimulusCounts.length - 1) {
        total_roar_mainproc_line.push(post_block_page_list[i]);
      }
    }
  }

  pushTrialsToTimeline(config.stimulusCountList);

  const total_roar_mainproc = {
    timeline: total_roar_mainproc_line,
  };

  timeline.push(total_roar_mainproc);
  timeline.push(final_page);

  // timeline.push(debrief_block);
  timeline.push(exit_fullscreen);

  if (isOnPavlovia) {
    timeline.push(pavlovia_finish);
  }

  jsPsych.run(timeline);
}

roarBlocks();
