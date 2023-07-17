import { initJsPsych } from "jspsych";
import i18next from "i18next";
import './i18n.js';
import store from "store2";


// ROAR apps communicate with the participant dashboard by passing parameters
// through the URL. The dashboard can be made to append a "gameId"
// parameter, e.g., https://my-roar-app.web.app?gameId=1234.
// Similarly, at the end of the assessment the ROAR app communicates with the
// dashboard to let it know that the participant has finished the assessment.
// The dashboard expects a game token, "g", and a completion
// status, "c", e.g., https://reading.stanford.edu/?g=1234&c=1. Here we inspect
// the "gameId" parameter that was passed through the URL query string and
// construct the appropriate redirect URL.

const redirect = () => {
  const config = store.session.get('config')

  if (config.gameId === null) {
    // If no game token was passed, we refresh the page rather than
    // redirecting back to the dashboard
    // window.location.reload();
    if (config.taskVariant === 'school') {
      if (config.userMode === 'shortAdaptive') {
        window.location.href = `https://reading.stanford.edu?g=1154&c=1`;
      } else {
        window.location.href = `https://reading.stanford.edu?g=901&c=1`;
      }
    } else if (config.taskVariant === 'UCSF') {
      window.location.href = `https://reading.stanford.edu?g=937&c=1`;
    } else if (config.taskVariant === 'RF') {
      window.location.href = `https://reading.stanford.edu?g=940&c=1`;
    } else if (config.taskVariant === 'prolific') {
      window.location.href = `https://app.prolific.co/submissions/complete?cc=CK1VQ7DP`; // TO DO: change to prolific redirect
    }
  } else {
    // Else, redirect back to the dashboard with the game token that
    // was originally provided
    window.location.href = `https://reading.stanford.edu/?g=${config.gameId}&c=1`;
  }
};

export const jsPsych = initJsPsych({
  show_progress_bar: true,
  auto_update_progress_bar: false,
  message_progress_bar: `${i18next.t('progressBar')}`,
  on_finish: () => {
    redirect();
  },
});