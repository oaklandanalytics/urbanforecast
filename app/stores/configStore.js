import React from 'react'
import _ from 'lodash'
import { computed } from 'mobx'
import { Typography } from '@material-ui/core'
import numeral from 'numeral'

import appStore from './appStore'

class ConfigStore {
  center = [-122.3, 37.7749]
  zoom = 10
  parcelUrl = 'data/run43_parcel_output.csv'
  themes = [
    {
      attribute: 'building_type',
      display: 'Building Type',
      type: 'string',
      themeType: 'categorical',
      colorMap: {
        HS: '#FEFF09',
        HT: '#C3C553',
        HM: '#FC4D06',
        OF: '#FC53D7',
        RS: '#FC1421',
        RB: '#6e1011',
        IL: '#7000FB',
        IW: '#2f0066',
        MR: '#755D35',
        MT: '#3d3319',
        ME: '#5D0001',
      },
    },
    {
      attribute: 'residential_units',
      display: 'Residential Units',
      type: 'float',
      themeType: 'interpolate',
      colorRange: ['#edf8fb', '#005824'],
    },
    {
      attribute: 'job_spaces',
      display: 'Job Spaces',
      type: 'float',
      themeType: 'interpolate',
      colorRange: ['#f7fbff', '#08306b'],
    },
  ]

  @computed
  get defaultTheme() {
    return this.themes[0].attribute
  }

  @computed
  get activeThemeConfig() {
    const attribute = appStore.activeTheme
    return _.find(this.themes, { attribute })
  }
}

export function renderPlace(f) {
  const p = f.properties
  console.log(f)
  const fmt = (num, format) => numeral(num).format(format)
  return (
    <Typography variant="body1">
      Parcel Id: {fmt(p.parcel_id, '0')}
      <br />
      Development Id: {fmt(p.development_id, '0')}
      <br />
      Land use: {_.startCase(p.form)}
      <br />
      Building type: {p.building_type}
      <br />
      <br />
      Year Built: {fmt(p.year_built, '0')}
      <br />
      Residential units: {fmt(p.residential_units, '0')}
      <br />
      Parcel size: {fmt(p.parcel_size / 43560.0, '0.00')} acres
      <br />
      Max far: {fmt(p.max_far, '0.0')}
      <br />
      Max dua: {fmt(p.max_dua, '0.0')}
      <br />
      Built dua: {fmt(+p.residential_units / (+p.parcel_size / 43560), '0.0')}
      <br />
      <br />
      Old building sqft: {fmt(p.total_sqft, '0,0')}
      <br />
      New building sqft: {fmt(p.building_sqft, '0,0')}
      <br />
      Net units: {fmt(p.net_units, '0')}
      <br />
      Stories: {fmt(p.stories, '0')}
      <br />
      Land cost: ${fmt(p.land_cost / 1000000, '0.0')}M<br />
      Construction cost: ${fmt(p.building_cost / 1000000, '0.0')}M<br />
      Building revenue: ${fmt(p.building_revenue / 1000000, '0.0')}M<br />
      Price / sqft: ${fmt(p.residential, '0')}
      <br />
      Oldest redev bldg: {fmt(p.oldest_building, '0')}
    </Typography>
  )
}

export default new ConfigStore()
