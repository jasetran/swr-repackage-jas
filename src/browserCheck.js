import jsPsychBrowserCheck from '@jspsych/plugin-browser-check'
import jsPsychCallFunction from '@jspsych/plugin-call-function'
import { detect } from 'detect-browser'

const func = () => {
    const browser = detect()
    if (navigator.userAgent.match(/Mac/) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && browser.os === 'Mac OS') {
        console.log('is an ipad')
        isiPad = true
    } else {
        console.log('is NOT an ipad')
    }
}

export const browserAndMobileCheck = {
    type: jsPsychCallFunction,
    func: func
  };