import d3 from 'd3'
import { observable, computed } from 'mobx'

import { csv2features, features2geojson } from '../utils'

import configStore from './configStore'
import mapStore from './mapStore'
import appStore from './appStore'

class ParcelStore {
  @observable features
  ids

  get(id) {
    return this.features[id]
  }

  load() {
    d3.csv(configStore.parcelUrl, (error, rows) => {
      if (error) {
        console.log('Error fetching parcels:', error)
        return
      }

      console.log('Loaded parcels:', rows)
      this.features = csv2features(rows)
      this.ids = _.map(this.features, f => f.id)
      this.theme()
      mapStore.setSDEMWhiteStroke()
    })
  }

  theme() {
    if (!this.features) return
    mapStore.setParcelCircles(features2geojson(this.features))
    mapStore.activateParcelTheme(appStore.activeParcelTheme)
  }

  @computed
  get SDEMParcelIds() {
    return _.filter(this.features, f => f.properties.SDEM === 'True').map(f => f.id)
  }

  popupText(feature) {
    const attr = appStore.activeParcelTheme
    const value = feature.properties[attr]
    const title = configStore.activeThemeConfig.display

    return `${title}: ${value}`
  }

  getAttribute(attribute) {
    return this.features.map(f => f.properties[attribute])
  }
}

export default new ParcelStore()
