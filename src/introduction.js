/* define instructions trial */
var intro_1 = {
    type: "html-keyboard-response",
    stimulus: `
    <h1>Welcome to the world of Lexicality!</h1>
        <div class="row">
          <div class="column_1">
            <img class="characterleft" src="assets/wizard_magic.gif" height="320px" alt="animation of a wizard waving a magic wand">
            </div>
          <div class="column_3">
            <p class="middle"> You are a young wizard searching for the gate that will return you to your home on Earth. To reach it, you must journey over lands ruled by magical guardians.</p>
            <p class="middle"> To call the guardian to let you through, you will tell the difference between made-up words and real words. &nbsp;</p>
          </div>
        </div>
      `,
    choices: [' '],
    prompt: `<div class="button">Press <span class="yellow">Space</span> to continue </div>`,
    data: {
        start_time: start_time.toLocaleString('PST'),
        start_time_unix: start_time.getTime()
    },
    //post_trial_gap: 2000,
    on_start: function() {
        //set progress bar to 0 at the start of experiment
        jsPsych.setProgressBar(0);
    }
};

var intro_2 = {
    type: "html-keyboard-response",
    stimulus: `
    <h1>A real or made-up word will flash very quickly <br/> at the center of the screen.</h1>
    <div class="row">
     <div class="column_2_upper" style="background-color:#f2f2f2;">
       <p>The made-up words might look like English words, but they do not mean anything in English. For example, laip, bove, or cigbert are made-up words. <span class="orange"><b>If you see a made-up word, press the LEFT ARROW KEY.</b></span></p>
     </div>
     <div class="column_2_upper" style="background-color:#f2f2f2;">
       <p> The real words will be ones you recognize. They are real English words like is, and, basket, or lion. <span class="blue"><b> If you see a real word, press the RIGHT ARROW KEY.</b></span></p>
     </div>
    </div>

    <div class="row">
     <div class="column_2_lower" style="background-color:#f2f2f2;">
     <img width="100%" src="assets/arrow_left_p2.png" alt="Magic Word, Press the Left Arrow Key" align="right">
     </div>
     <div class="column_2_lower" style="background-color:#f2f2f2; height: 180px;">
     <img width="100%" src="assets/arrow_right_p2.png" alt="Real Word, Press the Right Arrow key">
     </div>
    </div>

    <div class="button">Press <span class="yellow">Space</span> to continue
    </div>
      `,
    //post_trial_gap: 2000,
    choices: [' '],
    on_start: function() {
        //set progress bar to 0 at the start of experiment
        jsPsych.setProgressBar(0);
    }
};

var intro_3 = {
    type: "html-keyboard-response",
    stimulus: `
    <h1>This picture will remind you which key to press. 
    <br>Remember:</h1>
   
    <div class = stimulus_div style = "margin-top:20%">
    <img src="assets/key_p3.png" alt="arrow keys">
    <p class="center" style="position: relative; top: 200px;"> <b>Try to be as accurate as possible.</b> <br/> Some words will be hard, and that&#39s okay. If you&#39re not sure, just give your best guess! </p>
    </div>
    <div class="button">Press <span class="yellow">Space</span> to practice the game</div>`,
    choices: [' '],
    on_start: function() {
        jsPsych.setProgressBar(0);
    }
};

var post_practice_intro = {
  type: "html-keyboard-response",
  stimulus: `
    <h1>Great work, you are ready to begin the journey! </h1>
      <div>
        <p class="center"> As you travel through the valley, you&#39ll earn gold coins to bring home.</p>
        <img style="position: relative; top: 100px; " width="400px" src="assets/gold_coin.gif" alt="gold">
        <p class="center" style="position: relative; top: 200px; "><b>Look out for them!</b></p>
        </div>
    <div class="button">Press <span class="yellow">Space</span> to begin the game</div>`,
    choices: [' '],
    on_start: function() {
      jsPsych.setProgressBar(0);
    }
};

/* define practice feedback trial*/
var practice_feedback_left = {
    type: "html-keyboard-response",
    stimulus: function () {return `<div class = stimulus_div>
\t<p class="feedback"><span class=${responseColor}>You pressed the ${responseLR} arrow key, which is for ${answerRP} words! </span>
<br></br>${currentPracStimulus}<span class=${answerColor}>  is a ${correctRP}  word. Press ${correctLR} arrow key to continue.</span></p>
</div>
      `},
    //post_trial_gap: 2000,
    prompt: ` 
    <img class="lower" src= "assets/arrowkey_lex_left.gif" alt="arrow keys" style=" width:698px; height:120px">
   `,
    choices: ['ArrowLeft'],
    on_start: function() {
        jsPsych.setProgressBar(0);
    }
};


var practice_feedback_right = {
    type: "html-keyboard-response",
    stimulus: function () {return `<div class = stimulus_div>
\t<p class="feedback"><span class=${responseColor}>You pressed the ${responseLR} arrow key, which is for ${answerRP} words! </span>
<br></br>${currentPracStimulus}<span class=${answerColor}>  is a ${correctRP}  word. Press ${correctLR} arrow key to continue.</span></p>
</div>
      `},
    //post_trial_gap: 2000,
    prompt: `
    <img class="lower" src= "assets/arrowkey_lex_right.gif" alt="arrow keys" style=" width:698px; height:120px"> 
    `,
    choices: ['ArrowRight'],
    on_start: function() {
        //set progress bar to 0 at the start of experiment
        jsPsych.setProgressBar(0);
    }
};

var if_node_left = {
    timeline: [practice_feedback_left],
    conditional_function: function(){
        if (correctRP == 'made-up') {
            return true;
        }
        else {
            return false;
        }
    }
}

var if_node_right = {
    timeline: [practice_feedback_right],
    conditional_function: function(){
        if (correctRP == 'real') {
            return true;
        }
        else {
            return false;
        }
    }
}



/* Countdown trial*/
var countdown_trial_3= {
    type: 'html-keyboard-response',
    stimulus: function(){return `<div class = stimulus_div><p class = 'stimulus' style="font-size:60px;">3</p></div>`},
    prompt:  ` <img class="lower" src="assets/arrowkey_lex.png" alt="arrow keys" style=" width:698px; height:120px">`,
    choices: jsPsych.NO_KEYS,
    trial_duration: 1000,
    data: {
        task: 'countdown'
    },
    on_finish: function(){
        jsPsych.setProgressBar(0);
    }
};

var countdown_trial_2= {
    type: 'html-keyboard-response',
    stimulus: function(){return `<div class = stimulus_div><p class = 'stimulus' style="font-size:60px;">2</p></div>`},
    prompt:  ` <img class="lower" src="assets/arrowkey_lex.png" alt="arrow keys" style=" width:698px; height:120px">`,
    choices: jsPsych.NO_KEYS,
    trial_duration: 1000,
    data: {
        task: 'countdown'
    },
    on_finish: function(){
        jsPsych.setProgressBar(0);
    }
};

var countdown_trial_1= {
    type: 'html-keyboard-response',
    stimulus: function(){return `<div class = stimulus_div><p class = 'stimulus' style="font-size:60px;">1</p></div>`},
    prompt:  ` <img class="lower" src="assets/arrowkey_lex.png" alt="arrow keys" style=" width:698px; height:120px">`,
    choices: jsPsych.NO_KEYS,
    trial_duration: 1000,
    data: {
        task: 'countdown'
    },
    on_finish: function(){
        jsPsych.setProgressBar(0);
    }
};

var mid_block_page = {
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
   <img class="scene" src="assets/half_valley.png" alt="backgroun image with hills and trees">
   <img style="position: relative; margin-bottom: -10%; bottom: 100px" height="220px" src="assets/adventurer2.gif" alt="adventure with harp">
   <img style="position: relative; margin-bottom: -10%; bottom: 100px" height="220px" src="assets/adventurer1.gif" alt="adventure playing rainbow">
   <img style="position: relative; margin-bottom: -10%; bottom: 100px" height="220px" src="assets/adventurer3.gif" alt="adventure making heart shapes">\t
</div>
   <div class="button">Press <span class="yellow">Space</span> when you&#39re ready to continue</div>
    
      `,
    choices: [' '],
    on_start: function() {
        //set progress bar to 0 at the start of experiment
        jsPsych.setProgressBar((roarTrialNum-1) /(arrSum(stimulusCountLis)));
    }
}

var post_block_page = {
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
   <img class="scene" src="assets/valley.png" alt="background image of hills and trees">
\t\t<img style="position: relative; margin-bottom: -10%;bottom: 180px; right: 20%;" height="300px" src="assets/wizard_coin.gif" alt="adventure playing rainbow">
\t\t<img style="position: relative; margin-bottom: -10%;bottom: 180px; left: 10%;" height="300px" src="assets/guardian1.gif" alt="adventure making heart shapes">
\t</div>

</div>
   <div class="button">Press <span class="yellow">Space</span> when you&#39re ready to continue</div>
      `,
    choices: [' '],
    on_start: function() {
        //set progress bar to 0 at the start of experiment
        jsPsych.setProgressBar((roarTrialNum-1) /(arrSum(stimulusCountLis)));
    }
}

var final_page = {
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
  <img style="position: relative; margin-bottom: -10%;bottom: 180px; " height="300px" src="assets/guardian3.gif" alt="image of a unicorn winking">
   </div>

</div>
   <div class="button">Press <span class="yellow">Space</span> when you&#39re ready to continue</div>
      `,
    choices: [' '],
    on_start: function() {
        //set progress bar to 0 at the start of experiment
        jsPsych.setProgressBar((roarTrialNum-1) /(arrSum(stimulusCountLis)));
    }
}
