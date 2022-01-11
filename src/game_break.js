/* mid block page */
var mid_block_page_1 = {
    type: "html-keyboard-response",
    stimulus: `
   <div>
    <h1>Good work, young wizard!</h1>
   <div>
       <p class="center" style="position: relative; top: 50%; ">You are halfway through the valley, and you decide to camp near a small village.
      <br>
      <br>
      In the village, you meet another adventurer who joins your journey! Here are your gold coins so far:
      </p>
      
   </div>
    <img class="coin" src="assets/coinicon.png" alt="coin">
    <img class="coin" src="assets/coinicon.png" alt="coin">
    <img class="scene" src="assets/half_valley.png" alt="backgroun image with hills and trees">
    <img class = 'adventure_mid_break' src="assets/adventurer1.gif" alt="adventure with harp">
</div>
   <div class="button">Press <span class="yellow">ANY KEY</span> when you&#39re ready to continue</div>
      `,
    choices: jsPsych.ALL_KEYS,
    on_start: function() {
        //set progress bar to 0 at the start of experiment
        jsPsych.setProgressBar((roarTrialNum-1) /(arrSum(stimulusCountLis)));
    }
}
//<p class = 'coin_counting'>200</p>
var mid_block_page_2 = {
    type: "html-keyboard-response",
    stimulus: `
   <div>
    <h1>Good work, young wizard!</h1>
   <div>
       <p class="center" style="position: relative; top: 50%; ">You are halfway through the valley, and you decide to camp near a small village.
      <br>
      <br>
      In the village, you meet another adventurer who joins your journey!</p>
   </div>
    <img class="coin" src="assets/coinicon.png" alt="coin">
    <img class="coin" src="assets/coinicon.png" alt="coin">
     <img class="coin" src="assets/coinicon.png" alt="coin">
    <img class="coin" src="assets/coinicon.png" alt="coin">
     <img class="coin" src="assets/coinicon.png" alt="coin">
    <img class="coin" src="assets/coinicon.png" alt="coin">
    <img class="scene" src="assets/half_valley.png" alt="backgroun image with hills and trees">
    <img class = 'adventure_mid_break' src="assets/adventurer1.gif" alt="adventure with harp">
    <img class = 'adventure_mid_break' src="assets/adventurer3.gif" alt="adventure with making heart shapes">
</div>
   <div class="button">Press <span class="yellow">ANY KEY</span> when you&#39re ready to continue</div>
    
      `,
    choices: jsPsych.ALL_KEYS,
    on_start: function() {
        //set progress bar to 0 at the start of experiment
        jsPsych.setProgressBar((roarTrialNum-1) /(arrSum(stimulusCountLis)));
    }
}

var mid_block_page_3 = {
    type: "html-keyboard-response",
    stimulus: `
   <div>
    <h1>Good work, young wizard!</h1>
   <div>
       <p class="center" style="position: relative; top: 50%; ">You are halfway through the valley, and you decide to camp near a small village.
      <br>
      <br>
      In the village, you meet another adventurer who joins your journey!</p>
   </div>
    <img class="coin" src="assets/coinicon.png" alt="coin">
    <img class="coin" src="assets/coinicon.png" alt="coin">
     <img class="coin" src="assets/coinicon.png" alt="coin">
    <img class="coin" src="assets/coinicon.png" alt="coin">
     <img class="coin" src="assets/coinicon.png" alt="coin">
    <img class="coin" src="assets/coinicon.png" alt="coin">
      <img class="coin" src="assets/coinicon.png" alt="coin">
    <img class="coin" src="assets/coinicon.png" alt="coin">
      <img class="coin" src="assets/coinicon.png" alt="coin">
    <img class="coin" src="assets/coinicon.png" alt="coin">
   <img class="scene" src="assets/half_valley.png" alt="backgroun image with hills and trees">
   <img class = 'adventure_mid_break'  src="assets/adventurer1.gif" alt="adventure with harp">
   <img class = 'adventure_mid_break'  src="assets/adventurer3.gif" alt="adventure playing rainbow">
   <img class = 'adventure_mid_break'  src="assets/adventurer2.gif" alt="adventure making heart shapes">\t
</div>
   <div class="button">Press <span class="yellow">ANY KEY</span> when you&#39re ready to continue</div>
    
      `,
    choices: jsPsych.ALL_KEYS,
    on_start: function() {
        //set progress bar to 0 at the start of experiment
        jsPsych.setProgressBar((roarTrialNum-1) /(arrSum(stimulusCountLis)));
    }
}

/* post block page */

var post_block_page_1 = {
    type: "html-keyboard-response",
    stimulus: `
   <div>
    <h1>Congratulations, young wizard!</h1>
  <div>
   <p class="center">You found the guardian and made it through the valley. 
   <br>
   <br> 
   You&#39re getting closer to the gate! Here are your gold coins so far:</p>
   </div>
   <div>
    <img class="coin" src="assets/coinicon.png" alt="coin">
    <img class="coin" src="assets/coinicon.png" alt="coin">
    <img class="coin" src="assets/coinicon.png" alt="coin">
    <img class="coin" src="assets/coinicon.png" alt="coin">
   <img class="scene" src="assets/valley.png" alt="background image of hills and trees">
\t\t<img class = 'wizard' src="assets/wizard_coin.gif" alt="adventure playing rainbow">
\t\t<img class=" guardian" src="assets/guardian1.gif" alt="adventure making heart shapes">
\t</div>

</div>
   <div class="button">Press <span class="yellow">ANY KEY</span> when you&#39re ready to continue</div>
      `,
    choices: jsPsych.ALL_KEYS,
    on_start: function() {
        //set progress bar to 0 at the start of experiment
        jsPsych.setProgressBar((roarTrialNum-1) /(arrSum(stimulusCountLis)));
    }
}

var post_block_page_2 = {
    type: "html-keyboard-response",
    stimulus: `
   <div>
    <h1>Congratulations, young wizard!</h1>
  <div>
   <p class="center">You found the guardian and made it through the valley. 
   <br>
   <br> 
   You&#39re getting closer to the gate! Here are your gold coins so far:</p>
   </div>
   <div>
    <img class="coin" src="assets/coinicon.png" alt="coin">
    <img class="coin" src="assets/coinicon.png" alt="coin">
    <img class="coin" src="assets/coinicon.png" alt="coin">
    <img class="coin" src="assets/coinicon.png" alt="coin">
    <img class="coin" src="assets/coinicon.png" alt="coin">
    <img class="coin" src="assets/coinicon.png" alt="coin">
    <img class="coin" src="assets/coinicon.png" alt="coin">
    <img class="coin" src="assets/coinicon.png" alt="coin">
   <img class="scene" src="assets/valley.png" alt="background image of hills and trees">
\t\t<img class = 'wizard' src="assets/wizard_coin.gif" alt="adventure playing rainbow">
\t\t<img class = 'guardian' src="assets/guardian2.gif" alt="adventure making heart shapes">
\t</div>

</div>
   <div class="button">Press <span class="yellow">ANY KEY</span> when you&#39re ready to continue</div>
      `,
    choices: jsPsych.ALL_KEYS,
    on_start: function() {
        //set progress bar to 0 at the start of experiment
        jsPsych.setProgressBar((roarTrialNum-1) /(arrSum(stimulusCountLis)));
    }
}


var mid_block_page_list = [mid_block_page_1,mid_block_page_2,mid_block_page_3]

var post_block_page_list = [post_block_page_1,post_block_page_2]

var final_page_1 = {
    type: "html-keyboard-response",
    stimulus: `
   <div>
    <h1>Finally, you summon the last guardian!</h1>
   <div>
   <p class="center"> It agrees to help you open the gate to return home.
   <br>
   <br>
   You say farewell to your new friends and leave the land of Lexicality. Until next time!
  </p>
   </div>
   <div>
   <img class="scene" src="assets/ending.png" alt="background image of gate">
   <img class = 'guardian' src="assets/guardian3.gif" alt="image of a unicorn winking">
   </div>

</div>
   <div class="button">Press <span class="yellow">ANY KEY</span> when you&#39re ready to continue</div>
      `,
    choices: jsPsych.ALL_KEYS,
    on_start: function() {
        //set progress bar to 0 at the start of experiment
        jsPsych.setProgressBar((roarTrialNum-1) /(arrSum(stimulusCountLis)));
    }
}

var final_page_2 = {
    type: "html-keyboard-response",
    stimulus: `
   <div>
    <h1>Finally, you summon the last guardian!</h1>
   <div>
   <p class="center"> It agrees to help you open the gate to return home.
   <br>
   <br>
   You say farewell to your new friends and leave the land of Lexicality. Until next time!
  </p>
   </div>
   <div>
   <img class="scene" src="assets/ending.png" alt="background image of gate">
   <img  class = 'guardian' src="assets/guardian3.gif" alt="image of a unicorn winking">
   </div>

</div>
   <div class="button">Press <span class="yellow">ANY KEY</span> when you&#39re ready to continue</div>
      `,
    choices: jsPsych.ALL_KEYS,
    on_start: function() {
        //set progress bar to 0 at the start of experiment
        jsPsych.setProgressBar((roarTrialNum-1) /(arrSum(stimulusCountLis)));
    }
}


var final_page_3 = {
    type: "html-keyboard-response",
    stimulus: `
   <div>
    <h1>Finally, you summon the last guardian!</h1>
   <div>
   <p class="center"> It agrees to help you open the gate to return home.
   <br>
   <br>
   You say farewell to your new friends and leave the land of Lexicality. Until next time!
  </p>
   </div>
   <div>
   <img class="scene" src="assets/ending.png" alt="background image of gate">

   <img class = 'guardian' src="assets/guardian3.gif" alt="image of a unicorn winking">
   </div>

</div>
   <div class="button">Press <span class="yellow">ANY KEY</span> when you&#39re ready to continue</div>
      `,
    choices: jsPsych.ALL_KEYS,
    on_start: function() {
        //set progress bar to 0 at the start of experiment
        jsPsych.setProgressBar((roarTrialNum-1) /(arrSum(stimulusCountLis)));
    }
}

var final_page_list = [final_page_1,final_page_2,final_page_3]
