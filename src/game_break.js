/* mid block page */
var mid_block_page_1 = {
    type: "html-keyboard-response",
    stimulus: `
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
    <img class="scene" src="assets/half_valley.png" alt="backgroun image with hills and trees">
    <img class = 'adventure_mid_break' src="assets/adventurer1.gif" alt="adventure with harp">
    </div>
</div>
   <div class="button">Press <span class="yellow">ANY KEY</span> when you&#39re ready to continue</div>
      `,
    //choices: jsPsych.ALL_KEYS,
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
    <h1>Amazing!</h1>
   <div>
       <p class="center" style="position: relative; top: 50%; ">After a few days of traveling, you come across an inn! 
      <br>
      <br>
      There, you meet another adventurer who joins your journey!</p>
   </div>
   <div class = "story-scene">
    <img class="scene" src="assets/valley_4.png" alt="backgroun image with hills and trees">
    <img class = 'adventure_mid_break' src="assets/adventurer1.gif" alt="adventure with harp">
    <img class = 'adventure_mid_break' src="assets/adventurer3.gif" alt="adventure with making heart shapes">
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

var mid_block_page_3 = {
    type: "html-keyboard-response",
    stimulus: `
   <div>
    <h1>Fantastic Work!</h1>
   <div>
       <p class="center" style="position: relative; top: 50%; ">You are halfway through the valley, and you decide to camp near a small village.
      <br>
      <br>
      In the village, you meet another adventurer who joins your journey!</p>
   </div>
   <div class = "story-scene">
   <img class="scene" src="assets/valley_3.png" alt="backgroun image with hills and trees">
   <img class = 'adventure_mid_break'  src="assets/adventurer1.gif" alt="adventure with harp">
   <img class = 'adventure_mid_break'  src="assets/adventurer3.gif" alt="adventure playing rainbow">
   <img class = 'adventure_mid_break'  src="assets/adventurer2.gif" alt="adventure making heart shapes">
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

/* post block page */

var post_block_page_1 = {
    type: "html-keyboard-response",
    stimulus: `
   <div>
    <h1>Congratulations!</h1>
  <div>
   <p class="center">With the guardian&#39s help, you made it through the valley. 
   <br>
   <br> 
   You&#39re getting closer to the gate!</p>
   </div>
   <div class = "story-scene">
   <img class="scene" src="assets/valley.png" alt="background image of hills and trees">
   <img class = 'wizard' src="assets/wizard_coin.gif" alt="adventure playing rainbow">
   <img class=" guardian" src="assets/guardian1.gif" alt="adventure making heart shapes">
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

var post_block_page_2 = {
    type: "html-keyboard-response",
    stimulus: `
   <div>
    <h1>Congratulations!</h1>
  <div>
   <p class="center">With the guardian&#39s help, you made it through the valley.
   <br>
   <br> 
   Just one more valley until you reach the gate!</p>
   </div>
   <div class = "story-scene">
   <img class="scene" src="assets/valley_5.png" alt="background image of hills and trees">
   <img class = 'wizard' src="assets/wizard_coin.gif" alt="adventure playing rainbow">
   <img class = 'guardian' src="assets/guardian2.gif" alt="adventure making heart shapes">
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

var mid_block_page_list = [mid_block_page_1,mid_block_page_2,mid_block_page_3]

var post_block_page_list = [post_block_page_1,post_block_page_2]

var final_page = {
    type: "html-keyboard-response",
    stimulus: `
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
   <img class="scene" src="assets/ending_background.png" alt="background image of gate">
   <img class = 'guardian' src="assets/guardian3.gif" alt="image of a unicorn winking">
   <img class = 'guardian' id = "gate" src="assets/ending_gate_coinbag.gif" alt="gate">
   
   </div>

</div>
   <div class="button">Press <span class="yellow">ANY KEY</span> when you&#39re to save your work</div>
      `,
    //choices: jsPsych.ALL_KEYS,
    on_start: function() {
        //set progress bar to 0 at the start of experiment
        jsPsych.setProgressBar((roarTrialNum-1) /(arrSum(stimulusCountLis)));
    }
}
