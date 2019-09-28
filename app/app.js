import React from 'react'
import ReactDOM from 'react-dom'
import Map from './components/map.js'
import Navbar from './components/navbar'
import Sidebar from './components/sidebar'
import Legend from './components/legend'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { observer } from 'mobx-react'

import appStore from './stores/appStore'
import mapStore from './stores/mapStore'

const theme = createMuiTheme({
  palette: {
    primary: { main: '#37474f' },
    secondary: { main: '#ff8a65' },
  },
})

@observer
class App extends React.Component {
  componentDidMount() {
    appStore.init()
  }

  render() {
    return (
      <div>
        <ThemeProvider theme={theme}>
          <Navbar />
          <Map />
          {mapStore.showParcels && <Legend layer="parcels" />}
          {mapStore.showPolygons && <Legend layer="polygons" />}
          {appStore.showSidebar && <Sidebar />}
        </ThemeProvider>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
