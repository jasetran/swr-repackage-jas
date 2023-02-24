import jsPsychAudioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";
import { config } from "./config";
import { audioContent, imgContent } from "./preload";

/* mid block page */
const mid_block_page_1 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.midBlock1,
  response_allowed_while_playing: config.testingOnly,
  choices: "ALL_KEYS",
  prompt: ` 
    <div>
        <h1>Good work!</h1>
        <div>
           <p class="center" style="position: relative; top: 50%; ">You are halfway through the valley, and you decide to camp near a small village.
           <br>
           <br>
            In the village, you meet another adventurer who joins your journey!
           </p>  
        </div>
    <div class = "story-scene">
        <img class="scene" src="${imgContent.halfValley}" alt="background image with hills and trees">
        <img class = 'adventure_mid_break' src="${imgContent.adventurer1}" alt="adventurer with harp">
    </div>
    </div>
   <div class="button">Press <span class="yellow">ANY KEY</span> to continue</div>
   `,
  // on_finish: updateProgressBar(0),
};

const mid_block_page_2 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.midBlock2,
  response_allowed_while_playing: config.testingOnly,
  prompt: `
   <div>
    <h1>Amazing!</h1>
   <div>
       <p class="center" style="position: relative; top: 50%; ">After a few days of traveling, you come across an inn! 
      <br>
      <br>
      There, you meet another adventurer who joins your journey!</p>
   </div>
   <div class = "story-scene">
    <img class="scene" src="${imgContent.valley4}" alt="backgroun image with hills and trees">
    <img class = 'adventure_mid_break' src="${imgContent.adventurer1}" alt="adventurer with harp">
    <img class = 'adventure_mid_break' src="${imgContent.adventurer3}" alt="adventurer with making heart shapes">
    </div>
</div>
   <div class="button">Press <span class="yellow">ANY KEY</span> to continue</div>
      `,
  choices: "ALL_KEYS",
  // on_finish: updateProgressBar(0),
};

const mid_block_page_3 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.midBlock3,
  response_allowed_while_playing: config.testingOnly,
  prompt: `
   <div>
    <h1>Fantastic Work!</h1>
   <div>
       <p class="center" style="position: relative; top: 50%; ">You are halfway through the valley, and you decide to camp near a small village.
      <br>
      <br>
      In the village, you meet another adventurer who joins your journey!</p>
   </div>
   <div class = "story-scene">
   <img class="scene" src="${imgContent.valley3}" alt="backgroun image with hills and trees">
   <img class = 'adventure_mid_break'  src="${imgContent.adventurer1}" alt="adventurer with harp">
   <img class = 'adventure_mid_break'  src="${imgContent.adventurer3}" alt="adventurer playing rainbow">
   <img class = 'adventure_mid_break'  src="${imgContent.adventurer2}" alt="adventurer making heart shapes">
   </div>
</div>
   <div class="button">Press <span class="yellow">ANY KEY</span> to continue</div>
      `,
  choices: "ALL_KEYS",
};

// post block page
const post_block_page_1 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.endBlock1,
  response_allowed_while_playing: config.testingOnly,
  prompt: `
   <div>
    <h1>Congratulations!</h1>
  <div>
   <p class="center">With the guardian&#39s help, you made it through the valley. 
   <br>
   <br> 
   You&#39re getting closer to the gate!</p>
   </div>
   <div class = "story-scene">
   <img class="scene" src="${imgContent.valley}" alt="background image of hills and trees">
   <img class = 'wizard' src="${imgContent.wizardCoin}" alt="adventure playing rainbow">
   <img class=" guardian" src="${imgContent.guardian1}" alt="adventure making heart shapes">
   </div>
   </div>
   <div class="button">Press <span class="yellow">ANY KEY</span> to continue</div>
      `,
  choices: "ALL_KEYS",
  // on_finish: updateProgressBar(0),
};

const post_block_page_2 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.endBlock2,
  response_allowed_while_playing: config.testingOnly,
  prompt: `
   <div>
    <h1>Congratulations!</h1>
  <div>
   <p class="center">With the guardian&#39s help, you made it through the valley.
   <br>
   <br> 
   Just one more valley until you reach the gate!</p>
   </div>
   <div class = "story-scene">
   <img class="scene" src="${imgContent.valley5}" alt="background image of hills and trees">
   <img class = 'wizard' src="${imgContent.wizardCoin}" alt="adventure playing rainbow">
   <img class = 'guardian' src="${imgContent.guardian2}" alt="adventure making heart shapes">
   </div>

</div>
   <div class="button">Press <span class="yellow">ANY KEY</span> to continue</div>
      `,
  choices: "ALL_KEYS",
  // on_finish: updateProgressBar(0)
};

const mid_block_page_list = [
  mid_block_page_1,
  mid_block_page_2,
  mid_block_page_3,
];

const post_block_page_list = [post_block_page_1, post_block_page_2];

const final_page = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.endGame,
  response_allowed_while_playing: config.testingOnly,
  prompt: `
   <div>
    <h1>Finally, you found the last guardian and the gate that will bring you home!</h1>
   <div>
   <p class="center"> You use your coins to open the gate.
   <br>
   <br>
   You say farewell to your new friends and leave the land of Lexicality. Until next time!
  </p>
   </div>
   <div class = "story-scene">
   <img class="scene" src="${imgContent.endingBackground}" alt="background image of gate">
   <img class = 'guardian' src="${imgContent.guardian3}" alt="image of a unicorn winking">
   <img class = 'guardian' id = "gate" src="${imgContent.endingGateCoinbag}" alt="gate">
   </div>
</div>
   <div class="button">Press <span class="yellow">ANY KEY</span> to save your work</div>
      `,
  choices: "ALL_KEYS",

  on_finish: function () {
    document.body.style.cursor = "auto";
  },
};

export { mid_block_page_list, post_block_page_list, final_page };
