import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import 'bulma/css/bulma.css';
import LandingPage from '../Landing';
import SignInPage from '../SignIn';
import SignUpPage from '../SignUp'
import HomePage from '../Home';
import AccountPage from '../Account';
// import AdminPage from '../Admin';
import ViewHousePropertiesPage from '../ViewHouseProperties'
import * as ROUTES from '../../constants/routes';
import AdminLayout from '../../layouts/adminLayout';
import ForgotPasswordPage from '../ForgotPassword';

const App = () => (
  <Router>

      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route path={ROUTES.HOME} component={HomePage} />
      <Route path={ROUTES.ACCOUNT} component={AccountPage} />
      {/* <Route path={ROUTES.ADMIN} component={AdminPage} /> */}
      <Route path={ROUTES.VIEW_HOUSE_PROPS} component={ViewHousePropertiesPage} />
      <Route path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route path={ROUTES.ADMIN_DASHBOARD} component={AdminLayout} />
      <Route path={ROUTES.ADMIN_ROUTES} component={AdminLayout} />
      <Route path={ROUTES.ADMIN_VOLUNTEERS} component={AdminLayout} />
      <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route path={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordPage} />

  </Router>


);

export default App;
