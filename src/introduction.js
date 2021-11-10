/* define instructions trial */
var instrux_1 = {
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

    <div class="button">Press <span class="yellow">Space</span> to continue
    </div>
      `,
    //post_trial_gap: 2000,
    on_start: function() {
        //set progress bar to 0 at the start of experiment
        jsPsych.setProgressBar(0);
    }
};

var instrux_2 = {
    type: "html-keyboard-response",
    stimulus: `
    <h1>A real or made-up word will flash very quickly <br/> at the center of the screen.</h1>
   <div class="row">
     <div class="column_2">
       <p>The made-up words might look like English words, but they do not mean anything in English. For example, laip, bove, or cigbert are made-up words. <span class="orange"><b>If you see a made-up word, press the LEFT ARROW KEY.</b></span></p>
     </div>
     <div class="column_2" style="background-color:#f2f2f2;">
       <p> The real words will be ones you recognize. They are real English words like is, and, basket, or lion. <span class="blue"><b> If you see a real word, press the RIGHT ARROW KEY.</b></span></p>
     </div>
  </div>

   <div class="row">
     <div class="column_2">
     <img width="100%" src="assets/arrow_left_p2.png" alt="Magic Word, Press the Left Arrow Key" align="right">
     </div>
     <div class="column_2" style="background-color:#f2f2f2; height: 180px;">
     <img width="100%" src="assets/arrow_right_p2.png" alt="Real Word, Press the Right Arrow key">
     </div>
   </div>

   <div class="button">Press <span class="yellow">Space</span> to continue
   </div>
      `,
    //post_trial_gap: 2000,
    on_start: function() {
        //set progress bar to 0 at the start of experiment
        jsPsych.setProgressBar(0);
    }
};

var instrux_3 = {
    type: "html-keyboard-response",
    stimulus: `<h1>Great work, you are ready to begin the journey! </h1>
\t  <div>
\t\t \t <p class="center"> As you travel through the valley, you’ll earn gold coins to bring home.</p>
\t\t\t  <img style="position: relative; top: 100px; " width="400px" src="assets/gold_coin.gif" alt="gold">
\t\t\t  <p class="center" style="position: relative; top: 200px; "><b>Look out for them!</b></p>
\t\t </div>
\t\t
\t<div class="button">Press <span class="yellow">Space</span> to begin
\t</div>

      `,
    //post_trial_gap: 2000,
    on_start: function() {
        //set progress bar to 0 at the start of experiment
        jsPsych.setProgressBar(0);
    }
};

/* define practice feedback trial*/
var practice_feedback = {
    type: "html-keyboard-response",
    stimulus: function () {return `
       <body>
\t<h1 class="lower"><span class=${responseColor}>You pressed the ${responseLR} arrow key, <br/> which is for ${answerRP} words! </span></h1>
\t<h3 class="lower">${currentPracStimulus}<span class=${answerColor}>  is a ${correctRP}  word.</span></h3>
\t<img class="lower" src="assets/key_p3.png" alt="arrow keys">

</body>
      `},
    post_trial_gap: 2000,
    on_start: function() {
        //set progress bar to 0 at the start of experiment
        jsPsych.setProgressBar(0);
    }
};

//arrowkey_lex.png
