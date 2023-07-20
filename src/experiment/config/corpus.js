/* eslint-disable no-plusplus */
import Papa from "papaparse";
import i18next from "i18next";
// eslint-disable-next-line import/no-duplicates
import "../i18n";
// eslint-disable-next-line import/no-duplicates
import { wordlist } from "../i18n";
import { shuffle } from "../helperFunctions";

/* csv helper function */


const readCSV = (path) =>
  new Promise((resolve) => {
    // Papa.parse(path, {
    //   download: true,
    //   header: true,
    //   dynamicTyping: true,
    //   skipEmptyLines: true,
    //   complete: function (results) {
    //     const csvStimuli = results.data;
    //     resolve(csvStimuli);
    //   },
    // });

    resolve(path)
  });

const realpseudo2arrow = (realpseudo) =>
  realpseudo === "real" ? "ArrowRight" : "ArrowLeft";

// addAsset :: (k, Promise a) -> Promise (k, a)
// const addAsset = ([name, assetPromise]) =>
//   assetPromise.then((asset) => [name, asset]);

// loadAll :: {k: Promise a} -> Promise {k: a}
// const loadAll = (assets) =>
//   Promise.all(Object.entries(assets).map(addAsset)).then(Object.fromEntries);

const csvAssets = {
  practice: wordlist[i18next.language].dataPracticeURL,
  validated: wordlist[i18next.language].dataValidatedURL,
  new: wordlist[i18next.language].dataNewURL,
};

// const csvAssets = await loadAll(csvPromises);



const transformCSV = (csvInput, isPractice) =>
  csvInput.reduce((accum, row) => {
    const newRow = {
      stimulus: row.word,
      correct_response: realpseudo2arrow(row.realpseudo),
      difficulty: isPractice ? row.difficulty : row.b,
      corpus_src: isPractice ? row.block : row.corpusId,
      realpseudo: row.realpseudo,
    };
    accum.push(newRow);
    return accum;
  }, []);

export const csvTransformed = {
  practice: transformCSV(csvAssets.practice, true),
  validated: transformCSV(csvAssets.validated, false),
  new: shuffle(transformCSV(csvAssets.new, false)), // csvAssets.new,
};

export const corpusAll = {
  name: "corpusAll",
  corpus_pseudo: csvTransformed.validated.filter(
    (row) => row.realpseudo === "pseudo",
  ),
  corpus_real: csvTransformed.validated.filter(
    (row) => row.realpseudo === "real",
  ),
};

export const corpusNew = {
  name: "corpusNew",
  corpus_pseudo: csvTransformed.new.filter(
    (row) => row.realpseudo === "pseudo",
  ),
  corpus_real: csvTransformed.new.filter((row) => row.realpseudo === "real"),
};
