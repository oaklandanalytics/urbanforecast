import React from 'react'
import { observer } from 'mobx-react'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@material-ui/core'

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
      background: 'rgba(255, 255, 255, 1)',
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
        <FormControl>
          <InputLabel shrink>Active Theme</InputLabel>
          <Select
            value={appStore.activeTheme}
            onChange={v => appStore.setActiveTheme(v.target.value)}
          >
            {configStore.themes.map(t => (
              <MenuItem value={t.attribute} key={t.attribute}>
                {t.display}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
      </div>
    )

    return (
      <div style={sideStyle}>
        <div style={{ margin: 15 }}>{activeFeature ? activeFeaturePanel() : defaultPanel()}</div>
      </div>
    )
  }
}
