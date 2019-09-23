import { observable, action } from 'mobx'

import configStore from './configStore'
import parcelStore from './parcelStore'
import mapStore from './mapStore'

class AppStore {
  @observable activeFeature
  @observable showSidebar = true
  @observable activeTheme = configStore.defaultTheme

  init() {
    parcelStore.load()
  }

  @action
  setActiveFeature(activeFeature) {
    this.activeFeature = activeFeature
  }

  @action
  setActiveTheme(activeTheme) {
    this.activeTheme = activeTheme
    mapStore.activateTheme(activeTheme)
  }

  @action
  toggleSidebar() {
    this.showSidebar = !this.showSidebar
  }
}

export default new AppStore()
