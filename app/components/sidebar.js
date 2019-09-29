import React from 'react'
import { observer } from 'mobx-react'
import { InputLabel, Select, Switch, FormControlLabel, Card, CardContent } from '@material-ui/core'

import appStore from '../stores/appStore'
import mapStore from '../stores/mapStore'
import configStore from '../stores/configStore'
import parcelStore from '../stores/parcelStore'
import polygonStore from '../stores/polygonStore'
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

    const activeBaseMap = (
      <div>
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
      </div>
    )

    const showMapLabels = (
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
    )

    const parcelSettings = (
      <Card>
        <CardContent>
          <Typography variant="h6">Parcel Settings</Typography>
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
          {mapStore.showParcels && (
            <div>
              <InputLabel>Active Theme</InputLabel>
              <Select
                native
                value={appStore.activeParcelTheme}
                onChange={v => appStore.setActiveParcelTheme(v.target.value)}
              >
                {configStore.themes.map(t => (
                  <option value={t.attribute} key={t.attribute}>
                    {t.display}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </CardContent>
      </Card>
    )

    const tazSettings = (
      <Card>
        <CardContent>
          <Typography variant="h6">TAZ Settings</Typography>
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
          {mapStore.showPolygons && (
            <div>
              <InputLabel>Active Theme</InputLabel>
              <Select
                native
                value={appStore.activePolygonTheme}
                onChange={v =>
                  appStore.setActivePolygonTheme(v.target.value, appStore.activePolygonYear)
                }
              >
                {polygonStore.attributeNames.map(n => (
                  <option value={n} key={n}>
                    {n}
                  </option>
                ))}
              </Select>
              <div style={{ height: 10 }} />
              <InputLabel>Active Year</InputLabel>
              <Select
                native
                value={appStore.activePolygonYear}
                onChange={v =>
                  appStore.setActivePolygonTheme(appStore.activePolygonTheme, v.target.value)
                }
              >
                {polygonStore.years.map(y => (
                  <option value={y} key={y}>
                    {y}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </CardContent>
      </Card>
    )

    const defaultPanel = () => (
      <div>
        <h2>Control Panel</h2>
        <Typography variant="body2" style={{ marginTop: -20 }}>
          Click any parcel for more information
        </Typography>
        <br />
        {tazSettings}
        <br />
        {parcelSettings}
        <br />
        <Card>
          <CardContent>
            <Typography variant="h6">Map Settings</Typography>
            {showMapLabels}
            {activeBaseMap}
          </CardContent>
        </Card>
      </div>
    )

    return (
      <div style={sideStyle}>
        <div style={{ margin: 15 }}>{activeFeature ? activeFeaturePanel() : defaultPanel()}</div>
      </div>
    )
  }
}
