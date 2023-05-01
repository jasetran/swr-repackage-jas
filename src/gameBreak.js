import jsPsychAudioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";
import { config } from "./config";
import { audioContent, imgContent } from "./preload";
import { isTouchScreen } from "./preload";
import AudioMultiResponsePlugin from "@jspsych-contrib/plugin-audio-multi-response";

/* mid block page */

const midBlockTrialsContent = [
  {
    stimulus: () => isTouchScreen ? audioContent.midBlock1T : audioContent.midBlock1,
    prompt: () => {
      return (
        `<div>
            <h1>Good work!</h1>
            <div>
              <p class="center" style="position: relative; top: 50%; margin-bottom: 1.5rem;">You are halfway through the valley, and you decide to camp near a small village.</p>

              <p class="center" style="position: relative; top: 50%;">In the village, you meet another adventurer who joins your journey!</p>  
            </div>
            <div class = "story-scene">
              <img class="scene" src="${imgContent.halfValley}" alt="background image with hills and trees">
              <img class = 'adventure_mid_break' src="${imgContent.adventurer1}" alt="adventurer with harp">
            </div>
          </div>
    ${!isTouchScreen ? '<div class="button">Press <span class="yellow">ANY KEY</span> to continue</div>' : ''}`
      )
    }
  },
  {
    stimulus: () => isTouchScreen ? audioContent.midBlock2T : audioContent.midBlock2,
    prompt: () => {
      return (`
        <div>
          <h1>Amazing!</h1>
          <div>
            <p class="center" style="position: relative; top: 50%; margin-bottom: 1.5rem;">After a few days of traveling, you come across an inn! </p>
            <p class="center" style="position: relative; top: 50%;">There, you meet another adventurer who joins your journey!</p>
          </div>
          <div class="story-scene">
            <img class="scene" src="${imgContent.valley4}" alt="backgroun image with hills and trees">
            <img class = 'adventure_mid_break' src="${imgContent.adventurer1}" alt="adventurer with harp">
            <img class = 'adventure_mid_break' src="${imgContent.adventurer3}" alt="adventurer with making heart shapes">
          </div>
        </div>
        ${!isTouchScreen ? '<div class="button">Press <span class="yellow">ANY KEY</span> to continue</div>' : ''}`
      )
    }
  },
  {
    stimulus: () => isTouchScreen ? audioContent.midBlock3T : audioContent.midBlock3,
    prompt: () => {
      return (`
        <div>
          <h1>Fantastic Work!</h1>
          <div>
              <p class="center" style="position: relative; top: 50%; margin-bottom: 1.5rem;">You are halfway through the valley, and you decide to camp near a small village.</p>

              <p class="center" style="position: relative; top: 50%;">In the village, you meet another adventurer who joins your journey!</p>
          </div>
          <div class="story-scene">
            <img class="scene" src="${imgContent.valley3}" alt="backgroun image with hills and trees">
            <img class = 'adventure_mid_break'  src="${imgContent.adventurer1}" alt="adventurer with harp">
            <img class = 'adventure_mid_break'  src="${imgContent.adventurer3}" alt="adventurer playing rainbow">
            <img class = 'adventure_mid_break'  src="${imgContent.adventurer2}" alt="adventurer making heart shapes">
          </div>
        </div>
        ${!isTouchScreen ? '<div class="button">Press <span class="yellow">ANY KEY</span> to continue</div>' : ''}
      `
      )
    }
  }
]

const midBlockTrialsMapped = midBlockTrialsContent.map(trial => {
  return (
    {
      type: AudioMultiResponsePlugin,
      stimulus: trial.stimulus,
      keyboard_choices: () => isTouchScreen ? "NO_KEYS" : "ALL_KEYS",
      button_choices: () => isTouchScreen ? ["HERE"] : [],
      button_html: "<button class='button'>Press <span class='yellow'>%choice%</span> to continue</button>",
      response_allowed_while_playing: config.testingOnly,
      prompt: trial.prompt,
      prompt_above_buttons: true,
    }
  )
})

const mid_block_page_list = [...midBlockTrialsMapped];

// post block page

const postBlockTrialsContent = [
  {
    stimulus: () => isTouchScreen ? audioContent.endBlock1T : audioContent.endBlock1,
    prompt: () => {
      return (
        `
        <div>
          <h1>Congratulations!</h1>
          <div>
            <p class="center" style="margin-bottom: 1.5rem;">With the guardian&#39s help, you made it through the valley.</p> 

            <p class="center">You&#39re getting closer to the gate!</p>
            
          </div>
          <div class = "story-scene">
            <img class="scene" src="${imgContent.valley}" alt="background image of hills and trees">
            <img class='wizard' src="${imgContent.wizardCoin}" alt="adventure playing rainbow">
            <img class="guardian" src="${imgContent.guardian1}" alt="adventure making heart shapes">
          </div>
        </div>
        ${!isTouchScreen ? '<div class="button">Press <span class="yellow">ANY KEY</span> to continue</div>' : ''}
        `
      )
    }
  },
  {
    stimulus: () => isTouchScreen ? audioContent.endBlock2T : audioContent.endBlock2,
    prompt: () => {
      return (
        `
        <div>
          <h1>Congratulations!</h1>
          <div>
            <p class="center" style="margin-bottom: 1.5rem;">With the guardian&#39s help, you made it through the valley.</p>

            <p class="center">Just one more valley until you reach the gate!</p>
          </div>
          <div class="story-scene">
            <img class="scene" src="${imgContent.valley5}" alt="background image of hills and trees">
            <img class='wizard' src="${imgContent.wizardCoin}" alt="adventure playing rainbow">
            <img class='guardian' src="${imgContent.guardian2}" alt="adventure making heart shapes">
          </div>
        </div>
        ${!isTouchScreen ? '<div class="button">Press <span class="yellow">ANY KEY</span> to continue</div>' : ''}
        `
      )
    }
  },
]

const postBlockTrialsMapped = postBlockTrialsContent.map(trial => {
  return (
    {
      type: AudioMultiResponsePlugin,
      stimulus: trial.stimulus,
      keyboard_choices: () => isTouchScreen ? "NO_KEYS" : "ALL_KEYS",
      button_choices: () => isTouchScreen ? ["HERE"] : [],
      button_html: "<button class='button'>Press <span class='yellow'>%choice%</span> to continue</button>",
      response_allowed_while_playing: config.testingOnly,
      prompt: trial.prompt,
      prompt_above_buttons: true,
    }
  )
})

const post_block_page_list = [...postBlockTrialsMapped];

const final_page = {
  type: AudioMultiResponsePlugin,
  stimulus: () => isTouchScreen ? audioContent.endGameT : audioContent.endGame,
  keyboard_choices: () => isTouchScreen ? "NO_KEYS" : "ALL_KEYS",
  button_choices: () => isTouchScreen ? ["HERE"] : [],
  button_html: "<button class='button'>Press <span class='yellow'>%choice%</span> to save your work</button>",
  response_allowed_while_playing: config.testingOnly,
  prompt_above_buttons: true,
  prompt: `
      <div>
        <h1>Finally, you found the last guardian and the gate that will bring you home!</h1>
        <div>
          <p class="center" style="margin-bottom: 1.5rem;"> You use your coins to open the gate.</p>

          <p class="center">You say farewell to your new friends and leave the land of Lexicality. Until next time!</p>
        </div>
        <div class="story-scene">
          <img class="scene" src="${imgContent.endingBackground}" alt="background image of gate">
          <img class='guardian' src="${imgContent.guardian3}" alt="image of a unicorn winking">
          <img class='guardian' id = "gate" src="${imgContent.endingGateCoinbag}" alt="gate">
        </div>
      </div>
      ${!isTouchScreen ? '<div class="button">Press <span class="yellow">ANY KEY</span> to save your work</div>' : ''}
      `,

  on_finish: function () {
    document.body.style.cursor = "auto";
  },
};

export { mid_block_page_list, post_block_page_list, final_page };
