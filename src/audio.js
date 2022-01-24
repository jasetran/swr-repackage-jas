/* response feedback: coin_sound vs. fail_sound */
var audio_response_correct = {
    type: 'audio-keyboard-response',
    stimulus: 'audio/coin_sound.wav',
    choices: jsPsych.NO_KEYS,
    trial_ends_after_audio: true,
    prompt:  `<div class = stimulus_div><p class = 'stimulus' style="font-size:60px;"><br></p></div> 
              <img class="lower" src="assets/arrowkey_lex.png" alt="arrow keys" style=" width:698px; height:120px">`
};

var if_audio_response_correct = {
    timeline: [audio_response_correct],
    conditional_function: function(){
        if (currentTrialCorrect) {
            return true;
        }
        else {
            return false;
        }
    }
}

var audio_response_wrong = {
    type: 'audio-keyboard-response',
    stimulus: 'audio/fail_sound.wav',
    choices: jsPsych.NO_KEYS,
    trial_ends_after_audio: true,
    prompt:  `<div class = stimulus_div><p class = 'stimulus' style="font-size:60px;"><br></p></div> 
              <img class="lower" src="assets/arrowkey_lex.png" alt="arrow keys" style=" width:698px; height:120px">`
};

var if_audio_response_wrong = {
    timeline: [audio_response_wrong],
    conditional_function: function(){
        if (currentTrialCorrect) {
            return false;
        }
        else {
            return true;
        }
    }
}
