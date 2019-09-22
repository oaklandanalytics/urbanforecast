import React from 'react'
import ReactDOM from 'react-dom'
import Map from './components/map.js'
import Navbar from './components/navbar'
import Sidebar from './components/sidebar'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { observer } from 'mobx-react'

import appStore from './stores/appStore'

const theme = createMuiTheme({
  palette: {
    primary: { main: '#37474f' },
    secondary: { main: '#11cb5f' },
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
          {appStore.showSidebar && <Sidebar />}
        </ThemeProvider>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
