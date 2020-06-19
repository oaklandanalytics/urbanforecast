import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core'
import { observer } from 'mobx-react'
import MenuIcon from '@material-ui/icons/Menu'

import appStore from '../stores/appStore'
import firebaseStore from '../stores/firebaseStore'

@observer
export default class ButtonAppBar extends React.Component {
  render() {
    const drawerItems = (
      <div onClick={() => appStore.toggleDrawer()}>
        <List>
          <ListItem button key={'toggle'} onClick={() => appStore.toggleSidebar()}>
            <ListItemText primary={'Toggle Sidebar (Or click navbar)'} />
          </ListItem>
          {_.map(firebaseStore.simulations, (obj, key) => (
            <ListItem button key={key} onClick={() => appStore.setActiveSimulation(key)}>
              <ListItemText primary={obj.name} />
            </ListItem>
          ))}
        </List>
      </div>
    )

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              style={{ marginRight: 10 }}
              color="inherit"
              onClick={() => appStore.toggleDrawer()}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              onClick={() => appStore.toggleSidebar()}
              style={{ cursor: 'pointer ' }}
            >
              UrbanForecast
            </Typography>
            <span style={{ width: 15 }} />
            {firebaseStore.activeSimulationName}
          </Toolbar>
        </AppBar>
        <Drawer open={appStore.sideDrawerOpen} onClose={() => appStore.toggleDrawer()}>
          {drawerItems}
        </Drawer>
      </div>
    )
  }
}
