// QUEST imports
import { QuestUpdate, QuestQuantile } from "jsQUEST";

// jsPsych imports
import { initJsPsych } from "jspsych";
import jsPsychSurveyText from "@jspsych/plugin-survey-text";
import jsPsychFullScreen from "@jspsych/plugin-fullscreen";
import jsPsychHtmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

// Local modules
import { config, startTime, readCSV, updateProgressBar } from "./config.js";
import { if_audio_response_correct, if_audio_response_wrong } from "./audio.js";
import { preload_trials } from "./preload.js";
import {
  introduction_trials,
  post_practice_intro,
  countdown_trials,
  if_node_left,
  if_node_right,
  if_coin_tracking,
} from "./introduction.js";
import {
  mid_block_page_list,
  post_block_page_list,
  final_page,
} from "./gameBreak";
import jsPsychPavlovia from "./jsPsychPavlovia";

// Firebase imports
import { RoarFirekit } from "@bdelab/roar-firekit";
import { rootDoc } from "./firebaseConfig";

// Import necessary for async in the top level of the experiment script
import "regenerator-runtime/runtime";

// CSS imports
import "jspsych/css/jspsych.css";
import "./css/game_v4.css";

// Word corpus imports
import dataPracticeURL from "./wordlist/ldt-items-practice.csv";
import dataValidatedURL from "./wordlist/ldt-items-difficulties-with-six-levels.csv";
import dataNewURL from "./wordlist/ldt-new-items.csv";

let firekit;

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
  const minimalUserInfo = { id: config.pid, studyId: config.sessionId };

  firekit = new RoarFirekit({
    rootDoc,
    userInfo: minimalUserInfo,
    taskInfo,
  });

  await firekit.startRun();
}

const jsPsych = initJsPsych();
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

/* add introduction trials*/
const enter_fullscreen = {
  type: jsPsychFullScreen,
  fullscreen_mode: true,
};

/* collect participant id */
const survey_pid = {
  type: jsPsychSurveyText,
  questions: [
    { prompt: "Please enter your User ID", name: "pid", required: true },
  ],
  on_finish: function (data) {
    config["pid"] = data.response["pid"];
  },
};

const if_get_pid = {
  timeline: [survey_pid],
  conditional_function: function () {
    return Boolean(config["pid"]) !== true;
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

/* init connection with pavlovia.org */
const isOnPavlovia = window.location.href.includes("run.pavlovia.org");

if (isOnPavlovia) {
  timeline.push(pavlovia_init);
}

timeline.push(if_get_pid);
timeline.push(enter_fullscreen);
timeline.push(introduction_trials);
timeline.push(countdown_trials);

/* debrief trials*/
const debrief_block = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    const trials = jsPsych.data.get().filter({ task: "test_response" });
    const correct_trials = trials.filter({ correct: true });
    const incorrect_trials = trials.filter({ correct: false });
    const accuracy = Math.round(
      (correct_trials.count() / trials.count()) * 100
    );
    const rt = Math.round(correct_trials.select("rt").mean());
    const irt = Math.round(incorrect_trials.select("rt").mean());

    console.log(difficultyHistory);

    return `<p>You responded correctly on ${accuracy}% of the trials.</p>
          <p>Your average response time on correct trials was ${rt}ms.</p>
          <p>Your average response time on incorrect trials was ${irt}ms.</p>
          <p>Press any key to complete the experiment. Thank you!</p>`;
  },
};

//function to update the span as appropriate (using a 2:1 staircase procedure)

/* For Practice Trial Only */
const setup_fixation_practice = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    return `<div class = stimulus_div><p class = 'stimulus' style="font-size:60px;">+</p></div>`;
  },
  prompt: ` <img class="lower" src="assets/arrowkey_lex.png" alt="arrow keys" style=" width:698px; height:120px">`,
  choices: "NO_KEYS",
  trial_duration: config.fixationTime,
  data: {
    task: "fixation",
  },
  on_finish: function () {
    jsPsych.setProgressBar(0);
  },
};

const lexicality_test_practice = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    return `<div class = stimulus_div><p class = 'stimulus' style="font-size:60px;">${jsPsych.timelineVariable(
      "stimulus"
    )}</p></div>`;
  },
  prompt: `<img class="lower" src="assets/arrowkey_lex.png" alt="arrow keys" style=" width:698px; height:120px">`,
  stimulus_duration: function () {
    practiceIndex += 1;
    if (practiceIndex > countSlowPractice) {
      stimulusTimeIndexPracticeOnly = 1;
    }
    return stimulusTime[stimulusTimeIndexPracticeOnly];
  },
  trial_duration: function () {
    return trialTime[trialTimeIndex];
  },
  choices: ["ArrowLeft", "ArrowRight"],
  data: {
    task: "practice_response" /* tag the test trials with this taskname so we can filter data later */,
    word: jsPsych.timelineVariable("stimulus"),
    start_time: startTime.toLocaleString("PST"),
    start_time_unix: startTime.getTime(),
  },
  on_finish: function (data) {
    data.correct = jsPsych.pluginAPI.compareKeys(
      data.response,
      jsPsych.timelineVariable("correct_response")
    );
    currentTrialCorrect = data.correct;
    currentPracStimulus = jsPsych.timelineVariable("stimulus");
    data.correct = jsPsych.pluginAPI.compareKeys(
      data.response,
      jsPsych.timelineVariable("correct_response")
    );
    console.log(data.response);
    if (currentTrialCorrect) {
      practiceFeedbackAudio =
        "audio/practice_feedback_" +
        `${jsPsych.timelineVariable("stimulus")}` +
        "_correct.wav";
    } else {
      practiceFeedbackAudio =
        "audio/practice_feedback_" +
        `${jsPsych.timelineVariable("stimulus")}` +
        "_wrong.wav";
    }
    console.log("practiceFeedbackAudio", practiceFeedbackAudio);
    if (data.response === "arrowleft") {
      responseLR = "left";
      answerRP = "made-up";
      responseColor = "orange";
    } else {
      responseLR = "right";
      answerRP = "real";
      responseColor = "blue";
    }
    if (jsPsych.timelineVariable("correct_response") === "ArrowLeft") {
      correctLR = "left";
      correctRP = "made-up";
      arrowDisplay = "assets/arrowkey_lex_left.gif";
      answerColor = "orange";
    } else {
      correctRP = "real";
      correctLR = "right";
      arrowDisplay = "assets/arrowkey_lex_right.gif";
      answerColor = "blue";
    }

    jsPsych.data.addDataToLastTrial({
      correct_response: jsPsych.timelineVariable("correct_response"),
      block: "Practice",
      pid: config["pid"],
    });

    jsPsych.setProgressBar(0);
    saveToFirebase(
      pid + "/" + uid + "/" + firebase_data_index,
      jsPsych.data.getLastTrialData().values()[0]
    );
    firebase_data_index += 1;
  },
};

//set-up screen
const setup_fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    return `<div class = stimulus_div><p class = 'stimulus' style="font-size:60px;">+</p></div>`;
  },
  prompt: `<div><img class="lower" src="assets/arrowkey_lex.png" alt="arrow keys" style=" width:698px; height:120px"></div>`,
  choices: "NO_KEYS",
  trial_duration: config.fixationTime,
  data: {
    task: "fixation",
  },
  on_finish: function () {
    nextStimulus = getStimuli(); //get the current stimuli for the trial
    difficultyHistory[roarTrialNum - 1] = nextStimulus.difficulty; //log the current span in an array
    roarTrialNum += 1; //add 1 to the total trial count
    updateProgressBar();
  },
};

const lexicality_test = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    return `<div class = stimulus_div><p class = 'stimulus' style="font-size:60px;">${nextStimulus["stimulus"]}</p></div>`;
  },
  prompt: `<div></div><img class="lower" src="assets/arrowkey_lex.png" alt="arrow keys" style=" width:698px; height:120px"></div>`,
  stimulus_duration: config.timing.stimulusTime,
  trial_duration: config.timing.trialTime,
  choices: ["ArrowLeft", "ArrowRight"],
  data: {
    task: "test_response" /* tag the test trials with this taskname so we can filter data later */,
    start_time: startTime.toLocaleString("PST"),
    start_time_unix: startTime.getTime(),
  },
  on_finish: function (data) {
    data.correct = jsPsych.pluginAPI.compareKeys(
      data.response,
      nextStimulus["correct_response"]
    );
    currentTrialCorrect = data.correct;
    if (currentTrialCorrect) {
      response = 1;
    } else {
      response = 0;
    }
    jsPsych.data.addDataToLastTrial({
      word: nextStimulus["stimulus"],
      correct_response: nextStimulus["correct_response"],
      difficulty: nextStimulus["difficulty"],
      block: currentBlock,
      stimulus_rule: stimulusRule,
      pid: config["pid"],
    });

    updateCorrectChecker();
    updateProgressBar();
    saveToFirebase(
      pid + "/" + uid + "/" + firebase_data_index,
      jsPsych.data.getLastTrialData().values()[0]
    );
    firebase_data_index += 1;
  },
};

//This is to track correct trials
function updateCorrectChecker() {
  const trials = jsPsych.data.get().filter({ task: "test_response" });
  const correct_trials = trials.filter({ correct: true });
  console.log("CORRECT TRIALS COUNT " + correct_trials.count());
}

function updateQuest() {
  let closestIndex, resultStimulus, currentCorpus;
  let randomBoolean = Math.random() < 0.5;
  randomBoolean ? (corpusType = "corpus_real") : (corpusType = "corpus_pseudo");
  currentCorpus = stimulusLists[currentBlockIndex][corpusType];
  //block.corpus_real : currentCorpus = block.corpus_pseudo;
  if (stimulusIndex[currentBlock] === 0) {
    const tTest = QuestQuantile(myquest);
    closestIndex = findClosest(currentCorpus, tTest);
    resultStimulus = currentCorpus[closestIndex];
    console.log(
      `target ${tTest} current_difficulty ${resultStimulus.difficulty}`
    );
  } else {
    console.log("update QUEST");
    myquest = QuestUpdate(myquest, nextStimulus.difficulty, response);
    const tTest = QuestQuantile(myquest);
    closestIndex = findClosest(currentCorpus, tTest);
    let d_list = [];
    currentCorpus.forEach(function (item, index) {
      d_list.push(item.difficulty);
    });
    resultStimulus = currentCorpus[closestIndex];
    console.log(
      `target ${tTest} current_difficulty ${resultStimulus.difficulty}`
    );
  }
  stimulusLists[currentBlockIndex][corpusType].splice(closestIndex, 1);
  //console.log("after cut", stimulusLists[currentBlockIndex][corpusType].length);
  return resultStimulus;
}

function getStimuli() {
  //const resultStimuli = [];
  if (stimulusRule === "random") {
    console.log("this is random");
    resultStimuli =
      stimulusLists[currentBlockIndex].corpus_random[
        stimulusIndex[currentBlock]
      ];
    stimulusIndex[currentBlock] += 1;
  } else {
    if (count_adaptive_trials < totalAdaptiveTrials) {
      count_adaptive_trials += 1;
      console.log("this is adaptive");
      //console.log("index check " + stimulusIndex.currentBlock);
      resultStimuli = updateQuest();
      stimulusIndex[currentBlock] += 1;
    } else {
      stimulusRule = "new";
      console.log("this is new");
      resultStimuli = block_new[newword_index];
      newword_index += 1;
    }
  }
  //should add staircase design for else condition
  //trialCorrectAns = resultStimuli['correct_response'];
  return resultStimuli;
}

function CreateRandomArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function CreateStaircaseBlock_New(array, difficultyLevels, blockLabel) {
  const StaircaseArray = [];
  stimulusIndex[blockLabel] = [];
  for (let d = 0; d < difficultyLevels; d++) {
    StaircaseArray[d] = [];
    stimulusIndex[blockLabel].push(0);
  }
  for (let x of array) {
    StaircaseArray[x.difficulty].push(x);
  }

  for (let d = 0; d < difficultyLevels; d++) {
    for (let i = StaircaseArray[d].length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = StaircaseArray[d][i];
      StaircaseArray[d][i] = StaircaseArray[d][j];
      StaircaseArray[d][j] = temp;
    }
  }
  return StaircaseArray;
}

function transformNewwords(csv_new) {
  const csv_new_transform = csv_new.reduce((accum, row) => {
    const newRow = {
      realword: row.realword,
      pseudoword: row.pseudoword,
    };
    accum.push(newRow);
    return accum;
  }, []);

  const newArray = CreateRandomArray(csv_new_transform);

  const splitArray = [];
  for (let i = 0; i < newArray.length; i++) {
    const realRow = {
      stimulus: newArray[i].realword,
      correct_response: "ArrowRight",
      difficulty: 0, //default level
    };
    splitArray.push(realRow);
    const pseudoRow = {
      stimulus: newArray[i].pseudoword,
      correct_response: "ArrowLeft",
      difficulty: 0, //default level
    };
    splitArray.push(pseudoRow);
  }
  return CreateRandomArray(splitArray);
}

const exit_fullscreen = {
  type: jsPsychFullScreen,
  fullscreen_mode: false,
  delay_after: 0,
};

async function roarBlocks(stimuliPractice, stimuliValidated, stimuliNew) {
  const csv_practice = await readCSV(stimuliPractice);
  const csv_validated = await readCSV(stimuliValidated);
  const csv_new = await readCSV(stimuliNew);

  csv_practice_transform = csv_practice.reduce((accum, row) => {
    if (row.realpseudo === "real") {
      correct_response = "ArrowRight";
    } else {
      correct_response = "ArrowLeft";
    }
    const newRow = {
      stimulus: row.word,
      correct_response: correct_response,
      difficulty: row.difficulty,
    };
    accum.push(newRow);
    return accum;
  }, []);

  csv_validated_transform = csv_validated.reduce((accum, row) => {
    if (row.realpseudo === "real") {
      correct_response = "ArrowRight";
    } else {
      correct_response = "ArrowLeft";
    }
    const newRow = {
      stimulus: row.word,
      correct_response: correct_response,
      difficulty: -row.b_i,
    };
    accum.push(newRow);
    return accum;
  }, []);

  //set number of practice trials
  const block_Practice = csv_practice_transform.slice(0, totalTrials_Practice);

  const corpusA = {
    name: "blockA",
    corpus_pseudo: csv_validated_transform.slice(0, 42).reverse(),
    corpus_real: csv_validated_transform.slice(42, 84).reverse(),
    corpus_random: CreateRandomArray(csv_validated_transform.slice(0, 84)),
  };

  const corpusB = {
    name: "blockB",
    corpus_pseudo: csv_validated_transform.slice(84, 126).reverse(),
    corpus_real: csv_validated_transform.slice(126, 168).reverse(),
    corpus_random: CreateRandomArray(csv_validated_transform.slice(126, 168)),
  };

  const corpusC = {
    name: "blockC",
    corpus_pseudo: csv_validated_transform.slice(168, 210).reverse(),
    corpus_real: csv_validated_transform.slice(210, 252).reverse(),
    corpus_random: CreateRandomArray(csv_validated_transform.slice(168, 252)),
  };

  block_new = CreateRandomArray(transformNewwords(csv_new));

  /* 2 orders of calling blocks */

  const randomBlockLis = CreateRandomArray([corpusA, corpusB, corpusC]); //every block is randomized

  const fixedBlockLis = [corpusA, corpusB, corpusC]; //always starts from Block A

  //the core procedure

  function pushPracticeToTimeline(array) {
    for (let x of array) {
      const block = {
        timeline: [
          setup_fixation_practice,
          lexicality_test_practice,
          if_audio_response_correct,
          if_audio_response_wrong,
          if_node_left,
          if_node_right,
        ],
        timeline_variables: [x],
      };
      timeline.push(block);
    }
  }

  pushPracticeToTimeline(block_Practice);
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

  if (userMode == "beginner") {
    stimulusLists = fixedBlockLis.slice(0, stimulusRuleLis.length);
  } else {
    stimulusLists = randomBlockLis.slice(0, stimulusRuleLis.length);
  }

  function PushTrialsToTimeline(stimulusLists, stimulusCountLis) {
    for (let i = 0; i < stimulusCountLis.length; i++) {
      // for each block: add trials
      /* add first half of block */
      total_roar_mainproc_line.push(countdown_trials);
      const roar_mainproc_block_half_1 = {
        timeline: [core_procedure],
        conditional_function: function () {
          if (stimulusCountLis[i] === 0) {
            return false;
          } else {
            currentBlock = stimulusLists[i].name;
            console.log("hi printing currentBlock ", currentBlock);
            currentBlockIndex = i;
            stimulusRule = stimulusRuleLis[i];
            return true;
          }
        },
        repetitions: stimulusCountLis[i] / 2,
      };
      total_roar_mainproc_line.push(roar_mainproc_block_half_1);
      total_roar_mainproc_line.push(mid_block_page_list[i]);
      total_roar_mainproc_line.push(countdown_trials);
      /* add second half of block */
      const roar_mainproc_block_half_2 = {
        timeline: [core_procedure],
        conditional_function: function () {
          if (stimulusCountLis[i] === 0) {
            return false;
          } else {
            return true;
          }
        },
        repetitions: stimulusCountLis[i] / 2,
      };
      total_roar_mainproc_line.push(roar_mainproc_block_half_2);
      if (i < stimulusCountLis.length - 1) {
        total_roar_mainproc_line.push(post_block_page_list[i]);
      }
    }
  }

  const total_roar_mainproc_line = [];

  PushTrialsToTimeline(stimulusLists, config["stimulusCountList"]);

  const total_roar_mainproc = {
    timeline: total_roar_mainproc_line,
  };

  timeline.push(total_roar_mainproc);
  timeline.push(final_page);

  console.log("I am printing timeline now");
  console.log(timeline);

  timeline.push(debrief_block);
  timeline.push(exit_fullscreen);

  if (isOnPavlovia) {
    timeline.push(pavlovia_finish);
  }

  jsPsych.init({
    timeline: timeline,
    show_progress_bar: true,
    auto_update_progress_bar: false,
    message_progress_bar: "Progress Complete",
    on_finish: function () {
      /* display data on exp end - useful for dev */
      //jsPsych.data.displayData();
    },
  });
}

roarBlocks(dataPracticeURL, dataValidatedURL, dataNewURL);
