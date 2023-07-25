/* eslint-disable import/extensions */
import store from "store2";
import { initConfig } from "./config/config";
import { buildExperiment } from "./experiment";
import { waitFor } from "./helperFunctions";
import "./css/game.css";

class RoarSWR {
  constructor(firekit, params, displayElement) {
    // TODO: Add validation of params so that if any are missing, we throw an error
    this.params = params;
    this.firekit = firekit;
    this.displayElement = displayElement;
  }

  async init() {
    await this.firekit.startRun();
    const config = await initConfig(
      this.firekit,
      this.params,
      this.displayElement,
    );
    // configStore.updateConfig(newConfigValues);
    store.session.set("config", config);
    return buildExperiment(config);
  }

  async run() {
    const { jsPsych, timeline } = await this.init();
    jsPsych.run(timeline);
    await waitFor(() => this.firekit.run.completed === true);
  }
}

export default RoarSWR;
