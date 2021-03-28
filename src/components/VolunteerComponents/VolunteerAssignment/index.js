import React, { useState, setState } from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../../constants/routes';
import { Typography, LinearProgress, Grid, Box, CircularProgress} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgressBar from '../CircularProgressBar';
import VolunteerNavBar from '../VolunteerNavBar';
import "../VolunteerAssignment/index.css";
import { db, auth } from '../../FirebaseComponents/Firebase/firebase';

const useStyles = makeStyles ({
  borderGrid:{
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 20,
    width: 325,
  },
  bar: {
    borderRadius: 16,
    backgroundColor: '#D7DBDD',
    borderWidth: 2,
  },
  colorPrimary: {
    backgroundColor: '#D7DBDD',
  },
  barColorPrimary: {
    backgroundColor: '#43A047',
  }
});

const App = () => {
  const [housesCompleted, setHousesCompleted] = useState(0);
  const classes = useStyles();
  console.log(housesCompleted);


  var user = auth.currentUser;
  console.log(user);

  const getHouses = async () => {
    // need to use firebase auth to fetch the currently logged in user

    const userRef = db.collection('User').doc('3ytt1skUvlhMWmuGS8hsqGgpRbI2');
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      // do something with the data
      console.log(userDoc.data());
      const assignment = userDoc.data().assignment;
      console.log(assignment);

      const routesActiveRef = db.collection('RoutesActive').doc(assignment);
      const routesActiveDoc = await routesActiveRef.get();
      if (routesActiveDoc.exists) {
        console.log(routesActiveDoc.data());
        setHousesCompleted(routesActiveDoc.data().housesCompleted);
        console.log(housesCompleted)
      }
    }

  }

  getHouses();
  
  return (
    <div className='volunteer-assignment-main'>
      <div className='volunteer-assignment-content'>

      
        <Grid container justify="center" spacing={3}>
          <Grid item xs={12} justify="center"> 
            <Typography align="center" style = {{ fontSize: 32, fontWeight: "bold"}}>Performance</Typography>
          </Grid>  
          <Grid item xs={12} align="center">
              <CircularProgressBar numHouses={housesCompleted} totalHouses="100"/>
          </Grid>

          <Grid item xs={6} justify="center">
            <Typography align="center" style = {{ fontSize: 14, fontWeight: "bold"}}>Manor Ridge Road</Typography>
          </Grid>
          <Grid item xs={6} justify="center">
            <Typography align="center" style = {{ fontSize: 14}}>0/15 Houses</Typography>
          </Grid>
          <Grid item xs={3}></Grid>
            <Grid item xs={6} justify="center">
                <LinearProgress 
                classes={{colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary}} 
                className = {classes.bar} 
                variant="determinate" 
                value={50} />
            </Grid>
          <Grid item xs={3}></Grid>

          <Grid item xs={6} justify="center">
            <Typography align="center" style = {{ fontSize: 14, fontWeight: "bold"}}>Misty Pines Pl</Typography>
          </Grid>
          <Grid item xs={6} justify="center">
            <Typography align="center" style = {{ fontSize: 14}}>0/8 Houses</Typography>
          </Grid>
          <Grid item xs={3}></Grid>
          <Grid item xs={6} justify="center">
              <LinearProgress 
              classes={{colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary}} 
              className = {classes.bar} 
              variant="determinate" 
              value={20} />
          </Grid>
          <Grid item xs={3}></Grid>

          <Grid item xs={6} justify="center">
            <Typography align="center" style = {{ fontSize: 14, fontWeight: "bold"}}>Morgan Hill Ct</Typography>
          </Grid>
          <Grid item xs={6} justify="center">
            <Typography align="center" style = {{ fontSize: 14}}>0/23 Houses</Typography>
          </Grid>  
          <Grid item xs={3}></Grid>
          <Grid item xs={6} justify="center">
              <LinearProgress  
              classes={{colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary}} 
              className = {classes.bar} 
              variant="determinate" 
              value={75} />
          </Grid>
          <Grid item xs={3}></Grid>

          <Grid item xs={3}></Grid>
          <Grid item xs={6} justify="center">
            <Typography align="left" style = {{ fontSize: 24, fontWeight: "bold"}}>Statistics</Typography>
          </Grid>
          <Grid item xs={3}></Grid>

          <Grid>
            <Box pt={1}>
                  <Box p={3} className = {classes.borderGrid}>
                      <Typography align="left" style = {{ fontSize: 10}}> <span style={{fontSize:36, fontWeight: "bold", color:"#0075A3" }}>138</span> Dollars raised</Typography>
                  </Box>
            </Box>
            <Box pt={1}>
                  <Box p={3} className = {classes.borderGrid}>
                      <Typography align="left" style = {{ fontSize: 10}}> <span style={{fontSize:36, fontWeight: "bold", color:"#0075A3" }}>52</span> Percentage of residents interested in learning about Carolina for The Kids</Typography>
                  </Box>
            </Box>
            <Box pt={1}>
                  <Box p={3} className = {classes.borderGrid}>
                      <Typography align="left" style = {{ fontSize: 10}}> <span style={{fontSize:36, fontWeight: "bold", color:"#0075A3" }}>n/a</span> Team Rank out of 15</Typography>
                  </Box>
            </Box>
          </Grid>
        </Grid>
      </div>

      <VolunteerNavBar tab="progress" />
    </div>
  )
};
 
export default App;