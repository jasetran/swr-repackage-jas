import jsPsychPreload from "@jspsych/plugin-preload";

// Audio files
import intro1 from "./audio/intro1.wav";
import intro2 from "./audio/intro2.wav";
import intro3 from "./audio/intro3.wav";
import countdown0 from "./audio/countdown0.wav";
import countdown1 from "./audio/countdown1.wav";
import countdown2 from "./audio/countdown2.wav";
import countdown3 from "./audio/countdown3.wav";
import coinIntro from "./audio/coinIntro.wav";
import midBlock1 from "./audio/midBlock1.wav";
import endBlock1 from "./audio/endBlock1.wav";
import midBlock2 from "./audio/midBlock2.wav";
import endBlock2 from "./audio/endBlock2.wav";
import midBlock3 from "./audio/midBlock3.wav";
import endGame from "./audio/endGame.wav";
import beep from "./audio/beep.wav";
import coin from "./audio/coin.wav";
import fail from "./audio/fail.wav";
import fairyCoin from "./audio/fairyCoin.wav";
import feedbackXopCorrect from "./audio/feedback_xop_correct.wav";
import feedbackXopWrong from "./audio/feedback_xop_wrong.wav";
import feedbackHowCorrect from "./audio/feedback_how_correct.wav";
import feedbackHowWrong from "./audio/feedback_how_wrong.wav";
import feedbackAfterCorrect from "./audio/feedback_after_correct.wav";
import feedbackAfterWrong from "./audio/feedback_after_wrong.wav";
import feedbackAulerCorrect from "./audio/feedback_auler_correct.wav";
import feedbackAulerWrong from "./audio/feedback_auler_wrong.wav";
import feedbackHomCorrect from "./audio/feedback_hom_correct.wav";
import feedbackHomWrong from "./audio/feedback_hom_wrong.wav";

// Image files
import wizardMagic from "./assets/wizard_magic.gif";
import arrowLeftP2 from "./assets/arrow_left_p2.png";
import arrowRightP2 from "./assets/arrow_right_p2.png";
import keyP3 from "./assets/key_p3.png";
import goldCoin from "./assets/gold_coin.gif";
import arrowkeyLexLeft from "./assets/arrowkey_lex_left.gif";
import arrowkeyLexRight from "./assets/arrowkey_lex_right.gif";
import arrowkeyLex from "./assets/arrowkey_lex.png";
import ending from "./assets/ending.png";
import coinIcon from "./assets/coin_icon.png";
import coinBag from "./assets/coin_bag.gif";
import halfValley from "./assets/half_valley.png";
import adventurer1 from "./assets/adventurer1.gif";
import adventurer2 from "./assets/adventurer2.gif";
import adventurer3 from "./assets/adventurer3.gif";
import valley from "./assets/valley.png";
import wizardCoin from "./assets/wizard_coin.gif";
import guardian1 from "./assets/guardian1.gif";
import guardian2 from "./assets/guardian2.gif";
import guardian3 from "./assets/guardian3.gif";
import valley3 from "./assets/valley3.png";
import valley4 from "./assets/valley4.png";
import valley5 from "./assets/valley5.png";
import endingBackground from "./assets/ending_background.png";

const audioBlocks = {
  1: [
    intro1,
    intro2,
    intro3,
    coinIntro,
    midBlock1,
    endBlock1,
    midBlock2,
    endBlock2,
    midBlock3,
    endGame,
  ],
  2: [
    feedbackXopCorrect,
    feedbackXopWrong,
    feedbackHowCorrect,
    feedbackHowWrong,
    feedbackAfterCorrect,
    feedbackAfterWrong,
    feedbackAulerCorrect,
    feedbackAulerWrong,
    feedbackHomCorrect,
    feedbackHomWrong,
  ],
  3: [
    countdown0,
    countdown1,
    countdown2,
    countdown3,
    beep,
    coin,
    fail,
    fairyCoin,
  ],
};

const camelCase = (inString) => inString.replace(/_([a-z])/g, (g) => g[1].toUpperCase());

const preloadObj2contentObj = (preloadObj) => {
  const contentArray = [].concat(...Object.values(preloadObj));
  return contentArray.reduce((o, val) => {
    const pathSplit = val.split("/");
    const fileName = pathSplit[pathSplit.length - 1];
    const key = fileName.split(".")[0];
    // eslint-disable-next-line no-param-reassign
    o[camelCase(key)] = val;
    return o;
  }, {});
};

export const audioContent = preloadObj2contentObj(audioBlocks);
console.log(audioContent);

const preload_audio_trials = Object.entries(audioBlocks).map((element) => {
  const idx = element[0];
  const audio_block = element[1];
  return {
    type: jsPsychPreload,
    audios: audio_block,
    auto_preload: true,
    message: `${idx} Please wait while the experiment loads. This may take a few minutes.`,
    show_progress_bar: true,
    show_detailed_errors: true,
  };
});

const imageBlocks = {
  4: [wizardMagic, wizardCoin, arrowLeftP2, arrowRightP2, keyP3],
  5: [goldCoin, arrowkeyLexLeft, arrowkeyLexRight, arrowkeyLex, ending],
  6: [coinIcon, coinBag, adventurer1, adventurer2, adventurer3],
  7: [guardian1, guardian2, guardian3, valley3, valley4],
  8: [endingBackground, valley, valley5, halfValley],
};

// Automatically populate the audioContent object with the audio files
export const imgContent = preloadObj2contentObj(imageBlocks);
console.log(imgContent);

const preload_img_trials = Object.entries(imageBlocks).map((element) => {
  const idx = element[0];
  const img_block = element[1];
  return {
    type: jsPsychPreload,
    audios: img_block,
    auto_preload: true,
    message: `${idx} Please wait while the experiment loads. This may take a few minutes.`,
    show_progress_bar: true,
    show_detailed_errors: true,
  };
});

export const preload_trials = [...preload_audio_trials, ...preload_img_trials];
