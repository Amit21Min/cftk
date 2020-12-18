import React from 'react';
import { Link } from 'react-router-dom';
import { signOut } from '../Firebase/firebase.js'
 
import * as ROUTES from '../../constants/routes';
import Sidebar from '../Sidebar/index.js';
 
const Navigation = () => (
  <div>
    <ul>
      <li>
        <Link to={ROUTES.SIGN_IN}>Sign In</Link>
      </li>
      <li>
        <Link to={ROUTES.LANDING}>Landing</Link>
      </li>
      <li>
        <Link to={ROUTES.HOME}>Home</Link>
      </li>
      <li>
        <Link to={ROUTES.ACCOUNT}>Account</Link>
      </li>
      <li>
        <Link to={ROUTES.ADMIN}>Admin</Link>
      </li>
      <li>
        <Link to={ROUTES.SIGN_IN}>
          <span onClick={signOut}>Sign Out</span>
        </Link>
      </li>
      <Sidebar />
    </ul>
  </div>
);
 
export default Navigation;