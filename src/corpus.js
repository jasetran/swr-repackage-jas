/* eslint-disable no-plusplus */
import { config, realpseudo2arrow, readCSV } from "./config";

// Word corpus imports
import dataPracticeURL from "./wordlist/ldt-items-practice.csv";
import dataValidatedURL from "./wordlist/ldt-items-difficulties-with-six-levels.csv";
import dataNewURL from "./wordlist/ldt-new-items.csv";


// addAsset :: (k, Promise a) -> Promise (k, a)
const addAsset = ([name, assetPromise]) =>
  assetPromise.then((asset) => [name, asset]);

// loadAll :: {k: Promise a} -> Promise {k: a}
const loadAll = (assets) =>
  Promise.all(Object.entries(assets).map(addAsset)).then(Object.fromEntries);

function shuffle(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

    // swap elements array[i] and array[j]
    // use "destructuring assignment" syntax
    // eslint-disable-next-line no-param-reassign
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

const csvPromises = {
  practice: readCSV(dataPracticeURL),
  validated: readCSV(dataValidatedURL),
  new: readCSV(dataNewURL),
};

const csvAssets = await loadAll(csvPromises);

const transformCSV = (csvInput, isPractice) => csvInput.reduce((accum, row) => {
  const newRow = {
    stimulus: row.word,
    correct_response: realpseudo2arrow(row.realpseudo),
    difficulty: isPractice ? row.difficulty : -row.b_i,
  };
  accum.push(newRow);
  return accum;
}, []);

const csvTransformed = {
  practice: transformCSV(csvAssets.practice, true),
  validated: transformCSV(csvAssets.validated, false),
  new: csvAssets.new,
};

function transformNewwords(csv_new) {
  const csv_new_transform = csv_new.reduce((accum, row) => {
    const newRow = {
      realword: row.realword,
      pseudoword: row.pseudoword,
    };
    accum.push(newRow);
    return accum;
  }, []);

  const newArray = shuffle(csv_new_transform);

  const splitArray = [];
  for (let i = 0; i < newArray.length; i++) {
    const realRow = {
      stimulus: newArray[i].realword,
      correct_response: "ArrowRight",
      difficulty: 0, // default level
    };
    splitArray.push(realRow);
    const pseudoRow = {
      stimulus: newArray[i].pseudoword,
      correct_response: "ArrowLeft",
      difficulty: 0, // default level
    };
    splitArray.push(pseudoRow);
  }
  return shuffle(splitArray);
}

const corpusA = {
  name: "corpusA",
  corpus_pseudo: csvTransformed.validated.slice(0, 42).reverse(),
  corpus_real: csvTransformed.validated.slice(42, 84).reverse(),
  corpus_random: shuffle(csvTransformed.validated.slice(0, 84)),
};

const corpusB = {
  name: "corpusB",
  corpus_pseudo: csvTransformed.validated.slice(84, 126).reverse(),
  corpus_real: csvTransformed.validated.slice(126, 168).reverse(),
  corpus_random: shuffle(csvTransformed.validated.slice(84, 168)),
};

const corpusC = {
  name: "corpusC",
  corpus_pseudo: csvTransformed.validated.slice(168, 210).reverse(),
  corpus_real: csvTransformed.validated.slice(210, 252).reverse(),
  corpus_random: shuffle(csvTransformed.validated.slice(168, 252)),
};

const fixedBlockList = [corpusA, corpusB, corpusC]; // always starts from Block A
const randomBlockList = shuffle(fixedBlockList); // every block is randomized

const getStimulusLists = () => {
  if (config.userMode === "beginner") {
    return fixedBlockList.slice(0, config.stimulusRuleList.length);
  }
  return randomBlockList.slice(0, config.stimulusRuleList.length);
};

export const stimulusLists = getStimulusLists()
// store.session.set("stimulusLists",getStimulusLists());
export const blockNew = shuffle(transformNewwords(csvTransformed.new));
export const blockPractice = csvTransformed.practice.slice(0, config.totalTrialsPractice);
