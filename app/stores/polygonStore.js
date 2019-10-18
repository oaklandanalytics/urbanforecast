import d3 from 'd3'
import _ from 'lodash'
import { action, observable, computed } from 'mobx'
import colorbrewer from 'colorbrewer'

import configStore from './configStore'
import mapStore from './mapStore'
import appStore from './appStore'
import { emptyGeojson } from '../utils'

class PolygonStore {
  useLowerYear = 'Use Lower Year'
  geojson
  tazData
  ids
  @observable attributeNames = [] // attribute names available in tazData
  @observable years = [] // years available in tazData

  clear() {
    this.tazData = undefined
    mapStore.setPolygons(emptyGeojson)
  }

  load() {
    this.clear()

    d3.json(configStore.tazUrl, (error, geojson) => {
      if (error) {
        console.log('Error fetching polygons:', error)
        appStore.notify('Error fetching polygons')
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
        this.theme()
      })
      .catch(error => {
        console.log('Error fetching polygons:', error)
        appStore.notify('Error fetching TAZ data')
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
    if (!this.geojson || !this.tazData) return
    mapStore.setPolygons(this.geojson)
    mapStore.activatePolygonTheme()
  }

  popupText(feature) {
    const attr = appStore.activePolygonTheme
    const { id } = feature
    const index = this.ids[id]
    const value = this.attributeValues[index]

    return `${attr}: ${value}`
  }

  getThemeConfig(activeTheme) {
    // randomize the color scheme
    const ind = _.findIndex(this.attributeNames, f => f === activeTheme)

    const colorSchemes = colorbrewer.schemeGroups.sequential
    const numColorSchemes = _.size(colorSchemes)

    const colorSchemeName = colorSchemes[ind % numColorSchemes]
    const colorScheme = colorbrewer[colorSchemeName][7]

    const lowColor = colorScheme[0]
    const highColor = colorScheme[colorScheme.length - 1]

    return {
      attribute: activeTheme,
      display: activeTheme,
      type: 'float',
      themeType: 'interpolate',
      colorRange: [lowColor, highColor],
    }
  }

  @computed
  get attributeValues() {
    const { activePolygonTheme, lowerPolygonYear, upperPolygonYear } = appStore

    const attribute = activePolygonTheme
    const lowerYear = lowerPolygonYear
    const upperYear = upperPolygonYear

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
