import { computed } from 'mobx'
import _ from 'lodash'

import { addLayers } from '../components/styles'

import configStore from './configStore'
import parcelStore from './parcelStore'

class MapStore {
  baseMap = 'light'
  map
  legendParams

  @computed
  get baseMapUrl() {
    return `mapbox://styles/mapbox/${this.baseMap}-v9`
  }

  setMap(map) {
    this.map = map
  }

  addLayers() {
    addLayers(this.map)
  }

  setParcelCircles(geojson) {
    this.map.getSource('parcelCircles').setData(geojson)
  }

  applyTheme(source, values, { colorScale }) {
    values.forEach((v, id) => {
      this.map.setFeatureState({ source, id }, { color: colorScale(v) })
    })
  }

  computeTheme(data, { themeType, colorRange, colorMap }) {
    console.log('Theming', data)

    let colorScale
    if (themeType === 'interpolate') {
      const e = d3.extent(data)

      colorScale = d3.scale
        .linear()
        .domain(e)
        .interpolate(d3.interpolateRgb)
        .range(colorRange)

      /*
      // build some intervals in the interpolation range for
      // use in the legend
      var legendDomain = _.range(min, max, (max - min) / 5.0)
      legendDomain.push(max) // push the max too

      this.setState({
        legendParams: {
          dontFormatLegend: t.dontFormatLegend,
          grades: legendDomain,
          colors: legendDomain.map(a => scale(a)),
          heading: t.legendName || t.attr,
        },
      })
       */
    } else if (themeType === 'categorical') {
      colorScale = v => _.get(colorMap, v, colorMap._DEFAULT_)

      /*
      var keys = t.legendKeys || _.keys(t.categorical)

      this.setState({
        legendParams: {
          dontFormatLegend: t.dontFormatLegend,
          grades: keys,
          colors: keys.map(k => t.categorical[k]),
          heading: t.attr,
        },
      })
       */
    } else {
      console.log('Theme type not supported')
    }

    return { colorScale }
  }

  activateTheme(activeTheme) {
    console.log('Activate theme', activeTheme)
    const themeConfig = configStore.getThemeConfig(activeTheme)

    let data = parcelStore.getAttribute(themeConfig.attribute)

    if (themeConfig.type === 'float') {
      data = _.map(data, d => +d)
    }

    const theme = this.computeTheme(data, themeConfig)

    this.applyTheme('parcelCircles', data, theme)
  }
}

export default new MapStore()
