// @ts-check
import jsPsychSurveyHtmlForm from "@jspsych/plugin-survey-html-form";
import i18next from "i18next";
import '../i18n'

export const languageSelectTrial = {
    type: jsPsychSurveyHtmlForm,
    preamble: `
        <h1>Looks like we couldn't detect what your default browser langauge is.</h1>
        <h1>Please select the langauge you are most fluent in.</h1>`,
    html: `
        <select name="language">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="it">Italian</option>
        </select>
    `,
    button_label: `${i18next.t('terms.continue').toLocaleUpperCase()}`,
    on_finish: async (data) => {
        await i18next.changeLanguage(`${data.response.language}`)
    }
}
