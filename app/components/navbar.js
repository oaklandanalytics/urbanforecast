import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'

import appStore from '../stores/appStore'

export default function ButtonAppBar() {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            style={{ marginRight: 10 }}
            color="inherit"
            onClick={() => appStore.toggleSidebar()}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">UrbanExplorer</Typography>
        </Toolbar>
      </AppBar>
    </div>
  )
}
