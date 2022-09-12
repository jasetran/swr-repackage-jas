/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import { Cat } from '@bdelab/jscat';
// jsPsych imports
import jsPsychSurveyText from "@jspsych/plugin-survey-text";
import jsPsychFullScreen from "@jspsych/plugin-fullscreen";
import jsPsychHtmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import jsPsychSurveyHtmlForm from "@jspsych/plugin-survey-html-form";
import jsPsychSurveyMultiSelect from "@jspsych/plugin-survey-multi-select";
import store from "store2";

// Import necessary for async in the top level of the experiment script
import "regenerator-runtime/runtime";

// Firebase imports
import { RoarFirekit } from "@bdelab/roar-firekit";
import { roarConfig } from "./firebaseConfig";

// Local modules
import {
  jsPsych,
  config,
  updateProgressBar,
  stimulusCountLists,
  taskInfo,
} from "./config";
import { if_audio_response_correct, if_audio_response_wrong, if_audio_response_neutral } from "./audio";
import { imgContent, preload_trials } from "./preload";
import {
  introduction_trials,
  post_practice_intro,
  countdown_trials,
  if_coin_tracking,
} from "./introduction";
import {
  if_node_left,
  if_node_right,
  setup_fixation_practice,
  lexicality_test_practice,
} from "./practice";
import {
  mid_block_page_list,
  post_block_page_list,
  final_page,
} from "./gameBreak";
import {corpusNew, blockPractice, corpusAll } from "./corpus";

// CSS imports
import "./css/game.css";

let firekit;

store.session.set("corpusAll", corpusAll);
store.session.set("corpusNew", corpusNew);

const timeline = [];
const cat = new Cat({method: 'MLE', itemSelect: store.session("itemSelect")});

preload_trials.forEach((trial) => {
  timeline.push(trial);
});

const makePid = () => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 16; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

const enter_fullscreen = {
  type: jsPsychFullScreen,
  fullscreen_mode: true,
  message: `<div class = 'text_div'><h1>The experiment will switch to full screen mode. <br> Click the button to continue. </h1></div>`,
  on_finish: async () => {
    config.pid = config.pid || makePid();
    let prefix = config.pid.split("-")[0];
    if (prefix === config.pid | config.taskVariant !== 'school'){
       prefix = null;
    }
    const userInfo = {
      id: config.pid,
      studyId: config.taskVariant + "-" + config.userMode,
      schoolId: prefix,
      userMetadata: config.userMetadata,
    };
    firekit = new RoarFirekit({
      config: roarConfig,
      userInfo: userInfo,
      taskInfo,
    });
    await firekit.startRun();
  },
};

const consent_form = {
  type: jsPsychSurveyMultiSelect,
  questions: [
    {
      prompt: ` <div>
        <p class=" consent_form_title">STANFORD UNIVERSITY CONSENT FORM</p>
        <p class=" consent_form_text">
        <b>PURPOSE OF THE STUDY</b> 
        <br>
        Data collected through games in the web-browser will help researchers understand relationships between academic skills, reading proficiency, cognition, perception, and/or attitudes towards reading and school in individuals with a broad range of reading skills.
        <br><br>
        <b>STUDY PROCEDURES</b> 
        <br>
        In this study, you will be asked to complete computer tasks via a computer screen. Audio will be presented via headphones or speakers.
        <br><br>
        <b>PRIVACY AND DATA COLLECTION</b> <br>
        We will do our best to ensure your privacy. Data that is collected through this online experiment is stored separately from identifying information such as your name. For the sake of payment, sometimes we store an email address you provide, but this is stored separately from the responses that are recorded in the online experiment. Each participant is assigned a code and that is used rather than names. This is called “coded data” and we try to ensure that the identity of our research participants is kept confidential. Data collected as part of this study may be used for many years to help discover trends in the population and explore changes due to development and education. In addition, coded data may be shared online or with collaborators to allow for new and unforeseen discoveries. Researchers may choose to include coded data in publications to support findings, or they may choose to release coded data alongside findings for replicability.
        <br>
        <br>
        We will collect mouse and click, scores earned, button presses and their timestamps, or other data that may be derived from your behavior on our page. This data will be stored on servers. Incomplete data may be logged if you quit out of the experiment early. If you would like to void your data, you may request it through our contact email. 
        <br>
        <br>
        <b>COMPENSATION</b>
        <br> 
        We value your participation in our study. You can receive a $1 Tango gift card upon completion of this study. If you have not done so already, you will have the chance to provide your email address at the end of the study. You may also choose to waive payment by not providing your email address.
        <br>
        <br>
        Please note that the gift card system we use to pay participants is not affiliated with Stanford and we will need to input your name and email into this system to send you the electronic gift card payment. If you feel uncomfortable with this process, please let us know before signing the consent form. Depending on the study, we may be able to look into other forms of payment for you.     
        <br>
        <br>
        <b>RISKS, STRESS, OR DISCOMFORT</b>
        <br>
        If there is any reason to believe you are not safe to participate in any of the tasks, please contact us at <a href="url">readingresearch@stanford.edu</a>. Some people may experience some physical discomfort or boredom due to being asked to sit for long periods. For computer tasks, some people may also experience dry eyes or eye fatigue. For some tasks that are untimed, breaks can be taken as needed during the session.
        <br>
        <br>
        <b>CONTACT INFORMATION </b>
        <br>
        If you have any additional questions or concerns about our research, feel free to email us at <a href="url">readingresearch@stanford.edu</a>. We will be more than happy to help!
        <br>
        <br>
        For general information regarding questions or concerns about [your/your child’s] rights as a research participant, please call 1-866-680-2906 to reach the Administrative Panel on Human Subjects in Medical Research, Stanford University.
        </p>
 </div>
     `,
      options: [
        `<b>I agree to participate in this research. Participation in this research is voluntary, and I can stop at any time without penalty. <br> I feel that I understand what I am getting into, and I know I am free to leave the experiment at any time by simply closing the web browser.
</b>`,
      ],
      required: true,
      required_message: "You must check the box to continue",
      name: "Agree",
    },
  ],
};

const if_consent_form = {
  timeline: [consent_form],
  conditional_function: () => {
    return Boolean(config.userMode === "demo");
  },
};

/* demo survey */
const survey_pid = {
  type: jsPsychSurveyHtmlForm,
  preamble:
    "<div><h1>Please share a bit more to help us understand your data!</h1></div>",
  html: `
     <div className="item">
      <span htmlFor="instructions" class = "survey_form_text">How old are you? (Please type a number)</span>
      <input type = "text" id = "age" name="age" style = "font-size: 2vh" value=""/>
    </div>
    <br>
    <div className="item">
      <span class = "survey_form_text">What is your current grade or highest level of education?</span>
      <select id = "edu" name = "edu" style = "font-size: 2vh">
        <option value=""></option>
        <option value="prek">preK</option>
        <option value="k1">K1</option>
        <option value="k2">K2</option>
        <option value="1">Grade 1</option>
        <option value="2">Grade 2</option>
        <option value="3">Grade 3</option>
        <option value="4">Grade 4</option>
        <option value="5">Grade 5</option>
        <option value="6">Grade 6</option>
        <option value="7">Grade 7</option>
        <option value="8">Grade 8</option>
        <option value="9">Grade 9</option>
        <option value="10">Grade 10</option>
        <option value="11">Grade 11</option>
        <option value="12">Grade 12</option>
        <option value="college">College</option>
        <option value="proSchool">Professional School</option>
        <option value="gradSchool">Graduate School</option>
      </select>
    </div>
    <br>
    <div className="item">
      <span class = "survey_form_text">Is English your first language?</span>
      <select id = "ell" name = "ell" style = "font-size: 2vh">
        <option value=""></option>
        <option value="1">No</option>
        <option value="0">Yes</option>
      </select>
    </div>
    <br>
    <div className="item">
      <span class = "survey_form_text">Have you taken this demo before?</span>
      <select id = "retake" name = "retake" style = "font-size: 2vh">
        <option value=""></option>
        <option value="0">No</option>
        <option value="1">Yes</option>
      </select>
    </div>
    <br>`,
  autocomplete: true,
  on_finish: (data) => {
    let tmpMetadata = {};
    for (const field in data.response) {
      if (data.response[field] === "") {
        tmpMetadata[field] = null;
      } else if (field === "retake" || field === "ell") {
        tmpMetadata[field] = parseInt(data.response[field]);
      } else {
        tmpMetadata[field] = data.response[field];
      }
    }
    config.userMetadata = tmpMetadata;
  },
};

const if_get_pid = {
  timeline: [survey_pid],
  conditional_function: () => {
    return config.userMode === "demo";
  },
};

const extend = (fn, code) =>
  function () {
    // eslint-disable-next-line prefer-rest-params
    fn.apply(fn, arguments);
    // eslint-disable-next-line prefer-rest-params
    code.apply(fn, arguments);
  };

jsPsych.opts.on_finish = extend(jsPsych.opts.on_finish, () => {
  firekit.finishRun();
});

jsPsych.opts.on_data_update = extend(jsPsych.opts.on_data_update, (data) => {
  /*if (data.trial_index >= 10) {
    firekit?.writeTrial(data);
  }*/
  if (["test_response", "practice_response"].includes(data.task)) {
    firekit?.writeTrial(data);
  }
});

window.onerror = function (msg, url, lineNo, columnNo, error) {
  firekit?.writeTrial({
      task: "error",
      lastTrial: jsPsych.data.getLastTrialData().trials[0],
      message: String(msg),
      source: url || null,
      lineNo: String(lineNo || null),
      colNo: String(columnNo || null),
      error: JSON.stringify(error || null),
  })
  return false;
};

const debrief_block = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div class = "stimulus_div">
  <p class = "debrief_text">
  <b>Thank you for your participation!</b>
  <br><br>
  Click <a href="https://docs.google.com/forms/d/e/1FAIpQLSdw3U6K6YMLf1miWvth36UTl2gxG9r8AbtPKKkrj7B-6acBmg/viewform">here</a> to be redirected to a form if you would like to provide your email to receive a $1 gift card for completing this study. You will only be asked to provide your email if you are requesting payment. 
  <br><br>
  Otherwise, you may exit the window or close your browser.</p></div>`,
};

const if_debrief_block = {
  timeline: [debrief_block],
  conditional_function: () => {
    return Boolean(config.userMode === "demo");
  },
};

timeline.push(if_consent_form, if_get_pid, enter_fullscreen, introduction_trials, countdown_trials);

const checkRealPseudo = (corpus) => {
  let corpusType = (Math.random() < 0.5) ? "corpus_real" : "corpus_pseudo";
  let currentCorpus = corpus[corpusType];
  if (currentCorpus.length < 1) {
    if (corpusType === "corpus_pseudo") {
      corpusType = "corpus_real";
    } else {
      corpusType = "corpus_pseudo";
    }
  }
  return corpusType;
}

const getStimulus = () => {
  // decide which corpus to use
  const demoCounter = store.session("demoCounter");
  let corpus, corpusType, itemSuggestion;
  if (config.userMode === 'demo') {
    if (demoCounter === 5 ) {
      corpus = store.session("corpusAll");
      corpusType = checkRealPseudo(corpus);
      store.session.set("itemSelect", "random");
      itemSuggestion = cat.findNextItem(corpus[corpusType], 'random');
      store.session.set("demoCounter",0);
    } else {
      corpus = store.session("corpusNew");
      corpusType = checkRealPseudo(corpus);
      store.session.set("itemSelect", "mfi");
      itemSuggestion = cat.findNextItem(corpus[corpusType]);
      store.session.transact("demoCounter", (oldVal) => oldVal + 1);
    }
  } else {
    corpus = store.session("corpusAll");
    corpusType = checkRealPseudo(corpus);
    itemSuggestion = cat.findNextItem(corpus[corpusType]);
  }

  // update next stimulus
  store.session.set("nextStimulus", itemSuggestion.nextStimulus);
  corpus[corpusType] = itemSuggestion.remainingStimuli;
  store.session.set("corpusAll", corpus);

  // update 2 trackers
  const currentBlockIndex = store.session("currentBlockIndex");
  const tracker = store.session("trialNumBlock");
  if (tracker === 0 | tracker === stimulusCountLists[config.userMode][currentBlockIndex]) {
    store.session.set("trialNumBlock", 1);
  } else {
    store.session.transact("trialNumBlock", (oldVal) => oldVal + 1);
  }
  store.session.transact("trialNumTotal", (oldVal) => oldVal + 1);

  // print for checking
  // console.log("TrialNumBlock", store.session('trialNumBlock'), store.session('trialNumTotal'));
  // console.log(cat.theta, itemSuggestion.nextStimulus);
}

// set-up screen
const setup_fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    return `<div class = stimulus_div><p class = 'stimulus'>+</p></div>`;
  },
  prompt: `<div><img class="lower" src="${imgContent.arrowkeyLex}" alt="arrow keys"></div>`,
  choices: "NO_KEYS",
  trial_duration: config.timing.fixationTime,
  data: {
    task: "fixation",
  },
  on_finish: () => {
    getStimulus(); // get the current stimuli for the trial
  },
};

// This is to track correct trials
const updateCorrectChecker = () => {
  const trials = jsPsych.data.get().filter({ task: "test_response" });
  const correct_trials = trials.filter({ correct: true });
}

const lexicality_test = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: () => {
    return `<div class = stimulus_div><p class = 'stimulus'>${
      store.session("nextStimulus").stimulus
    }</p></div>`;
  },
  prompt: `<div><img class="lower" src="${imgContent.arrowkeyLex}" alt="arrow keys"></div>`,
  stimulus_duration: config.timing.stimulusTime,
  trial_duration: config.timing.trialTime,
  choices: ["ArrowLeft", "ArrowRight"],
  data: {
    task: "test_response" /* tag the test trials with this taskname so we can filter data later */,
    start_time: config.startTime.toLocaleString("PST"),
    start_time_unix: config.startTime.getTime(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  on_finish: (data) => {
    const nextStimulus = store.session("nextStimulus");
    data.correct = jsPsych.pluginAPI.compareKeys(
      data.response,
      nextStimulus.correct_response
    );
    store.session.set("currentTrialCorrect", data.correct);

    if (data.correct) {
      store.session.set("response", 1);
    } else {
      store.session.set("response", 0);
    }
    if (store.session('trialNumTotal') !== 0){
      cat.updateAbilityEstimate([{a: 1, b:nextStimulus.difficulty, c: 0.5, d: 1}], [store.session('response')])
    }
    jsPsych.data.addDataToLastTrial({
      block: store.session("currentBlockIndex"),
      corpusId: store.session("nextStimulus").corpus_src,
      word: nextStimulus.stimulus,
      correct: store.session("response"),
      correctResponse: nextStimulus.correct_response,
      realpseudo: nextStimulus.realpseudo,
      difficulty: nextStimulus.difficulty,
      thetaEstimate: cat.theta,
      thetaSE: cat.seMeasurement,
      stimulusRule: store.session("itemSelect"),
      trialNumTotal: store.session("trialNumTotal"),
      trialNumBlock: store.session("trialNumBlock"),
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
  const pushPracticeTotimeline = (array) => {
    array.forEach((element) => {
      const block = {
        timeline: [
          setup_fixation_practice,
          lexicality_test_practice,
          if_audio_response_neutral,
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

  pushPracticeTotimeline(blockPractice);
  timeline.push(post_practice_intro);

  const core_procedure = {
    timeline: [
      setup_fixation,
      lexicality_test,
      if_audio_response_neutral,
      if_audio_response_correct,
      if_audio_response_wrong,
      if_coin_tracking,
    ],
  };

  const pushTrialsTotimeline = (stimulusCounts) => {
    for (let i = 0; i < stimulusCounts.length; i++) {
      // for each block: add trials
      /* add first half of block */
      const roar_mainproc_block_half_1 = {
        timeline: [core_procedure],
        conditional_function: () => {
          if (stimulusCounts[i] === 0) {
            return false;
          }
          store.session.set("currentBlockIndex", i);
          return true;
        },
        repetitions: stimulusCounts[i] / 2,
      };
      /* add second half of block */
      const roar_mainproc_block_half_2 = {
        timeline: [core_procedure],
        conditional_function: () => {
          return stimulusCounts[i] !== 0;
        },
        repetitions: stimulusCounts[i] / 2,
      };
      const total_roar_mainproc_line = {
        timeline: [
          countdown_trials,
          roar_mainproc_block_half_1,
          mid_block_page_list[i],
          countdown_trials,
          roar_mainproc_block_half_2,
        ],
      };
      timeline.push(total_roar_mainproc_line);
      if (i < stimulusCounts.length - 1) {
        timeline.push(post_block_page_list[i]);
      }
    }
  }
  pushTrialsTotimeline(config.stimulusCountList);
  timeline.push(final_page, exit_fullscreen, if_debrief_block);
  jsPsych.run(timeline);
}

roarBlocks();
