export function csv2features(data) {
  return data.map((row, id) => {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [+row.x, +row.y],
      },
      id,
      properties: row,
    }
  })
}

export function features2geojson(features) {
  return {
    type: 'FeatureCollection',
    features,
  }
}

export const emptyGeojson = features2geojson([])
