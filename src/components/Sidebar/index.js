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

import EditRoute from '../EditRoute';

import * as ROUTES from '../../constants/routes';

import './index.css';

const Sidebar = () => (
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

      <ul>
        <li><Link to={ROUTES.ADMIN_DASHBOARD}>Dashboard</Link></li>
        <li><Link to={ROUTES.ADMIN_ROUTES}>Routes</Link></li>
        <li><Link to={ROUTES.ADMIN_VOLUNTEERS}>Volunteers</Link></li>
      </ul>

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
        <Route path={ROUTES.EDIT_ROUTE} component={EditRoute} />
      </Switch>
    </div>

  </div>
);


export default Sidebar;
