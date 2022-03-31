import { initStore, realpseudo2arrow, readCSV } from "./config.js";

// Word corpus imports
import dataPracticeURL from "./wordlist/ldt-items-practice.csv";
import dataValidatedURL from "./wordlist/ldt-items-difficulties-with-six-levels.csv";
import dataNewURL from "./wordlist/ldt-new-items.csv";

// fromEntries :: [[a, b]] -> {a: b}
// Does the reverse of Object.entries.
const fromEntries = (list) => {
  const result = {};

  for (let [key, value] of list) {
    result[key] = value;
  }

  return result;
};

// addAsset :: (k, Promise a) -> Promise (k, a)
const addAsset = ([name, assetPromise]) =>
  assetPromise.then((asset) => [name, asset]);

// loadAll :: {k: Promise a} -> Promise {k: a}
const loadAll = (assets) =>
  Promise.all(Object.entries(assets).map(addAsset)).then(fromEntries);

function createRandomArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

const store = initStore();

const corpusA = {
  name: "corpusA",
  corpus_pseudo: csv_validated_transform.slice(0, 42).reverse(),
  corpus_real: csv_validated_transform.slice(42, 84).reverse(),
  corpus_random: createRandomArray(csv_validated_transform.slice(0, 84)),
};

const corpusB = {
  name: "corpusB",
  corpus_pseudo: csv_validated_transform.slice(84, 126).reverse(),
  corpus_real: csv_validated_transform.slice(126, 168).reverse(),
  corpus_random: createRandomArray(csv_validated_transform.slice(126, 168)),
};

const corpusC = {
  name: "corpusC",
  corpus_pseudo: csv_validated_transform.slice(168, 210).reverse(),
  corpus_real: csv_validated_transform.slice(210, 252).reverse(),
  corpus_random: createRandomArray(csv_validated_transform.slice(168, 252)),
};

const randomBlockLis = createRandomArray([corpusA, corpusB, corpusC]); //every block is randomized

const fixedBlockLis = [corpusA, corpusB, corpusC]; //always starts from Block A

const getStimulusLists = () => {
  if (store("userMode") == "beginner") {
    return fixedBlockLis.slice(0, store("stimulusRuleList").length);
  } else {
    return randomBlockLis.slice(0, store("stimulusRuleList").length);
  }
};

const csvPromises = {
  practice: readCSV(dataPracticeURL),
  validated: readCSV(dataValidatedURL),
  new: readCSV(dataNewURL),
};

const csvAssets = loadAll(csvPromises);

const transformCSV = (csvInput, isPractice) => csvInput.reduce((accum, row) => {
  const newRow = {
    stimulus: row.word,
    correct_response: realpseudo2arrow(row.realpseudo),
    difficulty: isPractice ? row.difficulty : -row.b_i,
  };
  accum.push(newRow);
  return accum;
}, []);

export const csvTransformed = {
  practice: transformCSV(csvAssets.practice, true),
  validated: transformCSV(csvAssets.validated, false),
  new: csvAssets.new,
};

export function transformNewwords(csv_new) {
  const csv_new_transform = csv_new.reduce((accum, row) => {
    const newRow = {
      realword: row.realword,
      pseudoword: row.pseudoword,
    };
    accum.push(newRow);
    return accum;
  }, []);

  const newArray = createRandomArray(csv_new_transform);

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
  return createRandomArray(splitArray);
}
