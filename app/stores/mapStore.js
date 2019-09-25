import { computed, observable, action } from 'mobx'
import _ from 'lodash'

import {
  addParcelLayer,
  addCitiesOutlinesLayer,
  addPolygonLayers,
  setLabelLayerVisible,
} from '../components/styles'

import configStore from './configStore'
import parcelStore from './parcelStore'

class MapStore {
  map
  @observable mapLabelsVisible = false
  @observable activeBaseMap = 'light'
  @observable legendParams

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
  setLegendParams(legendParams) {
    this.legendParams = legendParams
  }

  setParcelCircles(geojson) {
    this.map.getSource('parcelCircles').setData(geojson)
  }

  setPolygons(geojson) {
    this.map.getSource('polygons').setData(geojson)
  }

  applyTheme(source, values, { colorScale, legendParams }) {
    values.forEach((v, id) => {
      this.map.setFeatureState({ source, id }, { color: colorScale(v) })
    })
    this.setLegendParams(legendParams)
  }

  computeTheme(data, { themeType, colorRange, colorMap }) {
    console.log('Theming', data)

    let colorScale, legendParams
    if (themeType === 'interpolate') {
      const e = d3.extent(data)

      colorScale = d3.scale
        .linear()
        .domain(e)
        .interpolate(d3.interpolateRgb)
        .range(colorRange)

      // build some intervals in the interpolation range for use in the legend
      const min = e[0]
      const max = e[1]
      const legendDomain = _.range(min, max, (max - min) / 5.0)
      legendDomain.push(max) // push the max too

      legendParams = {
        grades: legendDomain,
        colors: legendDomain.map(colorScale),
      }
    } else if (themeType === 'categorical') {
      colorScale = v => _.get(colorMap, v)

      legendParams = {
        grades: _.keys(colorMap),
        colors: _.values(colorMap),
      }
    } else {
      console.log('Theme type not supported')
    }

    return { colorScale, legendParams }
  }

  activateTheme(activeTheme) {
    console.log('Activate theme', activeTheme)
    const themeConfig = configStore.activeThemeConfig

    let data = parcelStore.getAttribute(themeConfig.attribute)

    if (themeConfig.type === 'float') {
      data = _.map(data, d => +d)
    }

    const theme = this.computeTheme(data, themeConfig)

    this.applyTheme('parcelCircles', data, theme)
  }
}

export default new MapStore()
