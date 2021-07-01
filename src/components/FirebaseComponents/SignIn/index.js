import { Button, FilledInput, FormControl, TextField, withStyles } from "@material-ui/core";
import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import db, { auth, googleSignIn } from "../Firebase/firebase.js";
import "../SignIn/index.css";
import { useHistory } from "react-router-dom";

const uiConfig = {
  // Popup signin box rather than redirect
  signInFlow: "popup",
  SignInSuccessUrl: "/Home",
  signInOptions: [googleSignIn],
};

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SignInButton = withStyles({
  root: {
    background: '#0075A3',
    color: 'white',
    borderRadius: '19px',
    fontSize: '14px',
    lineHeight: '19px',
    fontWeight: '300',
    width: '88px',
    height: '36px',
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.14)",
    '&:hover': {
      background: '#0075A3',
      color: 'white',
    }
  }
})(Button);


const App = (props) => {
  const [values, setValues] = React.useState({
    username: "",
    password: "",
    showPassword: false,
  });

  const history = useHistory();

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const[snackBar, setSnackBar] = React.useState({
    open: false,
    message: ""
  });
  
  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
  
    setSnackBar({open: false});
  };

  const signIn = () => {
    // Validation -------------------------------------------------
    if(values.username === '' || values.password === '') {
      setSnackBar({open: true, message: "Fill in values!"})
      return;
    }

    const email_test = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(!email_test.test(values.username.toLowerCase())) {
      setSnackBar({open: true, message: "Email not valid"});
      return;
    }
    // End of Validation ------------------------------------------

    auth.signInWithEmailAndPassword(values.username, values.password).then(cred => {
      db.collection('User').doc(cred.user.uid).get().then(user => {
        if(user.exists) {
          let userData = user.data()
          if(userData.role === 'admin') {
            history.push('/admin/dashboard')
          } else if(userData.role === 'volunteer') {
            history.push('/volunteer/progress')
          }
        }
      })
    }, (error)=> {
      setSnackBar({open: true, message: error.message})
    })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="main">
      <div className="signin-container">
        <h1 className="title-text">Hello!</h1>
        <p className="subtext">Sign in to your account</p>
        <br></br>
        <form className="form">
          <TextField
            id="filled-basic"
            label="Email Address"
            variant="filled"
            margin="normal"
            required
            onChange={handleChange('username')}
          />
          <FormControl variant="filled" required>
            <InputLabel htmlFor="standard-adornment-password">
              Password
            </InputLabel>
            <FilledInput
              id="standard-adornment-password"
              type={values.showPassword ? "text" : "password"}
              value={values.password}
              onChange={handleChange("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <p className="forgot-password"><a href="/forgot-password">Forgot Password</a></p> 
        </form>
        <br></br>
        <SignInButton onClick={() => signIn()}>Sign-In</SignInButton>
        <p className="signup-text"><a href="/signup">I'm New. Sign Me Up!</a></p>
        {/* Below is the google (gmail) sign in option - uncomment and enable gmail signin in firebase console to enable google signin */}
        {/* <div className="LoginBoxContainer">
          <div className="LoginBox">
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
          </div>
        </div> */}
        <Snackbar open={snackBar.open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
              {snackBar.message}
            </Alert>
          </Snackbar>
      </div>
    </div>
  );
};

export default App;
