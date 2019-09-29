import { observable, action } from 'mobx'

import configStore from './configStore'
import parcelStore from './parcelStore'
import polygonStore from './polygonStore'
import mapStore from './mapStore'

class AppStore {
  @observable activeFeature
  @observable showSidebar = true
  @observable activeParcelTheme = configStore.defaultTheme
  @observable activePolygonTheme = 'county'
  @observable lowerPolygonYear = 2010
  @observable upperPolygonYear = polygonStore.useLowerYear

  init() {
    parcelStore.load()
    polygonStore.load()
  }

  get isMobile() {
    return window.innerWidth < 700
  }

  @action
  setActiveFeature(activeFeature) {
    this.activeFeature = activeFeature
    mapStore.highlightFeature(activeFeature)
  }

  @action
  setActiveParcelTheme(activeTheme) {
    this.activeParcelTheme = activeTheme
    mapStore.activateParcelTheme(activeTheme)
  }

  @action
  setLowerPolygonYear(year) {
    this.lowerPolygonYear = year
    if (year >= this.upperPolygonYear) {
      // impossible state
      this.upperPolygonYear = polygonStore.useLowerYear
    }
    mapStore.activatePolygonTheme()
  }

  @action
  setUpperPolygonYear(year) {
    this.upperPolygonYear = year
    mapStore.activatePolygonTheme()
  }

  @action
  setActivePolygonTheme(activeTheme) {
    this.activePolygonTheme = activeTheme
    mapStore.activatePolygonTheme()
  }

  @action
  toggleSidebar() {
    this.showSidebar = !this.showSidebar
  }
}

export default new AppStore()
