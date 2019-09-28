import { observable, action } from 'mobx'

import configStore from './configStore'
import parcelStore from './parcelStore'
import polygonStore from './polygonStore'
import mapStore from './mapStore'

class AppStore {
  @observable activeFeature
  @observable showSidebar = true
  @observable activeParcelTheme = configStore.defaultTheme
  @observable activePolygonTheme
  @observable activePolygonYear

  init() {
    parcelStore.load()
    polygonStore.load()
  }

  @action
  setActiveFeature(activeFeature) {
    this.activeFeature = activeFeature
  }

  @action
  setActiveParcelTheme(activeTheme) {
    this.activeParcelTheme = activeTheme
    mapStore.activateParcelTheme(activeTheme)
  }

  @action
  setActivePolygonTheme(activeTheme, year) {
    this.activePolygonTheme = activeTheme
    this.activePolygonYear = year
    mapStore.activatePolygonTheme(activeTheme, year)
  }

  @action
  toggleSidebar() {
    this.showSidebar = !this.showSidebar
  }
}

export default new AppStore()
