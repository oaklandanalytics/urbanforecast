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
      'circle-radius': {
        base: 1.75,
        stops: [[12, 2], [20, 200]],
      },
      'circle-opacity': 1.0,
      'circle-color': ['string', ['feature-state', 'color'], '#fff'],
      'circle-stroke-width': 1,
      'circle-stroke-color': '#1c1c1c',
    },
  })
}
