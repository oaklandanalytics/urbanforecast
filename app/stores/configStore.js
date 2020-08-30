import React from 'react'
import _ from 'lodash'
import { computed, toJS } from 'mobx'
import { Typography } from '@material-ui/core'
import numeral from 'numeral'

import appStore from './appStore'
import firebaseStore from './firebaseStore'

class ConfigStore {
  center = [-122.4, 37.7749]
  zoom = 12
  citiesUrl = 'data/cities.geojson'
  tazUrl = 'data/tazs.geojson'
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
    {
      attribute: 'source',
      display: 'Source',
      type: 'string',
      themeType: 'categorical',
      colorMap: {
        bas_bp_new: '#FEFF09',
        rf: '#C3C553',
        cs: '#FC4D06',
        h5_inputs: '#FC53D7',
        developer_model: '#FC1421',
        manual: '#6e1011',
      },
    },
  ]

  @computed
  get defaultTheme() {
    return this.themes[0].attribute
  }

  @computed
  get activeThemeConfig() {
    const attribute = appStore.activeParcelTheme
    return _.find(this.themes, { attribute })
  }

  @computed
  get activeThemeIsFloat() {
    return this.activeThemeConfig.type === 'float'
  }

  @computed
  get parcelUrl() {
    return firebaseStore.activeSimulationConfig['parcel_url']
  }

  @computed
  get tazData() {
    return firebaseStore.activeSimulationConfig['taz_url']
  }
}

export function renderPlace(f) {
  const p = f.properties
  console.log(toJS(f))
  const fmt = (num, format) => numeral(num).format(format)
  return (
    <Typography variant="body1">
      Parcel Id: {fmt(p.parcel_id, '0')}
      <br />
      Development Id: {fmt(p.development_id, '0')}
      <br />
      <br />
      Building type: {p.building_type}
      <br />
      Source: {p.source || 'Not present'}
      <br />
      Year Built: {p.year_built === undefined ? 'Not present' : fmt(p.year_built, '0')}
      <br />
      <br />
      Residential units: {fmt(p.residential_units, '0')}
      <br />
      Job spaces: {fmt(p.job_spaces, '0')}
      <br />
      Parcel size:{' '}
      {!p.parcel_size ? 'Not present' : <span>{fmt(p.parcel_size / 43560.0, '0.00')} acres</span>}
      <br />
      Max far: {p.max_far === undefined ? 'Not present' : fmt(p.max_far, '0.0')}
      <br />
      Max dua: {p.max_dua === undefined ? 'Not present' : fmt(p.max_dua, '0.0')}
    </Typography>
  )
}

export default new ConfigStore()
