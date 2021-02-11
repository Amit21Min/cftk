import { Button, Grid, TextField, withStyles } from "@material-ui/core";
import React from "react";

import "../ForgotPassword/index.css";

const App = () => {
  const ResetButton = withStyles({
    root: {
      background: "#0075A3",
      color: "white",
      borderRadius: "19px",
      fontSize: "14px",
      lineHeight: "19px",
      fontWeight: "500",
      width: "247px",
      height: "36px",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.14)",
      "&:hover": {
        background: "#0075A3",
        color: "white",
      },
    },
  })(Button);

  return (
    <div className="main">
      <div className="forgot-password-container">
        <h1 className="forgot-password-title">Forgot Password</h1>
        <p className="forgot-password-paragraph">
          Provide the email address you used to register, and we’ll send you a
          password reset link alone with the username on file.
        </p>
        <br></br>
        <br></br>
        <br></br>
        <div className="form-wrapper">
          <form className="forgot-form">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="filled"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="lastName"
                  variant="filled"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="filled"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  autoFocus
                />
              </Grid>
            </Grid>
            <br></br><br></br><br></br>
            <ResetButton>Send Password and Reset</ResetButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
