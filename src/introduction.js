/* define instructions trial */
var intro_1 = {
    type: "audio-keyboard-response",
    stimulus: 'audio/page1.wav',
    choices: jsPsych.ALL_KEYS,
    prompt: `<h1>Welcome to the world of Lexicality!</h1>
        <div class="row">
          <div class="column_1">
            <img class="characterleft" src="assets/wizard_magic.gif" height="320px" alt="animation of a wizard waving a magic wand">
            </div>
          <div class="column_3">
            <p class="middle"> You are a wizard searching for the gate that will return you to your home on Earth. To reach the gate, you must journey over lands ruled by magical guardians.</p>
            <p class="middle"> In order for the guardians to let you pass through the land, you will have to tell the difference between made-up words and real words.&nbsp;</p>
          </div>
        </div>
        <div class="button">Press <span class="yellow">ANY KEY</span> to continue </div>`,
    data: {
        start_time: start_time.toLocaleString('PST'),
        start_time_unix: start_time.getTime()
    },
    on_start: function() {
        //set progress bar to 0 at the start of experiment
        //jsPsych.setProgressBar(0);
    }
};

var intro_2 = {
    type: "audio-keyboard-response",
    stimulus:'audio/page2.wav',
    prompt: `
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
    <div class="button">Press <span class="yellow">ANY KEY</span> to continue
    </div>
      `,
    //post_trial_gap: 2000,
    choices: jsPsych.ALL_KEYS,
    on_start: function() {
        //set progress bar to 0 at the start of experiment
        //jsPsych.setProgressBar(0);
    }
};
//class = stimulus_div style = "margin-top:20%">
var intro_3 = {
    type: "audio-keyboard-response",
    stimulus: 'audio/page3.wav',
    prompt: `
    <h1>Let us review which key we press for made-up words and real words.</h1>
    <div>
        <img src="assets/key_p3.png" style= "margin-top: 10%" alt="arrow keys">
        <p class = "center"> Try to be as accurate as possible. </p>
        <p class = "center">Some words will be hard, and that&#39s okay. If you&#39re not sure, just give your best guess! </p>
    </div>
    <div class="button">Press <span class="yellow">ANY KEY</span> to practice the game</div>`,
    choices: jsPsych.ALL_KEYS,
    on_start: function() {
        //jsPsych.setProgressBar(0);
    }
};

var post_practice_intro = {
    type: "audio-keyboard-response",
    stimulus: 'audio/page4.wav',
    prompt: `
    <h1>Great work, you are ready to begin the journey! </h1>
      <div>
        <p class="center"> You will earn gold coins along the way.</p>
        <img style="position: relative; top: 100px;" width="400px" src="assets/gold_coin.gif" alt="gold">
        </div>
    <div class="button">Press <span class="yellow">ANY KEY</span> to begin the game</div>`,
    choices: jsPsych.ALL_KEYS,
    on_start: function() {
        //jsPsych.setProgressBar(0);
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
        //jsPsych.setProgressBar(0);
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
        //jsPsych.setProgressBar(0);
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
    type: 'audio-keyboard-response',
    stimulus:'audio/beep.wav',
    prompt: `
        <div class = stimulus_div><p class = 'stimulus' style="font-size:60px;">3</p></div>
        <img class="lower" src="assets/arrowkey_lex.png" alt="arrow keys" style=" width:698px; height:120px">`,
    choices: jsPsych.NO_KEYS,
    trial_duration: 1000,
    data: {
        task: 'countdown'
    },
    on_finish: function(){
        jsPsych.setProgressBar((roarTrialNum-1) /(arrSum(stimulusCountLis)));
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
        jsPsych.setProgressBar((roarTrialNum-1) /(arrSum(stimulusCountLis)));
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
        jsPsych.setProgressBar((roarTrialNum-1) /(arrSum(stimulusCountLis)));
    }
};

/* coin tracking trial*/
var coin_tracking_feedback= {
    type: 'audio-keyboard-response',
    stimulus:'audio/fairy_coin_sound.wav',
    prompt: `<img class = "coin_feedback" width="400px"  src="assets/coinbag.gif" alt="gold">`,
    choices: jsPsych.NO_KEYS,
    trial_duration: 2000,
    on_finish: function(){
        jsPsych.setProgressBar((roarTrialNum-1) /(arrSum(stimulusCountLis)));
    }
};

var if_coin_tracking = {
    timeline: [coin_tracking_feedback],
    conditional_function: function(){
        if (Boolean(currentTrialCorrect) && (coinTrackingIndex >= 10)) {
            coinTrackingIndex = 0;
            return true;
        }
        else{
            coinTrackingIndex += 1;
            return false;
        }
    }
}