import { initConfig } from './config/config';
import { buildExperiment } from './experiment';
import './css/game.css';
// import configStore from '../configStore'
import store from 'store2'
export class RoarSWR {
    constructor (firekit, params, displayElement) {
      // TODO: Add validation of params so that if any are missing, we throw an error
      this.params = params
      this.firekit = firekit
      this.displayElement = displayElement
    }
  
    async init() {
      await this.firekit.startRun();

      console.log('started firekit')

      const config = await initConfig(this.firekit, this.params, this.displayElement);
      // configStore.updateConfig(newConfigValues);
      store.session.set('config', config)

      console.log('store in init: ', store.get('config'))
      return buildExperiment(config);
    }
  
    async run() {
      const { jsPsych, timeline } = await this.init()
      jsPsych.run(timeline);
    }
} 