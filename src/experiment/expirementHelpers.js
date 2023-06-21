import { firekit } from "./experimentSetup";
import { jsPsych, config } from "./config/config";


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

// This is to track correct trials
export const updateCorrectChecker = () => {
  const trials = jsPsych.data.get().filter({ task: "test_response" });
  const correct_trials = trials.filter({ correct: true });
}


async function fetchAllFileNamesFromBucket(prefix = '', bucketName) {
  const response = await fetch(`https://storage.googleapis.com/storage/v1/b/${bucketName}/o?prefix=${encodeURIComponent(prefix)}&delimiter=/`);
  const data = await response.json();

  let fileNames = [];

  if (data.items) {
    fileNames = data.items.map((item) => item.name);
  }

  if (data.prefixes) {
    for (const subfolder of data.prefixes) {
      const subfolderFileNames = await fetchAllFileNamesFromBucket(subfolder);
      fileNames = fileNames.concat(subfolderFileNames);
    }
  }

  return fileNames;
}

export function fetchAllFileNamesGCS(bucketName, languageFolders) {
  return new Promise(async (resolve, reject) => {
    try {
      const topLevelFolders = ['keyboard', 'tablet'];
      const fileTypeFolders = ['audio', 'images', 'video'];

      const allFileNames = {};

      for (const languageFolder of languageFolders) {
        for (const topLevelFolder of topLevelFolders) {
          for (const fileTypeFolder of fileTypeFolders) {
            const prefix = `${languageFolder}/${topLevelFolder}/${fileTypeFolder}/`;
            const fileNames = await fetchAllFileNamesFromBucket(prefix, bucketName);

            // Remove intermediate folder path from the file names
            const cleanedFileNames = fileNames.map((fileName) => fileName.replace(`${prefix}`, ''));

            // Combine file names into the corresponding media type array
            if (!allFileNames[topLevelFolder]) {
              allFileNames[topLevelFolder] = {};
            }
            if (!allFileNames[topLevelFolder][fileTypeFolder]) {
              allFileNames[topLevelFolder][fileTypeFolder] = [];
            }
            allFileNames[topLevelFolder][fileTypeFolder] = allFileNames[topLevelFolder][fileTypeFolder].concat(cleanedFileNames);
          }
        }
      }

      resolve(allFileNames);
    } catch (error) {
      reject(error);
    }
  });
}


function fetchAllFileNamesFromBucketSync(prefix = '', delimiter = '/', bucketName, awsRegion) {
  return new Promise((resolve, reject) => {
    const url = `https://${bucketName}.s3.${awsRegion}.amazonaws.com/?list-type=2&prefix=${encodeURIComponent(prefix)}${delimiter ? '&delimiter=' + encodeURIComponent(delimiter) : ''}`;

    fetch(url)
      .then((response) => response.text())
      .then((data) => {
        console.log(data)

        const parser = new DOMParser();
        const xmlData = parser.parseFromString(data, 'application/xml');

        const contents = xmlData.querySelectorAll('Contents');
        const fileNames = Array.from(contents).map((item) => item.querySelector('Key').textContent);

        const commonPrefixes = xmlData.querySelectorAll('CommonPrefixes');
        const subfolderPromises = Array.from(commonPrefixes).map((commonPrefix) => {
          const subfolder = commonPrefix.querySelector('Prefix').textContent;
          // First, recurse with delimiter to find subfolders
          return fetchAllFileNamesFromBucketSync(subfolder, '/').then((subfolderFileNames) => {
            // Then, recurse without delimiter to explore the contents of subfolders
            return fetchAllFileNamesFromBucketSync(subfolder, null).then((subfolderContents) => {
              return subfolderFileNames.concat(subfolderContents);
            });
          });
        });

        Promise.all(subfolderPromises)
          .then((subfolderFileNames) => {
            for (const subfolderNames of subfolderFileNames) {
              fileNames.push(...subfolderNames);
            }
            resolve(fileNames);
          })
          .catch(reject);
      })
      .catch(reject);
  });
}

export async function fetchAllFileNamesAWS(bucketName, region) {
  const topLevelFolders = ['keyboard',];
  const fileTypeFolders = ['audio', 'images', 'video'];

  const allFileNames = {};

  for (const topLevelFolder of topLevelFolders) {
    allFileNames[topLevelFolder] = {};

    for (const fileTypeFolder of fileTypeFolders) {
      const prefix = `${topLevelFolder}/${fileTypeFolder}/`;
      const fileNames = await fetchAllFileNamesFromBucketSync(prefix, '/', bucketName, region);
      allFileNames[topLevelFolder][fileTypeFolder] = fileNames;
    }
  }

  console.log(allFileNames);
}