import React from 'react'
import { observer } from 'mobx-react'

import appStore from '../stores/appStore'
import parcelStore from '../stores/parcelStore'
import { renderPlace } from '../stores/configStore'

@observer
export default class Sidebar extends React.Component {
  render() {
    const sideStyle = {
      position: 'absolute',
      top: 75,
      right: 15,
      bottom: 15,
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

    return (
      <div style={sideStyle}>
        <div style={{ margin: 15 }}>{activeFeature && activeFeaturePanel()}</div>
      </div>
    )
  }
}
