import React from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';

const App = () => (
  // This to needs to removed, and we need to either create a Home Page or not have one
  <div className="container">
    <h1>
      Home Page - This will be our "landing" page for development. Volunteers and 
      Admins should be automatically redirected to /volunteers or /admin/routes after signing in
    </h1>
    <li>
    <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    </li>
    <li>
      <Link to={ROUTES.ACCOUNT}>Account</Link>
    </li>
    <li>
        <Link to={ROUTES.ADMIN_ROUTES}>Admin/Routes</Link>
    </li>
    <li>
      <Link to={ROUTES.ADMIN}>Admin</Link>
    </li>
    <li>
      <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </li>
    <li>
      <Link to={ROUTES.VOLUNTEER_PROGRESS}>Volunteer</Link>
    </li>
  </div>
);
 
export default App;