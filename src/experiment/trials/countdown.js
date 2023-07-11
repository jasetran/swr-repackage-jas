import {  mediaAssets, isTouchScreen, } from "../config/preload"
import jsPsychAudioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";


const countDownData = [
    {audio: mediaAssets.audio.countdown3, count: 3}, 
    {audio: mediaAssets.audio.countdown2, count: 2},
    {audio: mediaAssets.audio.countdown1, count: 1},
    {audio: mediaAssets.audio.countdown0, count: 0},
  ]
  
  const countDownTrials = countDownData.map(trial => {
    return (
      {
        type: jsPsychAudioKeyboardResponse,
        stimulus: () => audioContent[`countdown${trial.count}`],
        prompt: () => {
          return (`
            <div id='${isTouchScreen ? 'countdown-wrapper' : ''}'>
              <div class='stimulus_div'>
                <p class='stimulus'>${trial.count}</p>
              </div>
              ${isTouchScreen ? (
                  `<div id='countdown-arrows-wrapper'>
                    <div class="countdown-arrows">
                      <img class='btn-arrows' src=${mediaAssets.images.staticLeftKey} alt='left arrow' />
                    </div>
                    <div class="countdown-arrows">
                      <img class='btn-arrows' src=${mediaAssets.images.staticRightKey} alt='right arrow' />
                    </div>
                  </div>`
              ) : (
                  `<img class="lower" src="${mediaAssets.images.arrowkeyLex}" alt="arrow keys">`
              )}
            </div>
            `
          )
        },
        choices: "NO_KEYS",
        trial_duration: 1000,
        data: {
          task: 'countdown'
        },
      }
    )
  })
  
  
  export const countdown_trials = {
    timeline: countDownTrials
  };