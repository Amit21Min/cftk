import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import DashboardPanel from '../DashboardPanel';
import RoutesPanel from '../RoutesPanel';
import VolunteersPanel from '../VolunteersPanel';

import NewRoutePanel from '../NewRoutePanel';
import DeleteDialogs from '../DeleteDialogs';

import EditRoutePanel from '../EditRoutePanel';
import AssignRoute from '../AssignRoute';

import * as ROUTES from '../../constants/routes';

import './index.css';

import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles"

import DashboardIcon from '@material-ui/icons/Dashboard';
import RoomIcon from '@material-ui/icons/Room';
import GroupIcon from '@material-ui/icons/Group';
import MessageIcon from '@material-ui/icons/Message';
import SettingsIcon from '@material-ui/icons/Settings';

const useStyles = makeStyles((theme) => ({
  drawerPaper: { width: 'inherit' },
  link: { textDecoration: 'none', color: theme.palette.text.primary}
}));

const Sidebar = () => {
  const classes = useStyles();

  return (
  <div id="sidebar">

    <div id="sidebar-menu">
      <h2>Sidebar</h2>
      <div id="sidebar-header-container">
        <div id="sidebar-user-portrait">
          (..)
        </div>
        <div id="sidebar-user-name">
          John Doe
        </div>
      </div>

      <div id="sidebar-adaptation">
        <Switch>
        </Switch>
      </div>
    </div>

    <div id="sidebar-panel">
      <Switch>
        <Route exact path={ROUTES.ADMIN_DASHBOARD}  component={DashboardPanel} />
        <Route exact path={ROUTES.ADMIN_ROUTES}     component={RoutesPanel} />
        <Route exact path={ROUTES.ADMIN_VOLUNTEERS} component={VolunteersPanel} />
        <Route exact path={ROUTES.ADMIN_ROUTES_NEW} component={NewRoutePanel} />
        <Route exact path={ROUTES.ADMIN_ROUTES_DEL} component={DeleteDialogs} />
        <Route exact path={ROUTES.ADMIN_ROUTES_EDIT} component={EditRoutePanel} />
        <Route path={ROUTES.ASSIGN_ROUTE} component={AssignRoute} />
      </Switch>
    </div>

    <Drawer
      style={{width: '200px'}}
      variant="persistent"
      anchor="left"
      open={true}
      classes={{paper: classes.drawerPaper}}
    
      >
      <List>
        <Link to={ROUTES.ADMIN_DASHBOARD} className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <DashboardIcon/>
            </ListItemIcon>
            <ListItemText primary={"Dashboard"}/>
          </ListItem>
        </Link>
        <Link to={ROUTES.ADMIN_ROUTES} className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <RoomIcon/>
            </ListItemIcon>
            <ListItemText primary={"Routes"}/>
          </ListItem>
        </Link>
        <Link to={ROUTES.ADMIN_VOLUNTEERS} className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <GroupIcon/>
            </ListItemIcon>
            <ListItemText primary={"Volunteer Groups"}/>
          </ListItem>
        </Link>
        <ListItem button>
          <ListItemIcon>
            <MessageIcon/>
          </ListItemIcon>
          <ListItemText primary={"Messages"}/>
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <SettingsIcon/>
          </ListItemIcon>
          <ListItemText primary={"Settings"}/>
        </ListItem>
      </List>
    </Drawer>

  </div>
  );
};


export default Sidebar;
