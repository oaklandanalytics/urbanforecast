import React from 'react'
import Typography from '@material-ui/core/Typography'
import numeral from 'numeral'

class ConfigStore {
  center = [-122.3, 37.7749]
  zoom = 10
  parcelUrl = 'data/run43_parcel_output.csv'
}

export function renderPlace(f) {
  const p = f.properties
  console.log(f)
  const fmt = (num, format) => numeral(num).format(format)
  return (
    <Typography variant="body1">
      Parcel Id: {(+p.parcel_id).toFixed(0)}
      <br />
      Development Id: {(+p.development_id).toFixed(0)}
      <br />
      Land use: {_.startCase(p.form)}
      <br />
      Building type: {p.building_type}
      <br />
      <br />
      Year Built: {(+p.year_built).toFixed(0)}
      <br />
      Residential units: {(+p.residential_units).toFixed(0)}
      <br />
      Parcel size: {(+p.parcel_size / 43560.0).toFixed(2)} acres
      <br />
      Max far: {(+p.max_far).toFixed(1)}
      <br />
      Max dua: {(+p.max_dua).toFixed(1)}
      <br />
      Built dua: {(+p.residential_units / (+p.parcel_size / 43560)).toFixed(1)}
      <br />
      <br />
      Old building sqft: {fmt(+p.total_sqft, '0,0')}
      <br />
      New building sqft: {fmt(+p.building_sqft, '0,0')}
      <br />
      Net units: {(+p.net_units).toFixed(0)}
      <br />
      Stories: {(+p.stories).toFixed(0)}
      <br />
      Land cost: ${(+p.land_cost / 1000000).toFixed(1)}M<br />
      Construction cost: ${(+p.building_cost / 1000000).toFixed(1)}M<br />
      Building revenue: ${(+p.building_revenue / 1000000).toFixed(1)}M<br />
      Price / sqft: ${(+p.residential).toFixed(0)}
      <br />
      Oldest redev bldg: {(+p.oldest_building).toFixed(0)}
    </Typography>
  )
}

export default new ConfigStore()
