import { computed, observable } from 'mobx'
import * as firebase from 'firebase/app'
import 'firebase/database'
import appStore from './appStore'

class FirebaseStore {
  @observable simulations = {}

  init() {
    firebase.initializeApp({
      apiKey: 'AIzaSyBp_KoUOc7VHTGWjSiludbtd3sXnm3ZOMI',
      authDomain: 'forecast-feedback.firebaseapp.com',
      databaseURL: 'https://forecast-feedback.firebaseio.com',
    })

    this.db = firebase.database()

    this.subscribeSimulations()
  }

  subscribeSimulations() {
    this.db.ref('simulations').on('value', val => {
      const simulations = val.val()
      this.simulations = simulations

      console.log('Simulations updated', simulations)

      appStore.setActiveSimulation(_.keys(simulations)[0])
    })
  }

  @computed
  get activeSimulationConfig() {
    return this.simulations[appStore.activeSimulation]
  }

  @computed
  get activeSimulationName() {
    return _.get(this.activeSimulationConfig, 'name')
  }
}

export default new FirebaseStore()
