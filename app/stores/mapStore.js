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

  applyTheme(source, values, { colorScale, legendParams }, type) {
    values.forEach((v, id) => {
      this.map.setFeatureState({ source, id }, { color: colorScale(v) })
    })
    this.setLegendParams(type, legendParams)
  }

  activateParcelTheme(activeTheme) {
    console.log('Activate parcel theme', activeTheme)
    const themeConfig = configStore.activeThemeConfig

    let data = parcelStore.getAttribute(themeConfig.attribute)

    if (themeConfig.type === 'float') {
      data = _.map(data, d => +d)
    }

    const theme = computeTheme(data, themeConfig)

    this.applyTheme('parcelCircles', data, theme, 'parcels')
  }

  /*
  TODO
  fix id of polygon layer
  random color scheme
  allow delta with 2nd year
  figure out what to do with legend
  */

  activatePolygonTheme() {
    const { activePolygonTheme, activePolygonYear } = appStore

    console.log('Activate polygon theme', toJS(activePolygonTheme))
    let data = polygonStore.getAttribute(activePolygonTheme, activePolygonYear)

    const theme = computeTheme(data, {
      activePolygonTheme,
      display: activePolygonTheme,
      type: 'float',
      themeType: 'interpolate',
      colorRange: ['#edf8fb', '#005824'],
    })

    this.applyTheme('polygons', data, theme, 'polygons')
  }
}

export default new MapStore()
