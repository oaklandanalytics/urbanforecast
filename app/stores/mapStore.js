import { computed, observable, action, toJS } from 'mobx'
import _ from 'lodash'

import { computeTheme } from '../theming'

import appStore from './appStore'

import {
  addParcelLayer,
  addCitiesOutlinesLayer,
  addPolygonLayers,
  setLabelLayerVisible,
} from '../components/styles'

import configStore from './configStore'
import parcelStore from './parcelStore'
import polygonStore from './polygonStore'

class MapStore {
  map
  @observable mapLabelsVisible = false
  @observable activeBaseMap = 'light'
  legendParams = observable.map()
  @observable showParcels = false
  @observable showPolygons = true
  @observable showSDEM = true

  @computed
  get baseMapUrl() {
    return `mapbox://styles/mapbox/${this.activeBaseMap}-v9`
  }

  setMap(map) {
    this.map = map
  }

  addLayers() {
    addParcelLayer(this.map)
    addCitiesOutlinesLayer(this.map, configStore.citiesUrl, '#4e5156')
    addPolygonLayers(this.map)
  }

  @action
  setActiveBaseMap(baseMap) {
    this.activeBaseMap = baseMap
    this.map.setStyle(this.baseMapUrl)
  }

  @action
  setMapLabelsVisible(mapLabelsVisible) {
    this.mapLabelsVisible = mapLabelsVisible
    setLabelLayerVisible(this.map, mapLabelsVisible)
  }

  @action
  setShowParcels(showParcels) {
    this.showParcels = showParcels
    this.map.setLayoutProperty('parcelCircles', 'visibility', showParcels ? 'visible' : 'none')
  }

  @action
  setShowPolygons(showPolygons) {
    this.showPolygons = showPolygons
    this.map.setLayoutProperty('polygons', 'visibility', showPolygons ? 'visible' : 'none')
    this.map.setLayoutProperty('polygons_border', 'visibility', showPolygons ? 'visible' : 'none')
    this.map.setLayoutProperty(
      'polygons_highlight',
      'visibility',
      showPolygons ? 'visible' : 'none'
    )
  }

  @action
  setShowSDEM(showSDEM) {
    this.showSDEM = showSDEM
    _.each(parcelStore.SDEMParcelIds, id => {
      const opacity = showSDEM ? 1 : 0
      const stroke = showSDEM ? 1 : 0
      this.map.setFeatureState({ source: 'parcelCircles', id }, { opacity, stroke })
    })
  }

  setSDEMWhiteStroke() {
    _.each(parcelStore.SDEMParcelIds, id => {
      this.map.setFeatureState({ source: 'parcelCircles', id }, { stroke: 1, strokeColor: '#fff' })
    })
  }

  @action
  setLegendParams(type, legendParams) {
    this.legendParams.set(type, legendParams)
  }

  setParcelCircles(geojson) {
    if (!this.map) return
    this.map.getSource('parcelCircles').setData(geojson)
  }

  setPolygons(geojson) {
    if (!this.map) return
    this.map.getSource('polygons').setData(geojson)
  }

  lastFeature
  highlightFeature(id) {
    const set = (id, active) =>
      this.map.setFeatureState({ source: 'parcelCircles', id }, { active })

    if (this.lastFeature) set(this.lastFeature, false)
    if (id) set(id, true)

    this.lastFeature = id
  }

  previousFilter = []
  doParcelFilter() {
    const setFiltered = (id, filtered) => {
      const opacity = filtered ? 1 : 0
      const stroke = filtered ? 1 : 0
      this.map.setFeatureState({ source: 'parcelCircles', id }, { opacity, stroke })
    }

    const { filteredIds } = parcelStore

    this.previousFilter.forEach(id => setFiltered(id, 1))

    filteredIds.forEach(id => setFiltered(id, 0))

    this.previousFilter = filteredIds
  }

  applyTheme(source, values, ids, { colorScale, legendParams }, type) {
    if (!this.map) return

    values.forEach((v, index) => {
      const id = ids[index]
      this.map.setFeatureState({ source, id }, { color: colorScale(v) })
    })
    this.setLegendParams(type, legendParams)
  }

  activateParcelTheme(activeTheme) {
    console.log('Activate parcel theme', activeTheme)
    const themeConfig = configStore.activeThemeConfig

    let data = parcelStore.activeAttribute
    const { ids } = parcelStore

    if (themeConfig.type === 'float') {
      data = _.map(data, d => +d)
    }

    const theme = computeTheme(data, themeConfig)

    this.applyTheme('parcelCircles', data, ids, theme, 'parcels')
  }

  activatePolygonTheme() {
    const { activePolygonTheme, lowerPolygonYear, upperPolygonYear } = appStore

    console.log(
      'Activate polygon theme',
      toJS(activePolygonTheme),
      toJS(lowerPolygonYear),
      toJS(upperPolygonYear)
    )

    const data = polygonStore.attributeValues
    const { ids } = polygonStore
    const themeConfig = polygonStore.getThemeConfig(activePolygonTheme)

    const theme = computeTheme(data, themeConfig)

    this.applyTheme('polygons', data, ids, theme, 'polygons')
  }
}

export default new MapStore()
