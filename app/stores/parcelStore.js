import d3 from 'd3'
import { observable, computed, action, runInAction } from 'mobx'

import { csv2features, features2geojson, emptyGeojson } from '../utils'

import configStore from './configStore'
import mapStore from './mapStore'
import appStore from './appStore'
import _ from 'lodash'

class ParcelStore {
  @observable ready
  @observable features
  @observable filterValue
  ids
  // we are filtering to the view since there are so many parcels
  // this is an object where keys are parcelIds with values that are "true"
  visibleParcelIds

  get(id) {
    return this.features[id]
  }

  clear() {
    this.features = undefined
    mapStore.setParcelCircles(emptyGeojson)
  }

  load() {
    this.clear()

    runInAction(() => (this.ready = false))
    d3.csv(configStore.parcelUrl, (error, rows) => {
      if (error) {
        console.log('Error fetching parcels:', error)
        appStore.notify('Error fetching parcels')
        return
      }
      console.log(`Loaded ${_.size(rows)} parcels`)
      console.log('Sample parcels:', _.slice(rows, 0, 100))

      // to save memory only keep certain attributes
      const attributesToKeep = _.concat(_.map(configStore.themes, 'attribute'), 'SDEM')

      this.features = csv2features(rows, attributesToKeep)
      this.ids = _.map(this.features, f => f.id)
      this.theme()
      mapStore.setSDEMStroke()
    })
  }

  getFeaturesInView() {
    const { _ne, _sw } = mapStore.map.getBounds()
    return _.filter(
      this.features,
      f =>
        f.geometry.coordinates[0] > _sw.lng &&
        f.geometry.coordinates[0] < _ne.lng &&
        f.geometry.coordinates[1] > _sw.lat &&
        f.geometry.coordinates[1] < _ne.lat
    )
  }

  theme() {
    if (!this.features) return
    const parcels = this.getFeaturesInView()
    this.visibleParcelIds = _.fromPairs(_.map(parcels, p => [p.id, true]))
    console.log(`Theming ${parcels.length} features`)
    mapStore.setParcelCircles(features2geojson(parcels))
    mapStore.activateParcelTheme(appStore.activeParcelTheme)
    runInAction(() => (this.ready = true))
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
