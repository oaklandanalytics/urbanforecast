import d3 from 'd3'
import _ from 'lodash'

import { csv2features, features2geojson } from '../utils'

import configStore from './configStore'
import mapStore from './mapStore'

class ParcelStore {
  features

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

      mapStore.setParcelCircles(features2geojson(this.features))

      const data = _.map(rows, row => +row.residential_units)
      const theme = mapStore.computeTheme(data, {
        themeType: 'interpolate',
        colorRange: ['#f7fbff', '#08306b'],
        radiusRange: [4, 7],
      })
      mapStore.applyTheme('parcelCircles', data, theme)
    })
  }
}

export default new ParcelStore()
