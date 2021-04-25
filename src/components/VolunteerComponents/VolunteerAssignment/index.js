import React, { useState, useEffect, Component, Fragment} from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../../constants/routes';
import { Typography, LinearProgress, Grid, Box, CircularProgress} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgressBar from '../CircularProgressBar';
import VolunteerNavBar from '../VolunteerNavBar';
import "../VolunteerAssignment/index.css";
import { db, auth } from '../../FirebaseComponents/Firebase/firebase';
import firebase from 'firebase';

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
  const [totalHouses, setTotalHouses] = useState(0);
  const [streets, setStreets] = useState();
  const [teamRank, setTeamRank] = useState();
  const [totalTeams, setTotalTeams] = useState();
  const [donationTotal, setDonationTotal] = useState();
  const [pctInterest, setPctInterest] = useState();
  const [isAssigned, setIsAssigned] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async function(user) {
      let donationTotal;
      if (user) {
        console.log('user is signed in as ', auth.currentUser.uid);
        const userRef = db.collection('User').doc(auth.currentUser.uid);
        // const userRef = db.collection('User').doc("HSb6gOQ9zFSu242i4uCgifiE1Tq1");
        const userDoc = await userRef.get();
        if (userDoc.exists) {
          const assignment = userDoc.data().assignment;
          if (assignment) {
            const routesActiveRef = db.collection('RoutesActive').doc(assignment);
            const routesActiveDoc = await routesActiveRef.get();
            if (routesActiveDoc.exists) {
              setIsAssigned(true); 
              var streetArray = Object.keys(routesActiveDoc.data().streets).map((key) => {
                return(
                  {[key]: routesActiveDoc.data().streets[key]}
                )
              });
              let totalDonated = routesActiveDoc.data().donationTotal;
              db.collection('RoutesActive').get().then((snapshot) => {
                let localTeamRank = 1;
                let localTotalTeams = 0;
                snapshot.forEach((doc) => {
                  if (doc.data().donationTotal > totalDonated) {
                    localTeamRank += 1;
                  }
                  localTotalTeams += 1;
                });            
                setTeamRank(localTeamRank);
                setTotalTeams(localTotalTeams);
              });
              setStreets(streetArray);
              setDonationTotal(totalDonated);
              setHousesCompleted(routesActiveDoc.data().housesCompleted);
              setPctInterest(routesActiveDoc.data().pctInterest);
              setTotalHouses(routesActiveDoc.data().housesTotal);
                
            }
          } else {
            setIsAssigned(false);
          } 

        } else {
          console.log("couldn't find user data")
        }
      } else {
        console.log('user is not signed in');
      }
    });
  }, [])
  
  if (isAssigned) {
    return (
      <div className='volunteer-assignment-main'>
        <div className='volunteer-assignment-content'>
  
        
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12} justify="center"> 
              <Typography align="center" style = {{ fontSize: 32, fontWeight: "bold"}}>Performance</Typography>
            </Grid>  
            <Grid item xs={12} align="center">
                <CircularProgressBar housesCompleted={housesCompleted} totalHouses={totalHouses}/>
            </Grid>
  
            {streets &&
              streets.map((street) => {
                let totalHouses;
                let housesCompleted = 0;
                let streetName = Object.keys(street)[0];
                for (let key in street) {
                  totalHouses = street[key].length;
                  for (let houses in street[key]) {
                    for (let houseKey in street[key][houses]) {
                      if (street[key][houses][houseKey].donationAmt !== null) {
                        housesCompleted += 1;
                      }
                    }
                  }
                }
                let percentageCompleted = housesCompleted/totalHouses*100;
                return(
                <Fragment key={Object.keys(street)[0]}>
                  <Grid item xs={6} justify="center">
                    <Typography align="center" style = {{ fontSize: 14, fontWeight: "bold"}}>{streetName}</Typography>
                  </Grid>
                  <Grid item xs={6} justify="center">
                    <Typography align="center" style = {{ fontSize: 14}}>{housesCompleted}/{totalHouses} Houses</Typography>
                  </Grid>
                  <Grid item xs={3}></Grid>
                    <Grid item xs={6} justify="center">
                        <LinearProgress 
                        classes={{colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary}} 
                        className = {classes.bar} 
                        variant="determinate" 
                        value={percentageCompleted} />
                    </Grid>
                  <Grid item xs={3}></Grid>
                </Fragment>
                )
              })
            }
  
            <Grid item xs={3}></Grid>
            <Grid item xs={6} justify="center">
              <Typography align="left" style = {{ fontSize: 24, fontWeight: "bold"}}>Statistics</Typography>
            </Grid>
            <Grid item xs={3}></Grid>
  
            <Grid>
              <Box pt={1}>
                    <Box p={3} className = {classes.borderGrid}>
                        <Typography align="left" style = {{ fontSize: 10}}> <span style={{fontSize:36, fontWeight: "bold", color:"#0075A3" }}>{donationTotal}</span> Dollars raised</Typography>
                    </Box>
              </Box>
              <Box pt={1}>
                    <Box p={3} className = {classes.borderGrid}>
                        <Typography align="left" style = {{ fontSize: 10}}> <span style={{fontSize:36, fontWeight: "bold", color:"#0075A3" }}>{pctInterest}</span> Percentage of residents interested in learning about Carolina for The Kids</Typography>
                    </Box>
              </Box>
              <Box pt={1}>
                    <Box p={3} className = {classes.borderGrid}>
                        <Typography align="left" style = {{ fontSize: 10}}> <span style={{fontSize:36, fontWeight: "bold", color:"#0075A3" }}>{teamRank}</span> Team Rank out of {totalTeams}</Typography>
                    </Box>
              </Box>
            </Grid>
          </Grid>
        </div>
  
        <VolunteerNavBar tab="progress" />
      </div>
    )
  } else {
    return(
      <div>
      <Typography align="center" style = {{ fontSize: 32, fontWeight: "bold"}}>Performance</Typography>
      <p>
        You don't have a route assigned!
      </p>
      <VolunteerNavBar tab="progress" />
      </div>
    )
  }

};
 
export default App;