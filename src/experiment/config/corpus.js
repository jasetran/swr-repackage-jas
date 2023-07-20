/* eslint-disable no-plusplus */
import i18next from "i18next";
// eslint-disable-next-line import/no-duplicates
import "../i18n";
// eslint-disable-next-line import/no-duplicates
import { wordlist } from "../i18n";
import { shuffle } from "../helperFunctions";


const csvAssets = {
  practice: wordlist[i18next.language].dataPracticeURL,
  validated: wordlist[i18next.language].dataValidatedURL,
  new: wordlist[i18next.language].dataNewURL,
};

const transformCSV = (csvInput, isPractice) =>
  csvInput.reduce((accum, row) => {
    const newRow = {
      stimulus: row.word,
      correct_response: row.realpseudo === "real" ? "ArrowRight" : "ArrowLeft",
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
