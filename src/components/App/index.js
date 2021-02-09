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
import AdminLayout from '../../layouts/adminLayout';
import SignUpPage from '../FirebaseComponents/SignUp/index.js'
import ForgotPasswordPage from '../ForgotPassword/index.js'
import HomePage from '../Home/index'

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
      <div>
        {/* I don't think navigation is required anymore, so maybe removal. But I don't know about Routing much and I might have messed up. Please let me know if you think how I routed stuff up with the sidebar is not correct */}

        {/* <Navigation /> */}
        
        {/* ---------------------------------------------------------------------- */}

        {/* These two pages below were removed, but keeping them here just in case we get them back */}

        {/* <Route exact path={ROUTES.LANDING} component={LandingPage} /> */}
        {/* <Route path={ROUTES.ACCOUNT} component={AccountPage} /> */}

        {/* --------------------------------------------------------------------- */}


        {/* The HOME Page is the root now, so please navigate to /home for finding the main stuff */}
        <Route path={ROUTES.HOME} component={HomePage} /> 
        {/* This Admin Route should be eventually removed, but for now refer to /admin for ViewHouse and Other Admin stuff */}
        <Route path={ROUTES.ADMIN} component={AdminPage} />
        <Route path={ROUTES.VIEW_HOUSE_PROPS} component={ViewHousePropertiesPage} />
        <Route path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route path={ROUTES.ADMIN_DASHBOARD} component={AdminLayout} />
        <Route path={ROUTES.ADMIN_ROUTES} component={AdminLayout} />
        <Route path={ROUTES.ADMIN_VOLUNTEERS} component={AdminLayout} />
        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route path={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordPage} />
      </div>

    </Router>
  </ThemeProvider>
);

export default App;
