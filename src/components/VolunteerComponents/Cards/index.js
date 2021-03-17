import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import {Button} from '@material-ui/core';
import {Fab} from '@material-ui/core';
import BottomNav from '../BottomNav';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';


const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }),
);
    

export default function CenteredGrid() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={4}> 
        <Grid item xs={12}>
        <Typography variant="caption" align = 'left'>102 Misty Pines Pl</Typography>
        </Grid>
        <Grid item xs={12}>
        <Typography variant="subtitle1" align = 'center'>Was solicitation allowed?</Typography>
        </Grid>
        <Grid item xs={6} justify ='right' align = 'right'>
        <Button style={{ "min-height": "130px", width: "130px" }}
        variant="outlined"
  color="black" align = 'center'
>
  No
</Button>
        </Grid>
        <Grid item xs={6} justify ='left' align = 'left'>
        <Button style={{ "min-height": "130px", width: "130px" }}
        variant="outlined"
  color="black" align = 'center'
>
  Yes
</Button>
        </Grid>
        <Grid item xs={12}>
        <Typography variant="h6" align = 'center'></Typography>
        </Grid>
        <Grid item xs={6} justify = 'left' align ='left'>
        <Button className={classes.button}>CLEAR ALL</Button> 
        </Grid>
        <Grid item xs={6} justify = 'right' align ='right'>
        <Fab variant="extended" aria-label="Delete" className={classes.fab}>
        Submit
      </Fab>  
        </Grid>
        <Grid item xs={12}>
        <Typography variant="h6" align = 'center'></Typography>
        </Grid>
        <Grid item xs={12}>
        <Typography variant="h6" align = 'center'></Typography>
        </Grid>
        <Grid item xs={12}>
        <Typography variant="h6" align = 'center'></Typography>
        </Grid>
        <Grid container spacing = {0} direction = 'row' alignItems = 'center' justify ="center">
        <BottomNav/>
        </Grid>
        </Grid>
     
    </div>
  );
}
