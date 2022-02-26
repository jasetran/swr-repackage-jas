/* set user mode */
//var userMode = 'beginner' //"beginner": block A only with random words, a new block with 28 new words;
// "regular":  3 blocks in random order with one block consisting 56 adaptive words and 28 new words
const queryString = new URL(window.location).search;
const urlParams = new URLSearchParams(queryString);
const userMode = urlParams.get('mode')
var pid = urlParams.get('pid')
var testingOnly = false;
if (urlParams.get('test')) {
    if (urlParams.get('test') === "true") {
        testingOnly = true;
    }
}


/* set order and rule for the experiment*/
var stimulusRuleLis; // Possible rule writing can be: ['random'] - 1 random block only,
// ['adaptive','random'] - 1 adaptive + 1 random block

/* Number of trials in each block of the experiment */
var stimulusCountLis;

/* number of adaptive trials */
var totalAdaptiveTrials; // default: 56; The adaptive block has 84 trials in total: the first 56 trials contain
// stimuli with adaptive difficulty, and last 28 trials are new stimuli.

/* config stimulusRuleLis, stimulusCountLis, and totalAdaptiveTrials based on userMode */
if (userMode == 'beginner') { //beginnner mode
    stimulusRuleLis = ['random', 'adaptive'];
    stimulusCountLis = [84, 28];
    totalAdaptiveTrials = 0;
}
else if (userMode == 'regular'){ //regular mode
    stimulusRuleLis = ['adptive', 'random', 'random'];
    stimulusCountLis = [84, 84, 84];
    totalAdaptiveTrials = 60;
}
else { //test mode
    stimulusRuleLis = ['adptive', 'random', 'random'];
    stimulusCountLis = [4, 4, 4];
    totalAdaptiveTrials = 2;
}

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

/* set number of trials for practice block */
var totalTrials_Practice = 5; //default: 5
var practiceIndex = 0;
var countSlowPractice = 2; //number of practice trials that will keep stimulus on screen untill participant's input

/* set number of difficulty levels for the adaptive block of the experiment  */
var difficultyLevels = 6;

/* Counting vairables */
var count_adaptive_trials = 0;
var newword_index = 0;
var block_new;
var currentBlockIndex;
var stimulusRule;
var stimulusIndex = {'blockA':0, 'blockB':0, 'blockC':0};
var nextStimulus = [];
var response;

/* variables used in practice feedbacks */
var responseLR;
var answerRP;
var correctRP;
var answerColor;
var responseColor;
var currentPracStimulus;
var arrowDisplay;
var correctLR;
var practiceIndex = 0;
var practiceFeedbackAudio;


/* variables to track current state of the experiment*/
var currentStimulus;
var currentBlock;
var currentTrialCorrect; //return true or false

/* list of three stimuli blocks*/
var stimulusLists;

var trialCorrectAns; //for storing the correct answer on a given trial
var staircaseChecker = []; //for assessing whether the span should move up/down/stay
var staircaseIndex = 0; //index for the current staircase

var startingDifficulty = 0; //where we begin in terms of difficulty
var currentDifficulty = 0; //to reference where participants currently are
var difficultyHistory = []; //easy logging of the participant's trajectory

var roarTrialNum = 1; //counter for trials

var coinTrackingIndex = 0;

/* feedback */
//let feedback = True;

/* create timeline */
var timeline = [];

/* record date */
var start_time = new Date();

/* simple variable for calculating sum of an array */
const arrSum = arr => arr.reduce((a,b) => a + b, 0)

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

/* firebase config */
var firebase_data_index = 0;

function saveToFirebase(code,filedata){
    var ref = firebase.database().ref(code).set(filedata);
}

var uid;

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
    if ((target - arr[val1].difficulty) >= (arr[val2].difficulty - target))
        return val2;
    else
        return val1;
}