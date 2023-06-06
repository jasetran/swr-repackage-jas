import i18next from "i18next";
import '../i18n'
import { keyboardPaths, sharedPaths, tabletPaths } from "./fileList.js";
import jsPsychCallFunction from "@jspsych/plugin-call-function"
import { preloadObj2contentObj, deviceAudio } from "./preload";
import jsPsychPreload from "@jspsych/plugin-preload";
import { preload_trials } from "./preload";

const sharedAudio = []
const keyboardAudio = []
const tabletAudio = []

const lng = i18next.language

export let audioBlocksKeyboard
  
export let audioBlocksTablet

export let audioContent

// TEST

export let preload_audio_trials = []

// TEST

export const importModulesTrial = {
    type: jsPsychCallFunction,
    async: true,
    func: async function importModules(done) {

        const audioDirectories = [`${lng}/keyboard/`, `${lng}/shared/`,  `${lng}/tablet/`];
        const audioPaths = [keyboardPaths, sharedPaths, tabletPaths]

        const promises = audioPaths.flatMap((files, i) => {
            return files.map(async (file) => {
              const module = await import(`../../audio/${audioDirectories[i]}${file}`);
          
              if (i === 0) {
                keyboardAudio.push(module.default);
              } else if (i === 1) {
                sharedAudio.push(module.default);
              } else {
                tabletAudio.push(module.default);
              }
            });
        });
        
        await Promise.all(promises);
      
        if ((sharedAudio.length && keyboardAudio.length) || (sharedAudio.length && tabletAudio.length)) {
            audioBlocksKeyboard = {
                1: sharedAudio,
                2: keyboardAudio
            };
            audioBlocksTablet = {
                1: sharedAudio,
                2: tabletAudio
            };

            audioContent = preloadObj2contentObj(deviceAudio())

            preload_audio_trials = Object.entries(deviceAudio()).map((element) => {
              const idx = element[0];
              const audio_block = element[1];
              return {
                type: jsPsychPreload,
                audio: audio_block,
                auto_preload: false,
                message: () => `${idx} ${i18next.t('preloadTrial.messageText')}`,
                show_progress_bar: true,
                show_detailed_errors: true,
              };
            });

            preload_trials.push(preload_audio_trials[0])
            preload_trials.push(preload_audio_trials[1])

            done()
        }
      }
}
