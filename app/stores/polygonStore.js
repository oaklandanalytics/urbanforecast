import d3 from 'd3'
import { action, observable } from 'mobx'

import configStore from './configStore'
import mapStore from './mapStore'

class PolygonStore {
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

  getAttribute(attribute, year) {
    return this.tazData[attribute][year]
  }
}

export default new PolygonStore()
