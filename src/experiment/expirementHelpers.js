import { firekit } from "./trials/fullScreen";
import { jsPsych, config, stimulusCountLists } from "./config/config";
import store from "store2";
import { cat } from "./experimentSetup";

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

const timingData = {
  start_time_utc0: config.startTime.toISOString(),
  start_time_unix: config.startTime.getTime(),
  start_time_local: config.startTime.toLocaleString(),
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};


jsPsych.opts.on_data_update = extend(jsPsych.opts.on_data_update, (data) => {
  /*if (data.trial_index >= 10) {
    firekit?.writeTrial(data);
  }*/
  if (data.save_trial) {
    // firekit?.writeTrial(data);
    firekit?.writeTrial({
      timingData,
      userInfo: firekit?.userInfo,
      ...data,
    });
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

export const getStimulus = () => {
  // decide which corpus to use
  const demoCounter = store.session("demoCounter");
  let corpus, corpusType, itemSuggestion;
  if (config.userMode === 'demo') {
    if (demoCounter === 5 ) {
      // validated corpus
      corpus = store.session("corpusAll");
      corpusType = checkRealPseudo(corpus);
      store.session.set("itemSelect", "mfi");
      itemSuggestion = cat.findNextItem(corpus[corpusType], "mfi");
      store.session.set("demoCounter",0);
      // update next stimulus
      store.session.set("nextStimulus", itemSuggestion.nextStimulus);
      corpus[corpusType] = itemSuggestion.remainingStimuli;
      store.session.set("corpusAll", corpus);
    } else {
      // new corpus
      corpus = store.session("corpusNew");
      corpusType = checkRealPseudo(corpus);
      store.session.set("itemSelect", "random");
      itemSuggestion = cat.findNextItem(corpus[corpusType], "random");
      store.session.transact("demoCounter", (oldVal) => oldVal + 1);
      // update next stimulus
      store.session.set("nextStimulus", itemSuggestion.nextStimulus);
      corpus[corpusType] = itemSuggestion.remainingStimuli;
      store.session.set("corpusNew", corpus);
    }
  } else if ((config.userMode === "shortAdaptive") || (config.userMode === "longAdaptive")) {
    if (demoCounter !== config.adaptive2new) {
      // validated corpus
      corpus = store.session("corpusAll");
      corpusType = checkRealPseudo(corpus);
      store.session.set("itemSelect", "mfi");
      itemSuggestion = cat.findNextItem(corpus[corpusType], "mfi");
      store.session.transact("demoCounter", (oldVal) => oldVal + 1);
      // update next stimulus
      store.session.set("nextStimulus", itemSuggestion.nextStimulus);
      corpus[corpusType] = itemSuggestion.remainingStimuli;
      store.session.set("corpusAll", corpus);
    } else {
      // new corpus
      corpus = store.session("corpusNew");
      corpusType = checkRealPseudo(corpus);
      store.session.set("itemSelect", "random");
      itemSuggestion = cat.findNextItem(corpus[corpusType], "random");
      store.session.set("demoCounter",0);
      // update next stimulus
      store.session.set("nextStimulus", itemSuggestion.nextStimulus);
      corpus[corpusType] = itemSuggestion.remainingStimuli;
      store.session.set("corpusNew", corpus);
    }
  } else if (config.userMode === "fullItemBank") {
    // new corpus
    if (config.indexArray[store.session("trialNumTotal")] === 0) {
      // new corpus
      corpus = store.session("corpusNew");
      corpusType = checkRealPseudo(corpus);
      itemSuggestion = cat.findNextItem(corpus[corpusType]);
      // update next stimulus
      store.session.set("nextStimulus", itemSuggestion.nextStimulus);
      corpus[corpusType] = itemSuggestion.remainingStimuli;
      store.session.set("corpusNew", corpus);
    } else {
      // validated corpus
      corpus = store.session("corpusAll");
      corpusType = checkRealPseudo(corpus);
      itemSuggestion = cat.findNextItem(corpus[corpusType]);
      // update next stimulus
      store.session.set("nextStimulus", itemSuggestion.nextStimulus);
      corpus[corpusType] = itemSuggestion.remainingStimuli;
      store.session.set("corpusAll", corpus);
    }
  } else {
    corpus = store.session("corpusAll");
    corpusType = checkRealPseudo(corpus);

    itemSuggestion = cat.findNextItem(corpus[corpusType]);
    // update next stimulus
    store.session.set("nextStimulus", itemSuggestion.nextStimulus);
    corpus[corpusType] = itemSuggestion.remainingStimuli;
    store.session.set("corpusAll", corpus);
  }

  // update 2 trackers
  const currentBlockIndex = store.session("currentBlockIndex");
  const tracker = store.session("trialNumBlock");
  if (tracker === 0 | tracker === stimulusCountLists[config.userMode][currentBlockIndex]) {
    store.session.set("trialNumBlock", 1);
  } else {
    store.session.transact("trialNumBlock", (oldVal) => oldVal + 1);
  }
  store.session.transact("trialNumTotal", (oldVal) => oldVal + 1);
}

// This is to track correct trials
export const updateCorrectChecker = () => {
  const trials = jsPsych.data.get().filter({ task: "test_response" });
  const correct_trials = trials.filter({ correct: true });
}