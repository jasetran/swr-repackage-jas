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
var totalTrials_Practice = 5;
var practiceIndex = 0;
var countSlowPractice = 2;

/* set order and rule for the experiment*/
var stimulusRuleLis = ['adaptive','random','random'];

// Possible rule writing can be: ['random'] - 1 random block only, ['adaptive','random'] - 1 adaptive + 1 random block

/* Number of trials in each block of the experiment */
var stimulusCountLis = [4,4,2];

/* number of adaptive trials */
var totalAdaptiveTrials = 2; // default: 56;

/* set number of difficulty levels for the adaptive block of the experiment  */
var difficultyLevels = 6;

var count_adaptive_trials = 0;
var newword_index = 0;
var block_new;

var currentBlockIndex;
var stimulusRule;

var stimulusIndex = {};
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

var currentStimulus;

var stimulusLists;

var practiceIndex = 0;

var trialCorrectAns; //for storing the correct answer on a given trial
var staircaseChecker = []; //for assessing whether the span should move up/down/stay
var staircaseIndex = 0; //index for the current staircase

var startingDifficulty = 0; //where we begin in terms of difficulty
var currentDifficulty = 0; //to reference where participants currently are
var difficultyHistory = []; //easy logging of the participant's trajectory

var roarTrialNum = 1; //counter for trials
//var exitLetters; //for exiting the letter loop

var currentBlock;

/* feedback */
//let feedback = True;

/* create timeline */
var timeline = [];

/* record date */
var start_time = new Date();

/* simple variable for calculating sum of an array */
const arrSum = arr => arr.reduce((a,b) => a + b, 0)
