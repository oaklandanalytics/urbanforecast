import React from 'react'
import { observer } from 'mobx-react'
import { InputLabel, Select, Switch, FormControlLabel } from '@material-ui/core'

import appStore from '../stores/appStore'
import mapStore from '../stores/mapStore'
import configStore from '../stores/configStore'
import parcelStore from '../stores/parcelStore'
import { renderPlace } from '../stores/configStore'
import { Typography } from '@material-ui/core'

@observer
export default class Sidebar extends React.Component {
  render() {
    const sideStyle = {
      position: 'absolute',
      top: 70,
      right: 10,
      bottom: 10,
      width: 350,
      overflow: 'auto',
      backgroundColor: '#eceff1',
      borderRadius: 6,
    }

    const { activeFeature } = appStore

    const activeFeaturePanel = () => (
      <div>
        <h3>Active Feature Data</h3>
        {renderPlace(parcelStore.get(activeFeature))}
      </div>
    )

    const defaultPanel = () => (
      <div>
        <h2>Control Panel</h2>
        <Typography variant="body2">Click any place for more information</Typography>
        <br />
        <InputLabel>Active Theme</InputLabel>
        <Select
          native
          value={appStore.activeTheme}
          onChange={v => appStore.setActiveTheme(v.target.value)}
        >
          {configStore.themes.map(t => (
            <option value={t.attribute} key={t.attribute}>
              {t.display}
            </option>
          ))}
        </Select>
        <br />
        <br />
        <InputLabel>Active Basemap</InputLabel>
        <Select
          native
          value={mapStore.activeBaseMap}
          onChange={v => mapStore.setActiveBaseMap(v.target.value)}
        >
          {['satellite', 'light', 'dark'].map(t => (
            <option value={t} key={t}>
              {t}
            </option>
          ))}
        </Select>
        <br />
        <br />
        <FormControlLabel
          control={
            <Switch
              checked={mapStore.mapLabelsVisible}
              onChange={v => mapStore.setMapLabelsVisible(v.target.checked)}
              color="secondary"
            />
          }
          label="Show Map Labels"
        />
        <FormControlLabel
          control={
            <Switch
              checked={mapStore.showParcels}
              onChange={v => mapStore.setShowParcels(v.target.checked)}
              color="secondary"
            />
          }
          label="Show Parcel Layer"
        />
        <FormControlLabel
          control={
            <Switch
              checked={mapStore.showPolygons}
              onChange={v => mapStore.setShowPolygons(v.target.checked)}
              color="secondary"
            />
          }
          label="Show TAZ Layer"
        />
      </div>
    )

    return (
      <div style={sideStyle}>
        <div style={{ margin: 15 }}>{activeFeature ? activeFeaturePanel() : defaultPanel()}</div>
      </div>
    )
  }
}
