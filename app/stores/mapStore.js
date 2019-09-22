import { computed } from 'mobx'

import { addLayers } from '../components/styles'

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

  applyTheme(source, values, { colorScale, radiusScale }) {
    values.forEach((v, id) => {
      this.map.setFeatureState(
        { source, id },
        { color: colorScale(v), opacity: 1, radius: radiusScale(v) }
      )
    })
  }

  computeTheme(data, { themeType, colorRange, radiusRange }) {
    console.log('Theming', data)

    let colorScale, radiusScale
    if (themeType === 'interpolate') {
      const e = d3.extent(data)

      colorScale = d3.scale
        .linear()
        .domain(e)
        .interpolate(d3.interpolateRgb)
        .range(colorRange)

      radiusScale = d3.scale
        .linear()
        .domain(e)
        .range(radiusRange)

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
      /*
      const scale = v => _.get(categoricalColorMap, v)

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

    return { colorScale, radiusScale }
  }
}

export default new MapStore()
