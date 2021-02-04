import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import { auth, googleSignIn} from '../Firebase/firebase.js';

const uiConfig = {
  // Popup signin box rather than redirect
  signInFlow: 'popup',
  SignInSuccessUrl: '/Home',
  signInOptions: [googleSignIn]
};

const App = () => (
  <div className="LoginBoxContainer">
    <div className="LoginBox">
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth}/>
    </div>
  </div>
);
 
export default App;