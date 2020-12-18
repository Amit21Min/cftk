import { Button, FilledInput, FormControl, TextField, withStyles } from "@material-ui/core";
import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import { auth, googleSignIn } from "../Firebase/firebase.js";

import "../SignIn/index.css";

const uiConfig = {
  // Popup signin box rather than redirect
  signInFlow: "popup",
  SignInSuccessUrl: "/Home",
  signInOptions: [googleSignIn],
};

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


const App = () => {
  const [values, setValues] = React.useState({
    username: "",
    password: "",
    showPassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="main">
      <div className="signin-container">
        <h1>Hello!</h1>
        <p className="subtext">Sign in to your account</p>
        <br></br>
        <form className="form">
          <TextField
            id="filled-basic"
            label="Email Address"
            variant="filled"
            margin="normal"
            required
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
          <a><p className="forgot-password">Forgot Password</p></a> 
        </form>
        <br></br>
        <SignInButton>Sign-In</SignInButton>
        <a><p className="signup-text">I'm New. Sign Me Up!</p></a>
        <div className="LoginBoxContainer">
          <div className="LoginBox">
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
