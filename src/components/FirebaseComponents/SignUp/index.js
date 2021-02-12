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
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';


import { auth, db } from "../Firebase/firebase";

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
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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

  const[snackBar, setSnackBar] = React.useState({
    open: false,
    message: ""
  })

  const handleChange = (prop) => (event) => {
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

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackBar({open: false});
  };

  const signUp = () => {

    // Validation -----------------------------------------------
    if(values.email == '' || values.firstName == '' || values.lastName == '') {
      setSnackBar({open: true, message: "Fill in the values"});
      return;
    }

    const email_test = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(!email_test.test(values.email.toLowerCase())) {
      setSnackBar({open: true, message: "Email not valid"});
      return;
    }
    
    if(values.password != values.confirmedPassword) {
      setSnackBar({open: true, message: 'Passwords do not match'});
      return;
    } 
    
    if(values.password.length <= 7) {
      setSnackBar({open: true, message: "Password length too short"});
      return;
    }

    // End of Validation ----------------------------------------------

      auth.createUserWithEmailAndPassword(values.email, values.password).then(cred => {
        return db.collection('User').doc(cred.user.uid).set({
          firstName: values.firstName,
          lastName: values.lastName, 
          email: values.email,
          phone: null,
          completedRoutes: [],
          assignment: null,
          sms: false,
          emailNotifications: false
        })
      })
  }

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
                  onChange={handleChange('firstName')}
                  value={values.firstName}
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
                  onChange={handleChange('lastName')}
                  value={values.lastName}
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
                  onChange={handleChange('email')}
                  value={values.email}
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
                    onChange={handleChange(
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
          <SignUpButton onClick={() => signUp()} >Sign-Up</SignUpButton>
          <Snackbar open={snackBar.open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
              {snackBar.message}
            </Alert>
          </Snackbar>
        </div>
      </div>
    </div>
  );
};

export default App;
