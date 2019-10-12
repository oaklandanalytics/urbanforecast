import { computed, observable } from 'mobx'
import * as firebase from 'firebase/app'
import 'firebase/database'
import appStore from './appStore'

class FirebaseStore {
  @observable simulations

  init(callback) {
    firebase.initializeApp({
      apiKey: 'AIzaSyBp_KoUOc7VHTGWjSiludbtd3sXnm3ZOMI',
      authDomain: 'forecast-feedback.firebaseapp.com',
      databaseURL: 'https://forecast-feedback.firebaseio.com',
    })

    this.db = firebase.database()

    this.subscribeSimulations(() => callback())
  }

  subscribeSimulations(callback) {
    this.db.ref('simulations').on('value', val => {
      const simulations = val.val()
      this.simulations = simulations

      console.log('Simulations updated', simulations)

      appStore.setActiveSimulation(_.keys(simulations)[0])

      if (callback) callback()
    })
  }

  @computed
  get activeSimulationConfig() {
    return this.simulations[appStore.activeSimulation]
  }
}

export default new FirebaseStore()
