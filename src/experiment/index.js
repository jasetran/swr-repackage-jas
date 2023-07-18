import { initConfig } from './config/config.js';
import { buildExperiment } from './experiment.js';
import './css/game.css';
import store from 'store2'

// Import necessary for async in the top level of the experiment script
import "regenerator-runtime/runtime.js";

export class RoarSWR {
    constructor (firekit, params, displayElement) {
      // TODO: Add validation of params so that if any are missing, we throw an error
      this.params = params
      this.firekit = firekit
      this.displayElement = displayElement
    }
  
    async init() {
      await this.firekit.startRun();
      const config = await initConfig(this.firekit, this.params, this.displayElement);
      // configStore.updateConfig(newConfigValues);
      store.session.set('config', config)
      return buildExperiment(config);
    }
  
    async run() {
      const { jsPsych, timeline } = await this.init()
      jsPsych.run(timeline);
    }
} 
