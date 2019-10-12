import { observable, action } from 'mobx'

import configStore from './configStore'
import parcelStore from './parcelStore'
import polygonStore from './polygonStore'
import mapStore from './mapStore'
import firebaseStore from './firebaseStore'

class AppStore {
  @observable activeSimulation
  @observable activeFeature
  @observable showSidebar = true
  @observable activeParcelTheme = configStore.defaultTheme
  @observable activePolygonTheme = 'county'
  @observable lowerPolygonYear = 2010
  @observable upperPolygonYear = polygonStore.useLowerYear

  init() {
    firebaseStore.init(() => {
      console.log('Firebase initialized ')
      parcelStore.load()
      polygonStore.load()
    })
  }

  get isMobile() {
    return window.innerWidth < 700
  }

  @action
  setActiveSimulation(activeSimulation) {
    console.log('Setting active simulation', activeSimulation)
    this.activeSimulation = activeSimulation
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
    parcelStore.setFilterValue(parcelStore.activeAttributeExtent)
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
