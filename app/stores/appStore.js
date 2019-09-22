import parcelStore from './parcelStore'
import { observable, action } from 'mobx'

class AppStore {
  @observable activeFeature
  @observable showSidebar = true

  init() {
    parcelStore.load()
  }

  @action
  setActiveFeature(activeFeature) {
    this.activeFeature = activeFeature
  }

  @action
  toggleSidebar() {
    console.log(this.showSidebar)
    this.showSidebar = !this.showSidebar
  }
}

export default new AppStore()
