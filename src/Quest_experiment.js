/* set the stimulus presentation time */
var stimulusTime = [null,350,1000,2000]; //
var stimulusTimeIndexPracticeOnly = 0; //null as default for practice trial only; 1: 350ms; 2: 1000ms; 3: 2000ms
var stimulusTimeIndex = 1;

/* set the trial time completion time */
var trialTime = [null,5000,8000,100000];
var trialTimeIndexPracticeOnly = 0
var trialTimeIndex = 0; //0 as default: the next stimulus shows after participant's input
//1/2/3: the next stimulus shows after 5000ms/8000ms/10000ms waiting time

/* set the fixation presentation time */
var fixationTime = [1000,2000,25000];
var fixationTimeIndex = 0; //0 as default: 1000ms; 1: 2000ms; 2: 5000ms

var corpus = {real:[], pseudo:[]}
var stimulusIndex = 0;
var nextStimulus;
var firstTrial = true;

/* set QUEST param */
const tGuess = 2;
const tGuessSd = 1;
const pThreshold = 0.75;
const beta = 1;
const delta = 0.05;
const gamma = 0.5;
var myquest = jsQUEST.QuestCreate(tGuess, tGuessSd, pThreshold, beta, delta, gamma);
var tTest = jsQUEST.QuestQuantile(myquest);
var response;

/* create timeline */
var timeline = [];

/* csv helper function */
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

function findClosest(arr, target) {
    let n = arr.length;
    // Corner cases
    if (target <= arr[0].difficulty)
        return 0;
    if (target >= arr[n - 1].difficulty)
        return n-1;
    // Doing binary search
    let i = 0, j = n, mid = 0;
    while (i < j) {
        mid = Math.ceil((i + j) / 2);
        if (arr[mid].difficulty == target)
            return mid;
        // If target is less than array
        // element,then search in left
        if (target < arr[mid].difficulty) {
            // If target is greater than previous
            // to mid, return closest of two
            if (mid > 0 && target > arr[mid - 1].difficulty)
                return getClosest(arr,mid-1, mid, target);
            // Repeat for left half
            j = mid;
        }
        // If target is greater than mid
        else {
            if (mid < n - 1 && target < arr[mid + 1].difficulty)
                return getClosest(arr,mid, mid + 1, target);
            i = mid + 1; // update i
        }
    }
    // Only single element left after search
    return mid;
}

function getClosest(arr,val1, val2, target) {
    if (target - arr[val1].difficulty >= arr[val2].difficulty - target)
        return val2;
    else
        return val1;
}

/* debrief trials*/
var debrief_block = {
    type: "html-keyboard-response",
    stimulus: function() {
        var trials = jsPsych.data.get().filter({task: 'test_response'});
        var correct_trials = trials.filter({correct: true});
        var incorrect_trials = trials.filter({correct: false});
        var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
        var rt = Math.round(correct_trials.select('rt').mean());
        var irt = Math.round(incorrect_trials.select('rt').mean());
        return `<p>You responded correctly on ${accuracy}% of the trials.</p>
          <p>Your average response time on correct trials was ${rt}ms.</p>
          <p>Your average response time on incorrect trials was ${irt}ms.</p>
          <p>Press any key to complete the experiment. Thank you!</p>`;
    }
};

//function to update the span as appropriate (using a 2:1 staircase procedure)

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
        nextStimulus = getStimuli(); //get the current stimuli for the trial
    }
};

var lexicality_test = {
    type: "html-keyboard-response",
    stimulus: function() {return `<div class = stimulus_div><p class = 'stimulus' style="font-size:60px;">${nextStimulus['stimulus']}</p></div>`},
    prompt: `<img class="lower" src="assets/arrowkey_lex.png" alt="arrow keys" style=" width:698px; height:120px">`,
    stimulus_duration: stimulusTime[stimulusTimeIndex],
    trial_duration: trialTime[trialTimeIndex],
    choices: ['ArrowLeft', 'ArrowRight'],
    data:  {
        task: 'test_response', /* tag the test trials with this taskname so we can filter data later */
    },
    on_finish: function(data){
        data.correct = jsPsych.pluginAPI.compareKeys(data.response, nextStimulus['correct_response']);
        currentTrialCorrect = data.correct;
        console.log(nextStimulus.difficulty, nextStimulus.stimulus,currentTrialCorrect);
        if (currentTrialCorrect) {
            response = 1;
        }else{
            response = 0;
        }
        jsPsych.data.addDataToLastTrial({
            word: nextStimulus['stimulus'],
            correct_response: nextStimulus['correct_response'],
            difficulty:nextStimulus['difficulty'],
        });
    }
};

function getStimuli() {
    let closestIndex, resultStimulus, currentCorpus;
    let randomBoolean = Math.random() < 0.5;
    console.log(randomBoolean)
    randomBoolean ? currentCorpus = corpus.real : currentCorpus = corpus.pseudo;
    if (firstTrial) {
        firstTrial = false;
        closestIndex = findClosest(currentCorpus,tTest)
        resultStimulus = currentCorpus[closestIndex];
        currentCorpus.splice(closestIndex, 1);
    } else{
        myquest = jsQUEST.QuestUpdate(myquest, nextStimulus.difficulty, response);
        tTest = jsQUEST.QuestQuantile(myquest);
        closestIndex = findClosest(currentCorpus,tTest)
        resultStimulus = currentCorpus[closestIndex];
        currentCorpus.splice(closestIndex, 1);
    }
    console.log("target " + tTest + "current_difficulty " + resultStimulus.difficulty)
    return resultStimulus;
}

async function roarBlocks(stimuliValidated){
    var csv_validated = await readCSV(stimuliValidated)
    var block = csv_validated
        .reduce((accum, row) => {
            if (row.realpseudo === 'real') {
                correct_response = 'ArrowRight'
            } else {
                correct_response = 'ArrowLeft'
            }
            const newRow = {
                'stimulus': row.word,
                'correct_response': correct_response,
                'difficulty': -row.b_i
            }
            accum.push(newRow)
            return accum
        }, []).reverse()
    corpus.real = block.slice(0,42);
    corpus.pseudo = block.slice(42,84);

    var core_procedure = {
        timeline: [setup_fixation, lexicality_test]
    }
    function PushTrialsToTimeline() {
        for (let i = 0; i < block.length; i++) {
            timeline.push(core_procedure)
        }
    }
    PushTrialsToTimeline();
    timeline.push(debrief_block);

    jsPsych.init({
        timeline: timeline,
        show_progress_bar: true,
        auto_update_progress_bar: false,
        message_progress_bar: 'Progress Complete',
        on_finish: function() {  /* display data on exp end - useful for dev */
            //saveToFirebase('testing/' + userID, JSON.parse(jsPsych.data.get().json()));
            jsPsych.data.displayData();
        }
    })
}

const data_validated_url = "wordlist/quest-corpus.csv";

roarBlocks(data_validated_url)