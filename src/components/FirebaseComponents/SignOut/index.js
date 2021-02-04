import React from 'react';
 
import { signOut } from '../Firebase/firebase.js'

const App = () => (
  <div>
    <h1>Logged In</h1>
    <button onClick={signOut} Link to={ROUTES.SIGN_IN}>
        Logout
    </button>
  </div>
);

export default App;