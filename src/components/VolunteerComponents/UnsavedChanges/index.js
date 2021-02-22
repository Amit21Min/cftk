import React from "react";
import ReactDOM from "react-dom";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';


import {Grid, Button} from '@material-ui/core';






const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'center',
    maxWidth: 350,
  },
  image: {
    width: 128,
    height: 128,
  },
  typography: {
    fontFamily: ['"Montserrat"', 'Open Sans'].join(',')
  
 },
 
}));

 

export default function ComplexGrid() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>

          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography variant="h5" align = 'left'>
                  Unsaved Changes
                  </Typography>
                  </Grid>
                  <Grid>
                <Typography variant="body" color="textSecondary" align = "center">
                  You've made changes to data for multiple houses. Are you sure you want to abandon your changes?
                </Typography>
              </Grid>
              <Grid item>
              
              </Grid>
            </Grid>
           
          </Grid>
          <Grid item xs={12} justify="right" align="right">
                  <Button color="primary">NO</Button>
                  <Button color="primary">YES</Button>
                </Grid>
        
        </Grid>
      </Paper>
    </div>
  );
}
 