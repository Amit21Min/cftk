import React from 'react';
import { Link } from 'react-router-dom';
 
import * as ROUTES from '../../constants/routes';

const App = () => (
  <div className="container">
    <h1>Admin</h1>
    <li>
      <Link to={ROUTES.VIEW_HOUSE_PROPS}>View House Properties</Link>
    </li>
    <li>
      <Link to={ROUTES.ADMIN_ROUTES_DEL}>Delete Dialogs</Link>
    </li>
  </div>
);
 
export default App;