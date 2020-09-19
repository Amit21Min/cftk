import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import 'bulma/css/bulma.css';
import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignInPage from '../SignIn';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import EditRoute from '../EditRoute'
import ViewHousePropertiesPage from '../ViewHouseProperties'
 

import Sidebar from '../Sidebar';

import * as ROUTES from '../../constants/routes';

const App = () => (
  <Router>
    <div>
      <Navigation />
      <hr />

      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route path={ROUTES.HOME} component={HomePage} />
      <Route path={ROUTES.ACCOUNT} component={AccountPage} />
      <Route path={ROUTES.ADMIN} component={AdminPage} />
      <Route path={ROUTES.VIEW_HOUSE_PROPS} component={ViewHousePropertiesPage} />
    </div>

    <Sidebar/>

  </Router>


);

export default App;
