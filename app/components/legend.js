import React from 'react'
import { observer } from 'mobx-react'
import numeral from 'numeral'
import _ from 'lodash'
import { Typography } from '@material-ui/core'

import appStore from '../stores/appStore'
import mapStore from '../stores/mapStore'
import configStore from '../stores/configStore'

@observer
export default class Legend extends React.Component {
  static getIStyle(v) {
    return {
      width: 18,
      height: 18,
      float: 'left',
      marginRight: 8,
      opacity: 1.0,
      background: v,
    }
  }

  // format the number appropriately for the legend
  static formatNumber(num) {
    if (configStore.activeThemeConfig.dontFormatLegend) return num

    if (!_.isNumber(num)) return num

    if (num < -1000000 || num > 1000000) {
      return numeral(num / 1000000).format('0,0.0') + 'M'
    }
    if (num < -1000 || num > 1000) {
      return numeral(num / 1000).format('0,0.0') + 'k'
    }
    if (num < 1.0 && num > -1.0 && num !== 0) {
      if ((num * 10) % 1 !== 0) {
        return numeral(num).format('.00')
      } else {
        return numeral(num).format('.0')
      }
    }
    if (num % 1 !== 0 && num <= 20) {
      return numeral(num).format('0.0')
    }
    if (num % 1 !== 0) {
      return (num = Math.floor(num))
    }
    return num
  }

  render() {
    const { layer } = this.props
    const legendParams = mapStore.legendParams.get(layer)
    if (!legendParams) return null

    const { grades, colors } = legendParams
    const title =
      layer === 'parcels' ? configStore.activeThemeConfig.display : appStore.activePolygonTheme

    const legendStyle = {
      position: 'absolute',
      left: '7px',
      padding: '6px 8px',
      background: 'rgba(255,255,255,1)',
      boxShadow: '0 0 15px rgba(0,0,0,0.2)',
      borderRadius: '5px',
      textAlign: 'left',
      lineHeight: '19px',
      color: '#555',
      zIndex: 99,
    }

    if (layer === 'parcels') {
      legendStyle.bottom = '7px'
    }

    if (layer === 'polygons') {
      legendStyle.top = '67px'
    }

    return (
      <div style={legendStyle}>
        {title && <Typography variant="subtitle1">{title}</Typography>}
        {grades.map(Legend.formatNumber).map((v, i) => (
          <div key={i}>
            <i style={Legend.getIStyle(colors[i])} />
            <Typography variant="body2">{v}</Typography>
          </div>
        ))}
      </div>
    )
  }
}
