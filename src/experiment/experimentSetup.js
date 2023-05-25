import jsPsychSurveyText from "@jspsych/plugin-survey-text";
import jsPsychSurveyHtmlForm from "@jspsych/plugin-survey-html-form";
import jsPsychSurveyMultiSelect from "@jspsych/plugin-survey-multi-select";
import { config, stimulusCountLists, taskInfo } from "./config/config";
import { roarConfig } from "./config/firebaseConfig";
import { RoarFirekit } from "@bdelab/roar-firekit";
import store from "store2";
import { corpusAll, corpusNew } from "./config/corpus";
import { Cat } from '@bdelab/jscat';


store.session.set("corpusAll", corpusAll); 
store.session.set("corpusNew", corpusNew);

export const cat = new Cat({method: 'MLE', minTheta: -6, maxTheta: 6, itemSelect: store.session("itemSelect")});

// Include new items in thetaEstimate
export const cat2 = new Cat({method: 'MLE', minTheta: -6, maxTheta: 6, itemSelect: store.session("itemSelect")});

export const makePid = () => {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 16; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
  
  const getLabId = {
    type: jsPsychSurveyText,
    questions: [
      {
        prompt: 'Lab ID:',
        name: 'labId',
        required: true,
      },
    ],
    on_finish: (data) => {
      config.labId = data.response.labId;
  
      const prodDoc = config.labId === 'yeatmanlab' ? ['prod', 'roar-prod'] : ['external', config.labId];
      // eslint-disable-next-line no-undef
  
      roarConfig.rootDoc = ROAR_DB_DOC === 'production' ? prodDoc : ['dev', 'anya-swr'];
    },
  };
  
  const ifGetLabId = {
    timeline: [getLabId],
    conditional_function: () => {
      return (config.labId === null) ? true : false;
    }
  }
  
  const getPid = {
    type: jsPsychSurveyText,
    questions: [
      {
        prompt: 'Participant ID:',
        name: 'pid',
        required: true,
      },
    ],
    on_finish: (data) => {
      config.pid = data.response.pid;
    },
  };
  
 const ifGetPid = {
    timeline: [getPid],
    conditional_function: () => {
      return (config.pid === null) ? true : false;
    }
  }
  
  const consent_form = {
    type: jsPsychSurveyMultiSelect,
    questions: [
      {
        prompt: () => {
          return (` <div>
              <p class=" consent_form_title">STANFORD UNIVERSITY CONSENT FORM</p>
              <p class=" consent_form_text">
              <b>PURPOSE OF THE STUDY</b> 
              <br>
                Data collected through games in the web-browser will help researchers understand relationships between academic skills, reading proficiency, cognition, perception, and/or attitudes towards reading and school in individuals with a broad range of reading skills.
              <br><br>
              <b>STUDY PROCEDURES</b> 
              <br>
              In this study, you will be asked to complete computer tasks via a computer screen. Audio will be presented via headphones or speakers.
              <br><br>
              <b>PRIVACY AND DATA COLLECTION</b> <br>
              We will do our best to ensure your privacy. Data that is collected through this online experiment is stored separately from identifying information such as your name. For the sake of payment, sometimes we store an email address you provide, but this is stored separately from the responses that are recorded in the online experiment. Each participant is assigned a code and that is used rather than names. This is called “coded data” and we try to ensure that the identity of our research participants is kept confidential. Data collected as part of this study may be used for many years to help discover trends in the population and explore changes due to development and education. In addition, coded data may be shared online or with collaborators to allow for new and unforeseen discoveries. Researchers may choose to include coded data in publications to support findings, or they may choose to release coded data alongside findings for replicability.
              <br>
              <br>
              We will collect mouse and click, scores earned, button presses and their timestamps, or other data that may be derived from your behavior on our page. This data will be stored on servers. Incomplete data may be logged if you quit out of the experiment early. If you would like to void your data, you may request it through our contact email. 
              <br>
              <br>
              <b>COMPENSATION</b>
              <br> 
              Participation in this study is voluntary and you will not receive financial compensation.
              <br>
              <br>
              <b>RISKS, STRESS, OR DISCOMFORT</b>
              <br>
              If there is any reason to believe you are not safe to participate in any of the tasks, please contact us at <a href="url">readingresearch@stanford.edu</a>. Some people may experience some physical discomfort or boredom due to being asked to sit for long periods. For computer tasks, some people may also experience dry eyes or eye fatigue. For some tasks that are untimed, breaks can be taken as needed during the session.
              <br>
              <br>
              <b>CONTACT INFORMATION </b>
              <br>
              If you have any additional questions or concerns about our research, feel free to email us at <a href="url">readingresearch@stanford.edu</a>. We will be more than happy to help!
              <br>
              <br>
              For general information regarding questions or concerns about [your/your child’s] rights as a research participant, please call 1-866-680-2906 to reach the Administrative Panel on Human Subjects in Medical Research, Stanford University.
              </p>
            </div>`
            )
        } ,
        options: () => {
          return [
            `<b>I agree to participate in this research. Participation in this research is voluntary, and I can stop at any time without penalty. <br> I feel that I understand what I am getting into, and I know I am free to leave the experiment at any time by simply closing the web browser.</b>`,
          ]
        },
        required: true,
        required_message: "You must check the box to continue",
        name: "Agree",
      },
    ],
  };
  
export const if_consent_form = {
    timeline: [consent_form],
    conditional_function: () => {
      return Boolean(((config.userMode === "demo") || (config.taskVariant === 'otherLabs') || (config.taskVariant === 'prolific')) && (config.consent === true));
    },
  };
  
  /* demo survey */
  const survey_pid = {
    type: jsPsychSurveyHtmlForm,
    preamble: () => {
      return ("<div><h1>Please share a bit more to help us understand your data!</h1>" +
              "<p>[Optional]</p></div>"
      )
    },   
    html: () => {
      return (`
      <div className="item">
       <span htmlFor="instructions" class = "survey_form_text">How old are you? (Please type a number)</span>
       <input type = "text" id = "age" name="age" style = "font-size: 2vh" value=""/>
     </div>
     <br>
     <div className="item">
       <span class = "survey_form_text">What is your current grade or highest level of education?</span>
       <select id = "edu" name = "edu" style = "font-size: 2vh">
         <option value=""></option>
         <option value="prek">preK</option>
         <option value="k1">K1</option>
         <option value="k2">K2</option>
         <option value="1">Grade 1</option>
         <option value="2">Grade 2</option>
         <option value="3">Grade 3</option>
         <option value="4">Grade 4</option>
         <option value="5">Grade 5</option>
         <option value="6">Grade 6</option>
         <option value="7">Grade 7</option>
         <option value="8">Grade 8</option>
         <option value="9">Grade 9</option>
         <option value="10">Grade 10</option>
         <option value="11">Grade 11</option>
         <option value="12">Grade 12</option>
         <option value="college">College</option>
         <option value="proSchool">Professional School</option>
         <option value="gradSchool">Graduate School</option>
       </select>
     </div>
     <br>
     <div className="item">
       <span class = "survey_form_text">Is English your first language?</span>
       <select id = "ell" name = "ell" style = "font-size: 2vh">
         <option value=""></option>
         <option value="1">No</option>
         <option value="0">Yes</option>
       </select>
     </div>
     <br>
     <div className="item">
       <span class = "survey_form_text">Have you taken this game before?</span>
       <select id = "retake" name = "retake" style = "font-size: 2vh">
         <option value=""></option>
         <option value="0">No</option>
         <option value="1">Yes</option>
       </select>
     </div>
     <br>`
    )},
    autocomplete: true,
    on_finish: (data) => {
      let tmpMetadata = {};
      for (const field in data.response) {
        if (data.response[field] === "") {
          tmpMetadata[field] = null;
        } else if (field === "retake" || field === "ell") {
          tmpMetadata[field] = parseInt(data.response[field]);
        } else {
          tmpMetadata[field] = data.response[field];
        }
      }
      tmpMetadata['labId'] = config.labId;
      config.userMetadata = tmpMetadata;
    },
  };
  
  export const if_get_survey = {
    timeline: [survey_pid],
    conditional_function: () => {
      return Boolean(((config.userMode === "demo") || (config.taskVariant === 'otherLabs') || (config.taskVariant === 'prolific')) && (config.consent === true));
    },
  };
  
  export  const if_get_pid = {
    timeline: [ifGetLabId, ifGetPid],
    conditional_function: function () {
      return config.taskVariant === 'otherLabs';
    },
  };

const checkRealPseudo = (corpus) => {
  let corpusType = (Math.random() < 0.5) ? "corpus_real" : "corpus_pseudo";
  let currentCorpus = corpus[corpusType];
  if (currentCorpus.length < 1) {
    if (corpusType === "corpus_pseudo") {
      corpusType = "corpus_real";
    } else {
      corpusType = "corpus_pseudo";
    }
  }
  return corpusType;
}

export const getStimulus = () => {
  // decide which corpus to use
  const demoCounter = store.session("demoCounter");
  let corpus, corpusType, itemSuggestion;
  if (config.userMode === 'demo') {
    if (demoCounter === 5 ) {
      // validated corpus
      corpus = store.session("corpusAll");
      corpusType = checkRealPseudo(corpus);
      store.session.set("itemSelect", "mfi");
      itemSuggestion = cat.findNextItem(corpus[corpusType], "mfi");
      store.session.set("demoCounter",0);
      // update next stimulus
      store.session.set("nextStimulus", itemSuggestion.nextStimulus);
      corpus[corpusType] = itemSuggestion.remainingStimuli;
      store.session.set("corpusAll", corpus);
    } else {
      // new corpus
      corpus = store.session("corpusNew");
      corpusType = checkRealPseudo(corpus);
      store.session.set("itemSelect", "random");
      itemSuggestion = cat.findNextItem(corpus[corpusType], "random");
      store.session.transact("demoCounter", (oldVal) => oldVal + 1);
      // update next stimulus
      store.session.set("nextStimulus", itemSuggestion.nextStimulus);
      corpus[corpusType] = itemSuggestion.remainingStimuli;
      store.session.set("corpusNew", corpus);
    }
  } else if ((config.userMode === "shortAdaptive") || (config.userMode === "longAdaptive")) {
    if (demoCounter !== config.adaptive2new) {
      // validated corpus
      corpus = store.session("corpusAll");
      corpusType = checkRealPseudo(corpus);
      store.session.set("itemSelect", "mfi");
      itemSuggestion = cat.findNextItem(corpus[corpusType], "mfi");
      store.session.transact("demoCounter", (oldVal) => oldVal + 1);
      // update next stimulus
      store.session.set("nextStimulus", itemSuggestion.nextStimulus);
      corpus[corpusType] = itemSuggestion.remainingStimuli;
      store.session.set("corpusAll", corpus);
    } else {
      // new corpus
      corpus = store.session("corpusNew");
      corpusType = checkRealPseudo(corpus);
      store.session.set("itemSelect", "random");
      itemSuggestion = cat.findNextItem(corpus[corpusType], "random");
      store.session.set("demoCounter",0);
      // update next stimulus
      store.session.set("nextStimulus", itemSuggestion.nextStimulus);
      corpus[corpusType] = itemSuggestion.remainingStimuli;
      store.session.set("corpusNew", corpus);
    }
  } else if (config.userMode === "fullItemBank") {
    // new corpus
    if (config.indexArray[store.session("trialNumTotal")] === 0) {
      // new corpus
      corpus = store.session("corpusNew");
      corpusType = checkRealPseudo(corpus);
      itemSuggestion = cat.findNextItem(corpus[corpusType]);
      // update next stimulus
      store.session.set("nextStimulus", itemSuggestion.nextStimulus);
      corpus[corpusType] = itemSuggestion.remainingStimuli;
      store.session.set("corpusNew", corpus);
    } else {
      // validated corpus
      corpus = store.session("corpusAll");
      corpusType = checkRealPseudo(corpus);
      itemSuggestion = cat.findNextItem(corpus[corpusType]);
      // update next stimulus
      store.session.set("nextStimulus", itemSuggestion.nextStimulus);
      corpus[corpusType] = itemSuggestion.remainingStimuli;
      store.session.set("corpusAll", corpus);
    }
  } else {
    corpus = store.session("corpusAll");
    corpusType = checkRealPseudo(corpus);

    itemSuggestion = cat.findNextItem(corpus[corpusType]);
    // update next stimulus
    store.session.set("nextStimulus", itemSuggestion.nextStimulus);
    corpus[corpusType] = itemSuggestion.remainingStimuli;
    store.session.set("corpusAll", corpus);
  }

  // update 2 trackers
  const currentBlockIndex = store.session("currentBlockIndex");
  const tracker = store.session("trialNumBlock");
  if (tracker === 0 | tracker === stimulusCountLists[config.userMode][currentBlockIndex]) {
    store.session.set("trialNumBlock", 1);
  } else {
    store.session.transact("trialNumBlock", (oldVal) => oldVal + 1);
  }
  store.session.transact("trialNumTotal", (oldVal) => oldVal + 1);
}

export let firekit;

export const initializeRoarFireKit = async () => {
  config.pid = config.pid || makePid();
  let prefix = config.pid.split("-")[0];
  if (prefix === config.pid || config.taskVariant !== 'school'){
    prefix = "pilot";
  }
  const userInfo = {
    id: config.pid,
    studyId: config.taskVariant + "-" + config.userMode,
    schoolId: config.schoolId || prefix,
    userMetadata: config.userMetadata,
  };

  firekit = new RoarFirekit({
    config: roarConfig,
    userInfo: userInfo,
    taskInfo,
  });
  await firekit.startRun();
}