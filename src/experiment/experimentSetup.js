import { config, stimulusCountLists, taskInfo } from "./config/config";
import { roarConfig } from "./config/firebaseConfig";
import { RoarFirekit } from "@bdelab/roar-firekit";
import store from "store2";
import { corpusAll, corpusNew } from "./config/corpus";
import { Cat } from '@bdelab/jscat';

store.session.set("corpusAll", corpusAll); 
store.session.set("corpusNew", corpusNew);

export const cat = new Cat({method: 'MLE', minTheta: -6, maxTheta: 6, itemSelect: store.session("itemSelect")});

// Include new items in thetaEstimate
export const cat2 = new Cat({method: 'MLE', minTheta: -6, maxTheta: 6, itemSelect: store.session("itemSelect")});


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

