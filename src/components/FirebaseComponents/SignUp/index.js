import React from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { Button, FilledInput, FormControl, FormHelperText } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "auto",
  },
  form: {
    maxWidth: '544px',
    marginTop: theme.spacing(3),
  },
  container: {
    textAlign: "center",
  },
}));

const App = () => {
  const classes = useStyles();

  const [values, setValues] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmedPassword: "",
    showPassword: false,
    showConfirmedPassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleConfirmedPasswordChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleClickShowConfirmedPassword = () => {
    setValues({...values, showConfirmedPassword: !values.showConfirmedPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseDownConfirmedPassword = (event) => {
    event.preventDefault();
  };

  const SignUpButton = withStyles({
    root: {
      background: '#0075A3',
      color: 'white',
      borderRadius: '19px',
      fontSize: '14px',
      lineHeight: '19px',
      fontWeight: '300',
      width: '172px',
      height: '36px',
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.14)",
      '&:hover': {
        background: '#0075A3',
        color: 'white',
      }
    }
  })(Button);

  return (
    <div className="main">
      <div className="signup-container">
        <h1 className="title-text">Welcome!</h1>
        <p className="subtext">Glad you could join us</p>
        <br></br>
        <br></br>
        <div className={classes.paper}>
          <form className={classes.form} noValidate>
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
                  helperText="Others will be able to see this"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="filled"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                  helperText="Others will be able to see this"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="filled"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  helperText="Others will not be able to see this"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  variant="filled"
                  required
                  fullWidth
                >
                  <InputLabel htmlFor="standard-adornment-password">
                    Password
                  </InputLabel>
                  <FilledInput
                    id="standard-adornment-password"
                    type={values.showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange("password")}
                    inputProps={{
                      'aria-label': 'weight',
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {values.showPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText id="component-helper-text">Use atleast 8 characters</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="filled" required fullWidth>
                  <InputLabel htmlFor="standard-adornment-password">
                    Confirmed Password
                  </InputLabel>
                  <FilledInput
                    id="standard-adornment-password"
                    type={values.showConfirmedPassword ? "text" : "password"}
                    value={values.confirmedPassword}
                    onChange={handleConfirmedPasswordChange(
                      "confirmedPassword"
                    )}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmedPassword}
                          onMouseDown={handleMouseDownConfirmedPassword}
                        >
                          {values.showConfirmedPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
            </Grid>
          </form>
          <br></br><br></br>
          <SignUpButton>Sign-Up</SignUpButton>
        </div>
      </div>
    </div>
  );
};

export default App;
