import d3 from 'd3'

import configStore from './configStore'
import mapStore from './mapStore'

class PolygonStore {
  geojson

  load() {
    d3.json(configStore.tazUrl, (error, geojson) => {
      if (error) {
        console.log('Error fetching polygons:', error)
        return
      }

      console.log('Loaded polygons:', geojson)
      this.geojson = geojson
      this.theme()
    })
  }

  theme() {
    if (!this.geojson) return
    mapStore.setPolygons(this.geojson)
    // mapStore.activateTheme(appStore.activeTheme)
  }

  getAttribute(attribute) {
    return this.geojson.features.map(f => f.properties[attribute])
  }
}

export default new PolygonStore()
