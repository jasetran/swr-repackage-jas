// let bucketName = 'roar-test-bucket';
// const topLevelFolderName = 'en';
// const languageFolders = ['en', 'shared']; // Replace with your desired language folder
// const language = 'en'



// async function fetchAllFileNamesFromBucket(prefix = '') {
//     const response = await fetch(`https://storage.googleapis.com/storage/v1/b/${bucketName}/o?prefix=${encodeURIComponent(prefix)}&delimiter=/`);
//     const data = await response.json();
  
//     let fileNames = [];
  
//     if (data.items) {
//       fileNames = data.items.map((item) => item.name);
//     }
  
//     if (data.prefixes) {
//       for (const subfolder of data.prefixes) {
//         const subfolderFileNames = await fetchAllFileNamesFromBucket(subfolder);
//         fileNames = fileNames.concat(subfolderFileNames);
//       }
//     }
  
//     return fileNames;
//   }
  
//   async function fetchAllFileNames() {
//     const topLevelFolders = ['keyboard', 'tablet'];
//     const fileTypeFolders = ['audio', 'images', 'video'];
  
//     const allFileNames = {};
  
//     for (const languageFolder of languageFolders) {
//       for (const topLevelFolder of topLevelFolders) {
//         for (const fileTypeFolder of fileTypeFolders) {
//           const prefix = `${languageFolder}/${topLevelFolder}/${fileTypeFolder}/`;
//           const fileNames = await fetchAllFileNamesFromBucket(prefix);
  
//           // Remove intermediate folder path from the file names
//           const cleanedFileNames = fileNames.map((fileName) => fileName.replace(`${prefix}`, ''));
  
//           // Combine file names into the corresponding media type array
//           if (!allFileNames[topLevelFolder]) {
//             allFileNames[topLevelFolder] = {};
//           }
//           if (!allFileNames[topLevelFolder][fileTypeFolder]) {
//             allFileNames[topLevelFolder][fileTypeFolder] = [];
//           }
//           allFileNames[topLevelFolder][fileTypeFolder] = allFileNames[topLevelFolder][fileTypeFolder].concat(cleanedFileNames);
//         }
//       }
//     }
  
//     console.log(allFileNames);
//   }
  
//   fetchAllFileNames();
  

// AWS

const bucketName = 'roar-test-bucket';
const awsRegion = 'us-west-1'; // Replace with your AWS region, e.g., 'us-east-1'

function fetchAllFileNamesFromBucketSync(prefix = '') {
  return new Promise((resolve, reject) => {
    const url = `https://${bucketName}.s3.${awsRegion}.amazonaws.com/?list-type=2&prefix=${encodeURIComponent(prefix)}`;

    fetch(url)
      .then((response) => response.text())
      .then((data) => {
        const parser = new DOMParser();
        const xmlData = parser.parseFromString(data, 'application/xml');

        const contents = xmlData.querySelectorAll('Contents');
        const fileNames = Array.from(contents).map((item) => item.querySelector('Key').textContent);

        const commonPrefixes = xmlData.querySelectorAll('CommonPrefixes');
        const subfolderPromises = Array.from(commonPrefixes).map((commonPrefix) => {
          const subfolder = commonPrefix.querySelector('Prefix').textContent;
          return fetchAllFileNamesFromBucketSync(subfolder);
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

async function fetchAllFileNames() {
  const topLevelFolders = ['keyboard', 'tablet'];
  const fileTypeFolders = ['audio', 'images', 'video'];

  const allFileNames = {};

  for (const topLevelFolder of topLevelFolders) {
    allFileNames[topLevelFolder] = {};

    for (const fileTypeFolder of fileTypeFolders) {
      const prefix = `${topLevelFolder}/${fileTypeFolder}/`;
      const fileNames = await fetchAllFileNamesFromBucketSync(prefix);
      allFileNames[topLevelFolder][fileTypeFolder] = fileNames;
    }
  }

  console.log(allFileNames);
}

fetchAllFileNames();
