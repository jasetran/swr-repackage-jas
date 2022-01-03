/* add introduction trials*/
var enter_fullscreen = {
    type: 'fullscreen',
    fullscreen_mode: true
}

timeline.push(enter_fullscreen);
var countdown_trials = {
    timeline: [countdown_trial_3,countdown_trial_2,countdown_trial_1]
}

var introduction_trials = {
    timeline: [intro_1, intro_2, intro_3]
}
timeline.push(introduction_trials);
timeline.push(countdown_trials);

/* debrief trials*/

var debrief_block = {
    type: "html-keyboard-response",
    stimulus: function() {

        var trials = jsPsych.data.get().filter({task: 'response'});
        var correct_trials = trials.filter({correct: true});
        var incorrect_trials = trials.filter({correct: false});
        var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
        var rt = Math.round(correct_trials.select('rt').mean());
        var irt = Math.round(incorrect_trials.select('rt').mean());

        console.log(difficultyHistory);
        stimulusLists[currentBlockIndex];

        return `<p>You responded correctly on ${accuracy}% of the trials.</p>
          <p>Your average response time on correct trials was ${rt}ms.</p>
          <p>Your average response time on incorrect trials was ${irt}ms.</p>
          <p>Press any key to complete the experiment. Thank you!</p>`;

    }
};

function readCSV(url) {
    return new Promise((resolve, reject) => {
        Papa.parse(
            url, {
                download: true,
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: function (results) {
                    var csv_stimuli = results.data
                    resolve(csv_stimuli)
                }
            })
    })
}

//function to update the span as appropriate (using a 2:1 staircase procedure)


/* For Practice Trial Only */
var setup_fixation_practice = {
    type: 'html-keyboard-response',
    stimulus: function(){return `<div class = stimulus_div><p class = 'stimulus' style="font-size:60px;">+</p></div>`},
    prompt:  ` <img class="lower" src="assets/arrowkey_lex.png" alt="arrow keys" style=" width:698px; height:120px">`,
    choices: jsPsych.NO_KEYS,
    trial_duration: fixationTime[fixationTimeIndex],
    data: {
        task: 'fixation'
    },
    on_finish: function(){
        jsPsych.setProgressBar(0);
    }
};

var lexicality_test_practice = {
    type: "html-keyboard-response",
    stimulus: function(){return jsPsych.timelineVariable('stimulus')},
    prompt: `<img class="lower" src="assets/arrowkey_lex.png" alt="arrow keys" style=" width:698px; height:120px">`,
    stimulus_duration: function() {
        practiceIndex += 1;
        if (practiceIndex > countSlowPractice) {
            stimulusTimeIndexPracticeOnly = 1;
        }
        console.log(stimulusTime[trialTimeIndex]);
        return stimulusTime[stimulusTimeIndexPracticeOnly]},
    trial_duration: function() {return trialTime[trialTimeIndex]},
    choices: ['ArrowLeft', 'ArrowRight'],
    data:  {
        task: 'response', /* tag the test trials with this taskname so we can filter data later */
    },
    on_finish: function(data){
        currentPracStimulus = jsPsych.timelineVariable('raw_stimulus');
        data.correct = jsPsych.pluginAPI.compareKeys(data.response, jsPsych.timelineVariable('correct_response'));
        console.log(data.response);
        if (data.response === 'arrowleft') {
            responseLR = 'left';
            answerRP = 'made-up';
            responseColor = 'orange';
        }
        else {
            responseLR = 'right';
            answerRP = 'real';
            responseColor = 'blue';
        };
        if (jsPsych.timelineVariable('correct_response') === 'ArrowLeft'){
            correctLR = 'left';
            correctRP = 'made-up';
            arrowDisplay = "assets/arrowkey_lex_left.gif";

            answerColor = 'orange';
        }
        else {correctRP = 'real';
            correctLR = 'right';
            arrowDisplay = "assets/arrowkey_lex_right.gif";
            answerColor = 'blue';};
        jsPsych.setProgressBar(0);
    }
};

//set-up screen
var setup_fixation = {
    type: 'html-keyboard-response',
    stimulus: function(){return `<div class = stimulus_div><p class = 'stimulus' style="font-size:60px;">+</p></div>`},
    prompt:  ` <img class="lower" src="assets/arrowkey_lex.png" alt="arrow keys" style=" width:698px; height:120px">`,
    choices: jsPsych.NO_KEYS,
    trial_duration: fixationTime[fixationTimeIndex],
    data: {
        task: 'fixation'
    },

    on_finish: function(){
        if(roarTrialNum == 1) {
            currentDifficulty = startingDifficulty;
        }
        nextStimulus = getStimuli(stimulusRule,currentDifficulty); //get the current stimuli for the trial
        difficultyHistory[roarTrialNum-1]=currentDifficulty; //log the current span in an array
        roarTrialNum += 1; //add 1 to the total trial count
        jsPsych.setProgressBar((roarTrialNum-1) /(arrSum(stimulusCountLis)));
    }

};

var lexicality_test = {
    type: "html-keyboard-response",
    stimulus: function() {return nextStimulus['stimulus']},
    prompt: `<img class="lower" src="assets/arrowkey_lex.png" alt="arrow keys" style=" width:698px; height:120px">`,
    stimulus_duration: stimulusTime[stimulusTimeIndex],
    trial_duration: trialTime[trialTimeIndex],
    choices: ['ArrowLeft', 'ArrowRight'],
    data:  {
        task: 'response', /* tag the test trials with this taskname so we can filter data later */
    },
    on_finish: function(data){
        data.correct = jsPsych.pluginAPI.compareKeys(data.response, nextStimulus['correct_response']);
        if (data.correct){
            staircaseChecker[staircaseIndex] = 1;
        } else {staircaseChecker[staircaseIndex] = 0;}

        if(roarTrialNum == 1) {
            currentDifficulty = startingDifficulty;
        }

        staircaseIndex += 1; //update the staircase index
        currentDifficulty = nextStimulus['difficulty'];
        //console.log(staircaseChecker);

        jsPsych.data.addDataToLastTrial({
            correct_response: nextStimulus['correct_response'],
            difficulty:nextStimulus['difficulty'],
            current_block: currentBlock

        });

        if (stimulusRule === 'adaptive'){
            updateDifficulty()
        }

        updateCorrectChecker()

        //var curr_progress_bar_value = jsPsych.getProgressBarCompleted();
        jsPsych.setProgressBar((roarTrialNum-1) /(arrSum(stimulusCountLis)));
    }
};

function checkAvailableDifficulty(targetDifficulty,direction) {
    if ((targetDifficulty >= difficultyLevels) || ((targetDifficulty < 0) ) ){
        return null;
    }

    if (stimulusIndex[currentBlock][targetDifficulty] < stimulusLists[currentBlockIndex][1][targetDifficulty].length){
        //target difficulty stimulus is available

        return targetDifficulty;
    } else {
        //console.log("No AVAILABLE! Updating difficulty level " + targetDifficulty + " " + direction);
        if (direction === 'increase') {
            if (targetDifficulty === (difficultyLevels - 1)) {
                return null;
            }
            else {return checkAvailableDifficulty(targetDifficulty + 1, direction)}
        }
        else if (direction === 'decrease'){
            if (targetDifficulty === 0) {
                return null;
            }
            else {return checkAvailableDifficulty(targetDifficulty - 1, direction)}

        }

        else {
            var lower_difficulty = checkAvailableDifficulty(targetDifficulty - 1, 'decrease');
            var higher_difficulty = checkAvailableDifficulty(targetDifficulty + 1, 'increase');
            if ((lower_difficulty === null) && (lower_difficulty === null)) {
                console.log('WARNING! no more stimuli!');
                return null;
            } else if (lower_difficulty === null) {
                return higher_difficulty
            } else if (higher_difficulty === null) {
                return lower_difficulty
            } else {
                if (Math.abs(lower_difficulty - targetDifficulty) >= Math.abs(higher_difficulty - targetDifficulty)) {

                    return higher_difficulty;
                } else {
                    return lower_difficulty;
                }
            }
        }
    }

}

function updateDifficulty() {
    console.log("currentDifficulty " + currentDifficulty);
    //if they got the last trial correct, increase the span.
    if (arrSum(staircaseChecker) == 2) {
        currentDifficulty += 1; //add to the span if last two trials were correct
        if (currentDifficulty == difficultyLevels) {
            currentDifficulty -= 1; //make sure the experiment cannot break with exceptionally poor performance (floor of 1 digit)
            console.log("too high!")
        }
        staircaseChecker = []; //reset the staircase checker
        staircaseIndex = 0; //reset the staircase index

        //if they got the last two trials incorrect, decrease the span
    } else if (arrSum(staircaseChecker) == 1) {
        if(staircaseChecker.length == 2) {
            currentDifficulty -= 1; //lower the span if last two trials were incorrect
            if (currentDifficulty == -1) {
                currentDifficulty = 0; //make sure the experiment cannot break with exceptionally poor performance (floor of 1 digit)
            }
            staircaseChecker = []; //reset the staircase checker
            staircaseIndex = 0; //reset the staircase index

        }
    } else if (arrSum(staircaseChecker) == 0) {
        if(staircaseChecker.length == 1) {
            currentDifficulty -= 1; //lower the span if last two trials were incorrect
            if (currentDifficulty == -1) {
                currentDifficulty = 0; //make sure the experiment cannot break with exceptionally poor performance (floor of 1 digit)
            }
            staircaseChecker = []; //reset the staircase checker
            staircaseIndex = 0; //reset the staircase index

        }
    }
    else {
        return false;
    }
}

//This is to track correct trials
function updateCorrectChecker() {
    var trials = jsPsych.data.get().filter({task: 'response'});
    var correct_trials = trials.filter({correct: true});
    console.log("CORRECT TRIALS COUNT " + correct_trials.count())
    // if (correct_trials.count() === 3) {
    //     console.log('updateCorrectChecker');
    // }
}

//This is to get the next stimuli based on the stimulus rule.
function getStimuli(rule,targetDifficulty) {
    var resultStimuli = [];
    if (rule === 'random' || rule === 'new' ){
        console.log('this is random');
        resultStimuli = stimulusLists[currentBlockIndex][1][stimulusIndex[currentBlock]];
        stimulusIndex[currentBlock] +=1;
    } else {
        console.log('this is adaptive');
        currentDifficulty = checkAvailableDifficulty(targetDifficulty,'both');
        console.log("currentDifficulty " + currentDifficulty);

        console.log("index check " + stimulusIndex[currentBlock]);
        resultStimuli = stimulusLists[currentBlockIndex][1][currentDifficulty][stimulusIndex[currentBlock][currentDifficulty]];
        stimulusIndex[currentBlock][currentDifficulty] += 1;
    }

    //should add staircase design for else condition
    trialCorrectAns = resultStimuli['correct_response'];

    return resultStimuli;

}

function CreateRandomArray(array) {

    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

function CreateStaircaseBlock_New(array,difficultyLevels,blockLabel) {
    var StaircaseArray = [];
    stimulusIndex[blockLabel] = [];
    for (var d = 0; d < difficultyLevels ; d++) {
        StaircaseArray[d] = [];
        stimulusIndex[blockLabel].push(0);
    }

    for (let x of array){
        //console.log(StaircaseArray[x.difficulty])
        StaircaseArray[x.difficulty].push(x)
    }

    for (var d = 0; d < difficultyLevels ; d++) {
        for (var i = StaircaseArray[d].length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = StaircaseArray[d][i];
            StaircaseArray[d][i] = StaircaseArray[d][j];
            StaircaseArray[d][j] = temp;
        }
    }
    return StaircaseArray;
}


function transformNewwords(csv_new){
    var csv_new_transform = csv_new
        .reduce((accum, row) => {
            const newRow = {
                'realword': row.realword,
                'pseudoword': row.pseudoword
            }
            accum.push(newRow);
            return accum;
        }, [])

    var newArray = CreateRandomArray(csv_new_transform);

    var splitArray = [];
    for (var i = 0; i < newArray.length; i++) {
        const realRow = {
            'stimulus':'<div class = stimulus_div><p class = "stimulus" style="font-size:60px;">' + newArray[i].realword + '</p></div>',
            'correct_response': 'ArrowRight',
            'difficulty': 0 //default level
        }
        splitArray.push(realRow);
        const pseudoRow = {
            'stimulus':'<div class = stimulus_div><p class = "stimulus" style="font-size:60px;">' + newArray[i].pseudoword + '</p></div>',
            'correct_response': 'ArrowLeft',
            'difficulty': 0 //default level
        }
        splitArray.push(pseudoRow);
    }
    return CreateRandomArray(splitArray)
}

var exit_fullscreen = {
    type: 'fullscreen',
    fullscreen_mode: false,
    delay_after: 0
}


async function roarBlocks(stimuliPractice, stimuliValidated, stimuliNew){
    var csv_practice = await readCSV(stimuliPractice)
    var csv_validated = await readCSV(stimuliValidated)
    var csv_new = await readCSV(stimuliNew)


    csv_practice_transform = csv_practice
        .reduce((accum, row) => {
            if (row.realpseudo === 'real') {
                correct_response = 'ArrowRight'
            } else {
                correct_response = 'ArrowLeft'
            }
            const newRow = {
                'raw_stimulus': row.word,
                'stimulus': '<div class = stimulus_div><p class = "stimulus" style="font-size:60px;">' + row.word + '</p></div>',
                'correct_response': correct_response,
                'difficulty': row.difficulty
            }
            accum.push(newRow)
            return accum
        }, [])

    csv_validated_transform = csv_validated
        .reduce((accum, row) => {
            if (row.realpseudo === 'real') {
                correct_response = 'ArrowRight'
            } else {
                correct_response = 'ArrowLeft'
            }
            const newRow = {
                'stimulus': '<div class = stimulus_div><p class = "stimulus" style="font-size:60px;">' + row.word + '</p></div>',
                'correct_response': correct_response,
                'difficulty': row.difficulty
            }
            accum.push(newRow)
            return accum
        }, [])


    //set number of practice trials
    var block_Practice = csv_practice_transform.slice(0,totalTrials_Practice);
    //console.log(block_Practice)

    var block_A = csv_validated_transform.slice(0,84);

    var block_B = csv_validated_transform.slice(84,168);

    var block_C = csv_validated_transform.slice(168,252);

    var block_new  = transformNewwords(csv_new);

    var randomBlockLis = CreateRandomArray([["blockA",block_A],["blockB",block_B],["blockC",block_C]]);

    //the core procedure

    function PushPracticeToTimeline(array) {
        for (let x of array) {
            var block = {
                timeline: [setup_fixation_practice, lexicality_test_practice,if_node_left,if_node_right],
                timeline_variables: [x]
            }
            timeline.push(block)
        }
    }

    PushPracticeToTimeline(block_Practice);
    timeline.push(post_practice_intro);
    timeline.push(countdown_trials);


    var core_procedure = {
        timeline: [setup_fixation, lexicality_test]
    }

    function RuleReader(stimulusRuleLis,randomBlockLis){
        //store list of blocks that are ready for present word stimuli
        // e.g. [['blockA',[word1,word2,....]],['blockC',{level_0: [word1,word2,...],level_1: [word3,word4]}]]
        var stimulusLists = [];

        for (var i = 0; i < stimulusRuleLis.length; i++) {
            if (stimulusRuleLis[i] === 'random') {
                stimulusLists.push([randomBlockLis[i][0],CreateRandomArray(randomBlockLis[i][1])]);
                stimulusIndex[randomBlockLis[i][0]] = 0;
            }
            else if (stimulusRuleLis[i] === 'new') {
                stimulusLists.push(['new',CreateRandomArray(block_new)]);
                stimulusIndex['new'] = 0;
            }
            else {
                stimulusLists.push([randomBlockLis[i][0],CreateStaircaseBlock_New(randomBlockLis[i][1],difficultyLevels,randomBlockLis[i][0])]);
            }
        }
        return stimulusLists;
    }

    stimulusLists = RuleReader(stimulusRuleLis,randomBlockLis,block_new);


    function PushTrialsToTimeline(stimulusLists,stimulusCountLis) {
        if (stimulusCountLis.length > 0) {
            var roar_mainproc_block0 = {
                timeline: [core_procedure],
                conditional_function: function () {
                    if (stimulusCountLis[0] === 0) {
                        return false;
                    } else {
                        currentBlock = stimulusLists[0][0];
                        currentBlockIndex = 0;
                        stimulusRule = stimulusRuleLis[0];
                        currentDifficulty = startingDifficulty;
                        staircaseChecker = [];
                        staircaseIndex = 0;
                        return true;
                    }
                },
                repetitions: stimulusCountLis[0]
            };

            total_roar_mainproc_line.push(roar_mainproc_block0);
        }
        //need to fix how to call mid_block_page
        total_roar_mainproc_line.push(mid_block_page);
        total_roar_mainproc_line.push(post_block_page);

        if (stimulusCountLis.length > 1) {

            var roar_mainproc_block1 = {
                timeline: [core_procedure],
                conditional_function: function () {

                    if (stimulusCountLis[1] === 0) {
                        return false;
                    } else {
                        currentBlock = stimulusLists[1][0];
                        currentBlockIndex = 1;
                        stimulusRule = stimulusRuleLis[1];
                        currentDifficulty = startingDifficulty;
                        staircaseChecker = [];
                        staircaseIndex = 0;
                        return true;
                    }
                },
                repetitions: stimulusCountLis[1]
            };

            total_roar_mainproc_line.push(roar_mainproc_block1);
        }

        total_roar_mainproc_line.push(mid_block_page);
        total_roar_mainproc_line.push(post_block_page);


        if (stimulusCountLis.length > 2) {
            var roar_mainproc_block2 = {
                timeline: [core_procedure],
                conditional_function: function () {
                    if (stimulusCountLis[2] === 0) {
                        return false;
                    } else {
                        currentBlock = stimulusLists[2][0];
                        currentBlockIndex = 2;
                        stimulusRule = stimulusRuleLis[2];
                        currentDifficulty = startingDifficulty;
                        staircaseChecker = [];
                        staircaseIndex = 0;
                        return true;
                    }
                },
                repetitions: stimulusCountLis[2]
            }

            total_roar_mainproc_line.push(roar_mainproc_block2);
        }
    }

    var total_roar_mainproc_line = [];

    PushTrialsToTimeline(stimulusLists,stimulusCountLis);


    var total_roar_mainproc = {
        timeline: total_roar_mainproc_line
    }

    timeline.push(total_roar_mainproc);
    timeline.push(final_page);

    console.log("I am printing timeline now")
    console.log(timeline);

    function saveToFirebase(code,filedata){
        var ref = firebase.database().ref(code).set(filedata);
    }

    var submit_block = {
        type: "single-stim",
        stimuli: [" "],
        choices: ['none'],
        timing_response: 0.001,
        timing_post_trial: 0,
        on_finish: function() {
            saveToFirebase('subject_code',jsPsych.data.getData());
        }
    }

    var firebaseConfig = {
        apiKey: "AIzaSyCX9WR-j9yv1giYeFsMpbjj2G3p7jNHxIU",
        authDomain: "gse-yeatmanlab.firebaseapp.com",
        projectId: "gse-yeatmanlab",
        storageBucket: "gse-yeatmanlab.appspot.com",
        messagingSenderId: "292331000426",
        appId: "1:292331000426:web:ae9e28adbe34b391737013",
        measurementId: "G-DY06NYG5E1"
    };

    function makeid(){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < 16; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    timeline.push(debrief_block)
    timeline.push(exit_fullscreen)

    jsPsych.init({
        timeline: timeline,
        show_progress_bar: true,
        auto_update_progress_bar: false,
        on_finish: function() {  /* display data on exp end - useful for dev */
            saveToFirebase('subj/' + makeid(), JSON.parse(jsPsych.data.get().json()));
            // console.log(jsPsych.data.get().csv());
            jsPsych.data.displayData();
        }
    })

}

const data_practice_url = "wordlist/ldt-items-practice.csv";
const data_validated_url = "wordlist/ldt-items-difficulties-with-six-levels.csv";
const data_new_url = "wordlist/ldt-fake-new-items.csv";

roarBlocks(data_practice_url,data_validated_url,data_new_url, start_time)
