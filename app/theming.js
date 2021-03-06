import _ from 'lodash'

export function computeTheme(data, { themeType, colorRange, colorMap }) {
  console.log('Theming sample data', _.slice(data, 0, 5000))

  let colorScale, radiusScale, legendParams
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
      .interpolate(d3.interpolateNumber)
      .range([3, 7])

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

  return { colorScale, radiusScale, legendParams }
}
