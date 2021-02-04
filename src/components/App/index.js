import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import 'bulma/css/bulma.css';
import Navigation from '../Navigation';
import SignInPage from '../FirebaseComponents/SignIn';
import AdminPage from '../Admin';
import ViewHousePropertiesPage from '../RoutesComponents/ViewHouseProperties'
 

import Sidebar from '../RoutesComponents/Sidebar';

import * as ROUTES from '../../constants/routes';
import DashboardPanel from '../RoutesComponents/DashboardPanel';

const App = () => (
  <Router>
    <div>
      <Navigation />

      <Route path={ROUTES.SIGN_IN} component={SignInPage} />
      {/* <Route path={ROUTES.ADMIN} component={AdminPage} /> */}
      <Route path={ROUTES.VIEW_HOUSE_PROPS} component={ViewHousePropertiesPage} />
    </div>

    <Sidebar/>

  </Router>


);

export default App;
