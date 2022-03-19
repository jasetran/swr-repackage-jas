const audio_blocks = {
  1: [
    "audio/01_intro.wav",
    "audio/02_intro.wav",
    "audio/03_intro.wav",
    "audio/14_coin_intro.wav",
    "audio/15_mid_block_1.wav",
    "audio/16_end_block_1.wav",
    "audio/17_mid_block_2.wav",
    "audio/18_end_block_2.wav",
    "audio/19_mid_block_3.wav",
    "audio/20_end_game.wav",
  ],
  2: [
    "audio/beep.wav",
    "audio/coin_sound.wav",
    "audio/fail_sound.wav",
    "audio/practice_feedback_xop_correct.wav",
    "audio/practice_feedback_xop_wrong.wav",
    "audio/practice_feedback_how_correct.wav",
    "audio/practice_feedback_how_wrong.wav",
    "audio/practice_feedback_after_correct.wav",
    "audio/practice_feedback_after_wrong.wav",
    "audio/practice_feedback_auler_correct.wav",
    "audio/practice_feedback_auler_wrong.wav",
    "audio/practice_feedback_hom_correct.wav",
    "audio/practice_feedback_hom_wrong.wav",
  ],
};

const preload_audio_trials = Object.entries(audio_blocks).map((element) => {
  const idx = element[0];
  const audio_block = element[1];
  return {
    type: "preload",
    audios: audio_block,
    auto_preload: true,
    message: `${idx} Please wait while the experiment loads. This may take a few minutes.`,
    show_progress_bar: true,
    show_detailed_errors: true,
  };
});

const image_blocks = {
  3: [
    "assets/wizard_magic.gif",
    "assets/arrow_left_p2.png",
    "assets/arrow_right_p2.png",
    "assets/arrow_left_p2.png",
    "assets/key_p3.png",
  ],
  4: [
    "assets/gold_coin.gif",
    "assets/arrowkey_lex_left.gif",
    "assets/arrowkey_lex_right.gif",
    "assets/arrowkey_lex.png",
    "assets/ending.png",
  ],
  5: [
    "assets/coinicon.png",
    "assets/half_valley.png",
    "assets/adventurer1.gif",
    "assets/adventurer2.gif",
    "assets/adventurer3.gif",
    "assets/valley.png",
  ],
  6: [
    "assets/wizard_coin.gif",
    "assets/guardian1.gif",
    "assets/guardian2.gif",
    "assets/guardian3.gif",
    "assets/valley_3.png",
    "assets/valley_4.png",
    "assets/valley_5.png",
    "assets/ending_background.png",
  ],
};

const preload_img_trials = Object.entries(image_blocks).map((element) => {
  const idx = element[0];
  const img_block = element[1];
  return {
    type: "preload",
    audios: img_block,
    auto_preload: true,
    message: `${idx} Please wait while the experiment loads. This may take a few minutes.`,
    show_progress_bar: true,
    show_detailed_errors: true,
  };
});

export const preload_trials = [...preload_audio_trials, ...preload_img_trials];
