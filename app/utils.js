export function csv2features(data, attributesToKeep) {
  return data.map((row, id) => {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [+row.x, +row.y],
      },
      id,
      properties: _.pick(row, attributesToKeep),
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
