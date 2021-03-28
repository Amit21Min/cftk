import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import 'bulma/css/bulma.css';
import SignInPage from '../FirebaseComponents/SignIn';
import AdminPage from '../Admin';
import ViewHousePropertiesPage from '../RoutesComponents/ViewHouseProperties'
import AdminLayout from '../../layouts/adminLayout';
import VolunteerLayout from '../../layouts/volunteerLayout';
import SignUpPage from '../FirebaseComponents/SignUp/index.js';
import ForgotPasswordPage from '../ForgotPassword/index.js';
import HomePage from '../Home/index';
import Volunteer from '../VolunteerComponents/Volunteer/index.js';
import VolunteerAssignment from '../VolunteerComponents/VolunteerAssignment/index.js';
import VolunteerSettings from '../VolunteerComponents/VolunteerSettings/index.js';

import * as ROUTES from '../../constants/routes';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0075A3',
    },
    secondary: {
      main: '#7CC9AA'
    }
  },
});

const App = () => (
  <ThemeProvider theme={theme}>
    <Router>
      <Switch>        
        {/* ---------------------------------------------------------------------- */}

        {/* These two pages below were removed, but keeping them here just in case we get them back */}

        {/* <Route exact path={ROUTES.LANDING} component={LandingPage} /> */}
        {/* <Route path={ROUTES.ACCOUNT} component={AccountPage} /> */}

        {/* --------------------------------------------------------------------- */}


        {/* The HOME Page is the root now, so please navigate to /home for finding the main stuff */}
        <Route exact path="/">
          <Redirect to="/signin" />
        </Route>
        <Route path={ROUTES.HOME} component={HomePage} /> 
        {/* This Admin Route should be eventually removed, but for now refer to /admin for ViewHouse and Other Admin stuff */}
        <Route path={ROUTES.ADMIN} component={AdminLayout} />
        <Route path={ROUTES.VIEW_HOUSE_PROPS} component={ViewHousePropertiesPage} />
        <Route path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route path={ROUTES.VOLUNTEER} component={VolunteerLayout} />
        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
        {/* <Route path={ROUTES.ADMIN_DASHBOARD} component={AdminLayout} />
        <Route path={ROUTES.ADMIN_ROUTES} component={AdminLayout} />
        <Route path={ROUTES.ADMIN_VOLUNTEERS} component={AdminLayout} />
        <Route path={ROUTES.VOLUNTEER_ASSIGNMENT} component={VolunteerAssignment} />
        <Route exact path={ROUTES.VOLUNTEER} component={Volunteer} />
        <Route path={ROUTES.VOLUNTEER_SETTINGS} component={VolunteerSettings} />
        <Route path={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordPage} /> */}
        
      </Switch>

    </Router>
  </ThemeProvider>
);

export default App;
