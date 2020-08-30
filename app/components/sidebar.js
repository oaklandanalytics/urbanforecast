import React from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import {
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  FormControl,
  Typography,
} from '@material-ui/core'

import appStore from '../stores/appStore'
import mapStore from '../stores/mapStore'
import configStore from '../stores/configStore'
import parcelStore from '../stores/parcelStore'
import polygonStore from '../stores/polygonStore'
import { renderPlace } from '../stores/configStore'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'

@observer
export default class Sidebar extends React.Component {
  render() {
    const sideStyle = appStore.isMobile
      ? {
          position: 'absolute',
          top: 55,
          right: 0,
          bottom: 0,
          left: 0,
          overflow: 'auto',
          backgroundColor: '#eceff1',
          zIndex: 99,
        }
      : {
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
              <FilterSlider />
              <FormControlLabel
                control={
                  <Switch
                    checked={mapStore.showSDEM}
                    onChange={v => mapStore.setShowSDEM(v.target.checked)}
                    color="secondary"
                  />
                }
                label="Show SDEM Parcels"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={mapStore.showNonSDEM}
                    onChange={v => mapStore.setShowNonSDEM(v.target.checked)}
                    color="secondary"
                  />
                }
                label="Show Non-SDEM Parcels"
              />
              <Button onClick={() => parcelStore.theme()}>Load Parcels in View</Button>
            </div>
          )}
        </CardContent>
      </Card>
    )

    const years = toJS(polygonStore.years)
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
                onChange={v => appStore.setActivePolygonTheme(v.target.value)}
              >
                {polygonStore.attributeNames.map(n => (
                  <option value={n} key={n}>
                    {n}
                  </option>
                ))}
              </Select>
              {years.length && (
                <>
                  <div style={{ height: 10 }} />
                  <FormControl style={{ minWidth: 100 }}>
                    <InputLabel>Lower Year</InputLabel>
                    <Select
                      value={appStore.lowerPolygonYear}
                      onChange={v => appStore.setLowerPolygonYear(v.target.value)}
                    >
                      {years.map(y => (
                        <MenuItem value={y} key={y}>
                          {y}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <FormControl style={{ minWidth: 100 }}>
                    <InputLabel>Upper Year</InputLabel>
                    <Select
                      value={appStore.upperPolygonYear}
                      onChange={v => appStore.setUpperPolygonYear(v.target.value)}
                    >
                      {polygonStore.upperYears.map(y => (
                        <MenuItem value={y} key={y}>
                          {y}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}
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
        {parcelStore.ready ? parcelSettings : <h3>Loading parcels...</h3>}
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

@observer
class FilterSlider extends React.Component {
  render() {
    const showSlider = configStore.activeThemeIsFloat
    if (!showSlider) return null

    const extent = parcelStore.activeAttributeExtent
    const min = extent[0]
    const max = extent[1]

    const twentieths = (extent[1] - extent[0]) / 20
    const possibleValues = _.range(min, max, twentieths)
    possibleValues.push(max)

    const filterValue = toJS(parcelStore.filterValue)
    const possibleLowerValues = _.filter(possibleValues, v => v < filterValue[1])
    const possibleUpperValues = _.filter(possibleValues, v => v > filterValue[0])

    const count = parcelStore.features.length - parcelStore.filteredIds.length

    return (
      <div style={{ marginTop: 15, marginBottom: 10 }}>
        <InputLabel>Filter Parcels (Count={count})</InputLabel>
        <FormControl style={{ minWidth: 100 }}>
          <InputLabel>Lower Limit</InputLabel>
          <Select
            native
            value={filterValue[0]}
            onChange={v => parcelStore.setLowerFilterValue(v.target.value)}
          >
            {possibleLowerValues.map(y => (
              <option value={y} key={y}>
                {y}
              </option>
            ))}
          </Select>
        </FormControl>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <FormControl style={{ minWidth: 100 }}>
          <InputLabel>Upper Limit</InputLabel>
          <Select
            native
            value={filterValue[1]}
            onChange={v => parcelStore.setUpperFilterValue(v.target.value)}
          >
            {possibleUpperValues.map(y => (
              <option value={y} key={y}>
                {y}
              </option>
            ))}
          </Select>
        </FormControl>
      </div>
    )
  }
}
