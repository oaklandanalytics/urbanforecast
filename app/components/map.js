import React from 'react'

import appStore from '../stores/appStore'
import mapStore from '../stores/mapStore'
import configStore from '../stores/configStore'
import parcelStore from '../stores/parcelStore'
import polygonStore from '../stores/polygonStore'
import { setLabelLayerVisible } from './styles'

mapboxgl.accessToken = 'pk.eyJ1IjoiZnNjb3R0Zm90aSIsImEiOiJLVHVqNHlNIn0.T0Ca4SWbbTc1p2jogYLQyA'

export default class Map extends React.Component {
  componentDidMount() {
    const { center, zoom } = configStore

    const map = new mapboxgl.Map({
      container: 'map',
      style: mapStore.baseMapUrl,
      center,
      zoom,
      attributionControl: false,
    })

    map.doubleClickZoom.disable()
    map.dragRotate.disable()

    map.on('style.load', () => {
      mapStore.setMap(map)
      setLabelLayerVisible(map, mapStore.mapLabelsVisible)
      mapStore.addLayers()
      this.initHover(map)
      parcelStore.theme()
      polygonStore.theme()
    })

    this.initClick(map)
  }

  initClick(map) {
    map.off('click')
    map.on('click', e => {
      const features = map.queryRenderedFeatures(e.point, { layers: ['parcelCircles'] })
      if (_.size(features) === 0) {
        appStore.setActiveFeature()
      } else {
        appStore.setActiveFeature(features[0].id)
      }
    })
  }

  initHover(map) {
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    })

    map.off('mousemove')
    map.off('mouseleave')

    map.on('mousemove', 'parcelCircles', e => {
      map.getCanvas().style.cursor = 'pointer'
      const popupText = parcelStore.popupText(e.features[0])

      popup
        .setLngLat(e.lngLat)
        .setHTML(popupText)
        .addTo(map)
    })

    map.on('mouseleave', 'parcelCircles', () => {
      map.getCanvas().style.cursor = ''
      popup.remove()
    })

    map.on('mousemove', 'polygons', e => {
      const popupText = polygonStore.popupText(e.features[0])

      popup
        .setLngLat(e.lngLat)
        .setHTML(popupText)
        .addTo(map)
    })

    map.on('mouseleave', 'polygons', () => {
      popup.remove()
    })
  }

  render() {
    const mapStyle = {
      position: 'absolute',
      left: 0,
      top: appStore.isMobile ? 55 : 60,
      bottom: 0,
      width: '100%',
    }

    return (
      <div>
        <div id="map" style={mapStyle} />
      </div>
    )
  }
}
