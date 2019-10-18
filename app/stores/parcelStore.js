import d3 from 'd3'
import { observable, computed, action } from 'mobx'

import { csv2features, features2geojson, emptyGeojson } from '../utils'

import configStore from './configStore'
import mapStore from './mapStore'
import appStore from './appStore'

class ParcelStore {
  @observable features
  @observable filterValue
  ids

  get(id) {
    return this.features[id]
  }

  clear() {
    this.features = undefined
    mapStore.setParcelCircles(emptyGeojson)
  }

  load() {
    this.clear()

    d3.csv(configStore.parcelUrl, (error, rows) => {
      if (error) {
        console.log('Error fetching parcels:', error)
        appStore.notify('Error fetching parcels')
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

  @action
  setFilterValue(filterValue) {
    this.filterValue = filterValue
    mapStore.doParcelFilter()
  }

  setLowerFilterValue(lowerFilterValue) {
    this.setFilterValue([lowerFilterValue, this.filterValue[1]])
  }

  @action
  setUpperFilterValue(upperFilterValue) {
    this.setFilterValue([this.filterValue[0], upperFilterValue])
  }

  @computed
  get filteredIds() {
    if (!this.filterValue) return []

    const filterThese = []
    const min = this.filterValue[0]
    const max = this.filterValue[1]

    this.activeAttribute.forEach((v, ind) => {
      const id = this.ids[ind]
      if (+v < min) filterThese.push(id)
      if (+v > max) filterThese.push(id)
    })

    return filterThese
  }

  @computed
  get filteredIdsDict() {
    return _.keyBy(this.filteredIds)
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

  @computed
  get activeAttribute() {
    return this.getAttribute(appStore.activeParcelTheme)
  }

  @computed
  get activeAttributeExtent() {
    if (!this.features) return [0, 10]
    return d3.extent(this.activeAttribute.map(f => +f))
  }
}

export default new ParcelStore()
