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

import AdminPage from '../Admin';

import Box from '@material-ui/core/Box';

import * as ROUTES from '../../constants/routes';

import './index.css';
import logo from '../../assets/images/cftk-logo-white.png';

import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles"
import DashboardIcon from '@material-ui/icons/Dashboard';
import RoomIcon from '@material-ui/icons/Room';
import GroupIcon from '@material-ui/icons/Group';
import MessageIcon from '@material-ui/icons/Message';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    width: 'inherit',
    background: 'linear-gradient(180deg, #7CC9AA 0%, #0075A3 100%)',
  },
  link: { 
    textDecoration: 'none', 
    color: 'white',
    '&:hover': {
      color: 'white'
    },

  }
}));

const Sidebar = () => {
  const classes = useStyles();

  return (
    <div id="sidebar">

      <div id="sidebar-menu">
        <div id="sidebar-adaptation">
          <Switch>
          </Switch>
        </div>
      </div>

      <div id="sidebar-panel">
        <Switch>
          <Route exact path={ROUTES.ADMIN_DASHBOARD} component={DashboardPanel} />
          <Route exact path={ROUTES.ADMIN_ROUTES} component={RoutesPanel} />
          <Route exact path={ROUTES.ADMIN_VOLUNTEERS} component={VolunteersPanel} />
          <Route exact path={ROUTES.ADMIN_ROUTES_NEW} component={NewRoutePanel} />
          <Route exact path={ROUTES.ADMIN_ROUTES_DEL} component={DeleteDialogs} />
          <Route exact path={ROUTES.ADMIN_ROUTES_EDIT} component={EditRoutePanel} />
          <Route path={ROUTES.ASSIGN_ROUTE} component={AssignRoute} />
          <Route path={ROUTES.ADMIN} component={AdminPage} />
        </Switch>
      </div>

      <Drawer
        style={{ width: '200px' }}
        variant="persistent"
        anchor="left"
        open={true}
        classes={{ paper: classes.drawerPaper }}
      >
        <div className="logo-box">
          <img src={logo}></img>
        </div>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={1}
          m={1}
          className="container"
        >
          <List>
            <Link to={ROUTES.ADMIN_DASHBOARD} className={classes.link}>
              <ListItem button>
                <ListItemIcon>
                  <DashboardIcon className={classes.link} />
                </ListItemIcon>
                <ListItemText primary={"Dashboard"} />
              </ListItem>
            </Link>
            <Link to={ROUTES.ADMIN_ROUTES} className={classes.link}>
              <ListItem button>
                <ListItemIcon>
                  <RoomIcon className={classes.link} />
                </ListItemIcon>
                <ListItemText primary={"Routes"} />
              </ListItem>
            </Link>
            <Link to={ROUTES.ADMIN_VOLUNTEERS} className={classes.link}>
              <ListItem button>
                <ListItemIcon>
                  <GroupIcon className={classes.link} />
                </ListItemIcon>
                <ListItemText primary={"Volunteer Groups"} />
              </ListItem>
            </Link>
            <ListItem button className={classes.link}>
              <ListItemIcon>
                <MessageIcon className={classes.link} />
              </ListItemIcon>
              <ListItemText primary={"Messages"} />
            </ListItem>
            <ListItem button className={classes.link}>
              <ListItemIcon>
                <SettingsIcon className={classes.link} />
              </ListItemIcon>
              <ListItemText primary={"Settings"} />
            </ListItem>
            {/* <Link to={ROUTES.LANDING} className={classes.link}>
              <ListItem button>
                  <ListItemText primary={"Landing"}></ListItemText>
              </ListItem>
            </Link>
            <Link to={ROUTES.SIGN_IN} className={classes.link}>
              <ListItem button>
                  <ListItemText primary={"Sign In"}></ListItemText>
              </ListItem>
            </Link>
            <Link to={ROUTES.HOME} className={classes.link}>
              <ListItem button>
                  <ListItemText primary={"Home"}></ListItemText>
              </ListItem>
            </Link>
            <Link to={ROUTES.ACCOUNT} className={classes.link}>
              <ListItem button>
                  <ListItemText primary={"Account"}></ListItemText>
              </ListItem>
            </Link>
            <Link to={ROUTES.ADMIN} className={classes.link}>
              <ListItem button>
                  <ListItemText primary={"Admin Page"}></ListItemText>
              </ListItem>
            </Link> */}
          </List>
        </Box>
        <div className="logout-container">
          <ListItem button className={classes.link}>
            <ListItemIcon>
              <ExitToAppIcon className={classes.link} />
            </ListItemIcon>
            <ListItemText primary={"Logout"} />
          </ListItem>
        </div>
      </Drawer>

    </div>
  );
};


export default Sidebar;
