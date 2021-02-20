import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

firebase.initializeApp(config);

export const signOut = () => {
  firebase.auth().signOut();
}

export const db = firebase.firestore();

// creating new collections
// if the collection already exists, it will just move on
const routes = db.collection('Routes');
const users = db.collection('User');
/* example of how to use the SignOut function

<button onClick={signOut}>
  Logout
</button>
*/

export default db;
export const auth = firebase.auth();
export const googleSignIn = firebase.auth.GoogleAuthProvider.PROVIDER_ID;