import { jsPsych } from "jspsych";
import { arrSum, config } from "./config.js";

import { if_audio_response_correct, if_audio_response_wrong } from "./audio.js";
import { preload_trials } from "./preload.js";
import { introduction_trials, countdown_trials } from ".introduction.js";

/* init connection with pavlovia.org */
const pavlovia_init = {
  type: "pavlovia",
  command: "init",
};

preload_trials.forEach((trial) => {
  timeline.push(trial);
});

const pavlovia_finish = {
  type: "pavlovia",
  command: "finish",
};

/* add introduction trials*/
const enter_fullscreen = {
  type: "fullscreen",
  fullscreen_mode: true,
};

/* collect participant id */
const survey_pid = {
  type: "survey-text",
  questions: [{ prompt: "Please enter your User ID" }],
  on_finish: function (data) {
    config["pid"] = data.response["Q0"];
  },
};

const if_get_pid = {
  timeline: [survey_pid],
  conditional_function: function () {
    return Boolean(config["pid"]) !== true;
  },
};

//timeline.push(pavlovia_init);
timeline.push(if_get_pid);
timeline.push(enter_fullscreen);
timeline.push(introduction_trials);
timeline.push(countdown_trials);

/* debrief trials*/
var debrief_block = {
  type: "html-keyboard-response",
  stimulus: function () {
    var trials = jsPsych.data.get().filter({ task: "test_response" });
    var correct_trials = trials.filter({ correct: true });
    var incorrect_trials = trials.filter({ correct: false });
    var accuracy = Math.round((correct_trials.count() / trials.count()) * 100);
    var rt = Math.round(correct_trials.select("rt").mean());
    var irt = Math.round(incorrect_trials.select("rt").mean());

    console.log(difficultyHistory);
    stimulusLists[currentBlockIndex];

    return `<p>You responded correctly on ${accuracy}% of the trials.</p>
          <p>Your average response time on correct trials was ${rt}ms.</p>
          <p>Your average response time on incorrect trials was ${irt}ms.</p>
          <p>Press any key to complete the experiment. Thank you!</p>`;
  },
};

//function to update the span as appropriate (using a 2:1 staircase procedure)

/* For Practice Trial Only */
var setup_fixation_practice = {
  type: "html-keyboard-response",
  stimulus: function () {
    return `<div class = stimulus_div><p class = 'stimulus' style="font-size:60px;">+</p></div>`;
  },
  prompt: ` <img class="lower" src="assets/arrowkey_lex.png" alt="arrow keys" style=" width:698px; height:120px">`,
  choices: jsPsych.NO_KEYS,
  trial_duration: fixationTime[fixationTimeIndex],
  data: {
    task: "fixation",
  },
  on_finish: function () {
    jsPsych.setProgressBar(0);
  },
};

var lexicality_test_practice = {
  type: "html-keyboard-response",
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
    start_time: start_time.toLocaleString("PST"),
    start_time_unix: start_time.getTime(),
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
var setup_fixation = {
  type: "html-keyboard-response",
  stimulus: function () {
    return `<div class = stimulus_div><p class = 'stimulus' style="font-size:60px;">+</p></div>`;
  },
  prompt: `<div><img class="lower" src="assets/arrowkey_lex.png" alt="arrow keys" style=" width:698px; height:120px"></div>`,
  choices: jsPsych.NO_KEYS,
  trial_duration: fixationTime[fixationTimeIndex],
  data: {
    task: "fixation",
  },
  on_finish: function () {
    nextStimulus = getStimuli(); //get the current stimuli for the trial
    difficultyHistory[roarTrialNum - 1] = nextStimulus.difficulty; //log the current span in an array
    roarTrialNum += 1; //add 1 to the total trial count
    jsPsych.setProgressBar(
      (roarTrialNum - 1) / arrSum(config["stimulusCountList"])
    );
  },
};

var lexicality_test = {
  type: "html-keyboard-response",
  stimulus: function () {
    return `<div class = stimulus_div><p class = 'stimulus' style="font-size:60px;">${nextStimulus["stimulus"]}</p></div>`;
  },
  prompt: `<div></div><img class="lower" src="assets/arrowkey_lex.png" alt="arrow keys" style=" width:698px; height:120px"></div>`,
  stimulus_duration: stimulusTime[stimulusTimeIndex],
  trial_duration: trialTime[trialTimeIndex],
  choices: ["ArrowLeft", "ArrowRight"],
  data: {
    task: "test_response" /* tag the test trials with this taskname so we can filter data later */,
    start_time: start_time.toLocaleString("PST"),
    start_time_unix: start_time.getTime(),
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
    //var curr_progress_bar_value = jsPsych.getProgressBarCompleted();
    jsPsych.setProgressBar(
      (roarTrialNum - 1) / arrSum(config["stimulusCountList"])
    );
    saveToFirebase(
      pid + "/" + uid + "/" + firebase_data_index,
      jsPsych.data.getLastTrialData().values()[0]
    );
    firebase_data_index += 1;
  },
};

//This is to track correct trials
function updateCorrectChecker() {
  var trials = jsPsych.data.get().filter({ task: "test_response" });
  var correct_trials = trials.filter({ correct: true });
  console.log("CORRECT TRIALS COUNT " + correct_trials.count());
}

function questUpdate() {
  let closestIndex, resultStimulus, currentCorpus;
  let randomBoolean = Math.random() < 0.5;
  randomBoolean ? (corpusType = "corpus_real") : (corpusType = "corpus_pseudo");
  currentCorpus = stimulusLists[currentBlockIndex][corpusType];
  //block.corpus_real : currentCorpus = block.corpus_pseudo;
  if (stimulusIndex[currentBlock] === 0) {
    closestIndex = findClosest(currentCorpus, tTest);
    resultStimulus = currentCorpus[closestIndex];
  } else {
    console.log("update QUEST");
    myquest = jsQUEST.QuestUpdate(myquest, nextStimulus.difficulty, response);
    tTest = jsQUEST.QuestQuantile(myquest);
    closestIndex = findClosest(currentCorpus, tTest);
    let d_list = [];
    currentCorpus.forEach(function (item, index) {
      d_list.push(item.difficulty);
    });
    resultStimulus = currentCorpus[closestIndex];
  }
  stimulusLists[currentBlockIndex][corpusType].splice(closestIndex, 1);
  //console.log("after cut", stimulusLists[currentBlockIndex][corpusType].length);
  console.log(
    "target " + tTest + " current_difficulty " + resultStimulus.difficulty
  );
  return resultStimulus;
}

function getStimuli() {
  //var resultStimuli = [];
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
      resultStimuli = questUpdate();
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
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function CreateStaircaseBlock_New(array, difficultyLevels, blockLabel) {
  var StaircaseArray = [];
  stimulusIndex[blockLabel] = [];
  for (var d = 0; d < difficultyLevels; d++) {
    StaircaseArray[d] = [];
    stimulusIndex[blockLabel].push(0);
  }
  for (let x of array) {
    StaircaseArray[x.difficulty].push(x);
  }

  for (var d = 0; d < difficultyLevels; d++) {
    for (var i = StaircaseArray[d].length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = StaircaseArray[d][i];
      StaircaseArray[d][i] = StaircaseArray[d][j];
      StaircaseArray[d][j] = temp;
    }
  }
  return StaircaseArray;
}

function transformNewwords(csv_new) {
  var csv_new_transform = csv_new.reduce((accum, row) => {
    const newRow = {
      realword: row.realword,
      pseudoword: row.pseudoword,
    };
    accum.push(newRow);
    return accum;
  }, []);

  var newArray = CreateRandomArray(csv_new_transform);

  var splitArray = [];
  for (var i = 0; i < newArray.length; i++) {
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

var exit_fullscreen = {
  type: "fullscreen",
  fullscreen_mode: false,
  delay_after: 0,
};

async function roarBlocks(
  stimuliPractice,
  stimuliValidated,
  stimuliNew,
  firebaseInfoURL
) {
  var csv_practice = await readCSV(stimuliPractice);
  var csv_validated = await readCSV(stimuliValidated);
  var csv_new = await readCSV(stimuliNew);

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
  var block_Practice = csv_practice_transform.slice(0, totalTrials_Practice);

  var corpusA = {
    name: "blockA",
    corpus_pseudo: csv_validated_transform.slice(0, 42).reverse(),
    corpus_real: csv_validated_transform.slice(42, 84).reverse(),
    corpus_random: CreateRandomArray(csv_validated_transform.slice(0, 84)),
  };

  var corpusB = {
    name: "blockB",
    corpus_pseudo: csv_validated_transform.slice(84, 126).reverse(),
    corpus_real: csv_validated_transform.slice(126, 168).reverse(),
    corpus_random: CreateRandomArray(csv_validated_transform.slice(126, 168)),
  };

  var corpusC = {
    name: "blockC",
    corpus_pseudo: csv_validated_transform.slice(168, 210).reverse(),
    corpus_real: csv_validated_transform.slice(210, 252).reverse(),
    corpus_random: CreateRandomArray(csv_validated_transform.slice(168, 252)),
  };

  block_new = CreateRandomArray(transformNewwords(csv_new));

  /* 2 orders of calling blocks */

  var randomBlockLis = CreateRandomArray([corpusA, corpusB, corpusC]); //every block is randomized

  var fixedBlockLis = [corpusA, corpusB, corpusC]; //always starts from Block A

  //the core procedure

  function PushPracticeToTimeline(array) {
    for (let x of array) {
      var block = {
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

  PushPracticeToTimeline(block_Practice);
  timeline.push(post_practice_intro);

  var core_procedure = {
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
      var roar_mainproc_block_half_1 = {
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
      var roar_mainproc_block_half_2 = {
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

  var total_roar_mainproc_line = [];

  PushTrialsToTimeline(stimulusLists, config["stimulusCountList"]);

  var total_roar_mainproc = {
    timeline: total_roar_mainproc_line,
  };

  timeline.push(total_roar_mainproc);
  timeline.push(final_page);

  console.log("I am printing timeline now");
  console.log(timeline);

  var submit_block = {
    type: "single-stim",
    stimuli: [" "],
    choices: ["none"],
    timing_response: 0.001,
    timing_post_trial: 0,
    on_finish: function () {
      saveToFirebase("subject_code", jsPsych.data.getData());
    },
  };

  timeline.push(debrief_block);
  timeline.push(exit_fullscreen);
  //timeline.push(pavlovia_finish);

  /* Config Firebase */
  var csv_firebase_info = await readCSV(firebaseInfoURL);
  var firebase_info = csv_firebase_info.reduce((accum, row) => {
    const newRow = {
      info: row.info,
      value: row.value,
    };
    accum.push(newRow);
    return accum;
  }, []);

  var firebaseConfig = {
    apiKey: firebase_info[0]["value"],
    authDomain: firebase_info[1]["value"],
    projectId: firebase_info[2]["value"],
    storageBucket: firebase_info[3]["value"],
    messagingSenderId: firebase_info[4]["value"],
    appId: firebase_info[5]["value"],
    measurementId: firebase_info[6]["value"],
  };

  // Initialize Firebase
  var firebaseApp = firebase.initializeApp(firebaseConfig);

  firebaseApp
    .auth()
    .signInAnonymously()
    .then(() => {
      console.log("signed in");
      // Signed in..
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("errorCode", errorCode);
      console.log("errorMessage", errorMessage);

      // ...
    });

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      uid = user.uid;
      console.log("uid", uid);
      // ...
    } else {
      console.log("signed out");
      // User is signed out
      // ...
    }
  });

  jsPsych.init({
    timeline: timeline,
    show_progress_bar: true,
    auto_update_progress_bar: false,
    message_progress_bar: "Progress Complete",
    on_finish: function () {
      /* display data on exp end - useful for dev */
      //saveToFirebase('testing/' + userID, JSON.parse(jsPsych.data.get().json()));
      //jsPsych.data.displayData();
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log("signed out");
          // Signed in..
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log("errorCode", errorCode);
          console.log("errorMessage", errorMessage);
          // ...
        });
    },
  });
}

const data_practice_url = "wordlist/ldt-items-practice.csv";
const data_validated_url =
  "wordlist/ldt-items-difficulties-with-six-levels.csv";
const data_new_url = "wordlist/ldt-new-items.csv";
const firebase_info_url = "firebase_info/firebase_info.csv";

roarBlocks(
  data_practice_url,
  data_validated_url,
  data_new_url,
  firebase_info_url
);
