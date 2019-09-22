export function addLayers(map) {
  map.addSource('parcelCircles', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
    },
  })

  map.addLayer({
    id: 'parcelCircles',
    source: 'parcelCircles',
    type: 'circle',
    paint: {
      'circle-radius': ['number', ['feature-state', 'radius'], 5],
      'circle-opacity': ['number', ['feature-state', 'opacity'], 0],
      'circle-color': ['string', ['feature-state', 'color'], '#fff'],
      'circle-stroke-width': 1,
      'circle-stroke-color': '#1c1c1c',
    },
  })
}
