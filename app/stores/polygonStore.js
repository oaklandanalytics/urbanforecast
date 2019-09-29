import d3 from 'd3'
import { action, observable, computed } from 'mobx'

import configStore from './configStore'
import mapStore from './mapStore'
import appStore from './appStore'

class PolygonStore {
  useLowerYear = 'Lower Year Only'
  geojson
  tazData
  ids
  @observable attributeNames = [] // attribute names available in tazData
  @observable years = [] // years available in tazData

  load() {
    d3.json(configStore.tazUrl, (error, geojson) => {
      if (error) {
        console.log('Error fetching polygons:', error)
        return
      }

      geojson.features.forEach(f => (f.id = f.properties.ZONE_ID))
      console.log('Loaded polygons:', geojson)
      this.geojson = geojson
      this.theme()
    })

    fetch(configStore.tazData)
      .then(response => response.text())
      .then(text => {
        // have to do it this way in order to replace the NaN values, which aren't real JSON
        // if we fix the NaNs in the python, we can make this look like the above
        text = text.replace(/NaN/g, '0')
        this.setTazData(JSON.parse(text))
        console.log('Loaded taz data:', this.tazData)
      })
  }

  @computed
  get upperYears() {
    return _.concat([this.useLowerYear], _.filter(this.years, y => y > appStore.lowerPolygonYear))
  }

  @action
  setTazData(tazData) {
    this.tazData = tazData
    const { years, index, ...attributes } = tazData

    this.attributeNames = _.sortBy(_.keys(attributes))
    this.ids = index
    this.years = years
  }

  theme() {
    if (!this.geojson) return
    mapStore.setPolygons(this.geojson)
    mapStore.activatePolygonTheme()
  }

  getAttribute(attribute, lowerYear, upperYear) {
    const useLowerYear = upperYear === this.useLowerYear

    if (useLowerYear) {
      return this.tazData[attribute][lowerYear]
    }

    // return diff, upper year minus lower year
    const lowerYearValues = this.tazData[attribute][lowerYear]
    const upperYearValues = this.tazData[attribute][upperYear]
    return _.zip(lowerYearValues, upperYearValues).map(a => a[1] - a[0])
  }
}

export default new PolygonStore()
