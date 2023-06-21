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


export async function fetchAllFileNamesAWS(bucketUrl, prefixes) {
  try {
    const media = {
      audio: [],
      images: [],
      video: []
    };

    const response = await fetch(bucketUrl);
    const text = await response.text();

    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "application/xml");

    const contents = xml.getElementsByTagName("Contents");

    for (let i = 0; i < contents.length; i++) {
      const key = contents[i].getElementsByTagName("Key")[0].textContent;

      const hasDesiredPrefix = prefixes.some(prefix => key.startsWith(`${prefix}/`));

      if (hasDesiredPrefix) {
        const extension = key.split('.').pop();

        switch (extension) {
          case 'mp3':
            media.audio.push(key);
            break;
          case 'jpg':
          case 'png':
            media.images.push(key);
            break;
          case 'mp4':
            media.video.push(key);
            break;
        }
      }
    }

    return media;

  } catch (error) {
    console.error('Error fetching files from S3:', error);
    return null;
  }
}


// GCS: https://storage.googleapis.com/your-bucket-name
// AWS: https://your-bucket-name.s3.amazonaws.com

// prefixes = ['en', 'shared'];

export async function fetchMediaFiles(bucketUrl, prefixes, provider) {
  try {
    const media = {
      audio: [],
      images: [],
      video: []
    };

    const response = await fetch(bucketUrl);
    const text = await response.text();

    if (provider === 'aws') {
      // Parse as XML for AWS S3
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, "application/xml");
      
      const contents = xml.getElementsByTagName("Contents");
      
      for (let i = 0; i < contents.length; i++) {
        const key = contents[i].getElementsByTagName("Key")[0].textContent;

        addMediaToFileList(provider, bucketUrl, key, media, prefixes);
      }
    } else if (provider === 'google') {
      // Parse as JSON for Google Cloud Storage
      const json = JSON.parse(text);
      
      const items = json.items || [];
      
      for (let item of items) {
        const key = item.name;

        addMediaToFileList(provider, bucketUrl, key, media, prefixes);
      }
    } else {
      console.error('Unknown provider:', provider);
      return null;
    }

    console.log('media: ', media);
    return media;

  } catch (error) {
    console.error('Error fetching files from bucket:', error);
    return null;
  }
}

function addMediaToFileList(provider, bucketUrl, key, media, prefixes) {
  const hasDesiredPrefix = prefixes.some(prefix => key.startsWith(`${prefix}/`));

  if (hasDesiredPrefix) {
    const extension = key.split('.').pop();

    switch (extension) {
      case 'mp3':
        media.audio.push(`${bucketUrl}/${key}`);
        break;
      case 'jpg':
      case 'png':
        media.audio.push(`${bucketUrl}/${key}`);
        break;
      case 'mp4':
        media.audio.push(`${bucketUrl}/${key}`);
        break;
    }
  }
}


