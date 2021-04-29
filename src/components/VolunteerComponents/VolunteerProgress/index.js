import React, { useState, useEffect, Fragment } from 'react';
import { Typography, LinearProgress, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { sizing } from '@material-ui/system';
import CircularProgressBar from '../CircularProgressBar';
import VolunteerNavBar from '../VolunteerNavBar';
import "./index.css";
import { db, auth } from '../../FirebaseComponents/Firebase/firebase';
import firebase from 'firebase';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as overflow_actions from '../../RoutesComponents/ReusableComponents/RoutesPanel/overflow_actions.js';

const useStyles = makeStyles(theme => ({
  borderGrid: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 20,
    width: 325,
    display: 'flex',
    alignItems: 'center'
  },
  cardText: {
    fontSize: '14px',
    width: 'calc(100% - 75px)',
    marginLeft: 'auto'
  },
  cardMain: {
    fontSize: 36, 
    fontWeight: "bold", 
    color: "#0075A3",
    paddingLeft: '8px'
  },
  bar: {
    borderRadius: 16,
    backgroundColor: theme.palette.progressPrimary.main,
    borderWidth: 2,
  },
  barRoot: {
    height: 12,
    borderRadius: 16,
  },
  colorPrimary: {
    backgroundColor: theme.palette.progressSecondary.main,
  },
  main: {
    height: '100vh',
    width: '100vw',
    position: 'relative'
  },
  content: {
    height: 'calc(100vh - 72px)',
    width: '100vw',
    overflowY: 'auto'
  },
  progressBars: {
    margin: '1rem'
  },
  progressLabel: {
    display: 'flex',
    flexDirection: 'row',
    margin: '1rem 0 1rem 0'
  },
  statistics: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}));

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
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseFinish = async () => {
    const userRef = db.collection('User').doc(auth.currentUser.uid);
    const userDoc = await userRef.get();
    const assignment = userDoc.data().assignment.split("_")[0];
    overflow_actions.unassignRouteAction(assignment);
    console.log('done');
    setOpen(false);
    setIsAssigned(false);
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async function (user) {
      if (user) {
        console.log('user is signed in', auth.currentUser.uid);
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
                return (
                  { [key]: routesActiveDoc.data().streets[key] }
                )
              });
              let totalDonated = routesActiveDoc.data().donationTotal;
              db.collection('RoutesActive').get().then((snapshot) => {
                // This can be done at the top. If you're scanning the entire collection, then just get the doc from the collection of docs instead of wasting a query for it directly
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
      <div className={classes.main}>
        <div className={classes.content}>
          <Typography style={{ fontSize: 24, fontWeight: "bold", padding: '1rem' }}>Performance</Typography>
          <CircularProgressBar housesCompleted={housesCompleted} totalHouses={totalHouses} />
          <div className={classes.progressBars}>
            {streets?.map((street) => {
              let streetHousesCompleted = 0;
              let streetName = Object.keys(street)[0];
              let streetTotalHouses = street[streetName].length;
              for (let houses = 0; houses < street[streetName].length; houses++) {
                let houseData = street[streetName][houses][Object.keys(street[streetName][houses])[0]];
                if (houseData.donationAmt !== null) streetHousesCompleted += 1;
              }
              let percentageCompleted = streetHousesCompleted / streetTotalHouses * 100;
              return (
                <Fragment key={streetName}>
                  <div className={classes.progressLabel}>
                    <Typography align="center" style={{ fontSize: 14, fontWeight: "bold" }}>{streetName}</Typography>
                    <Typography align="center" style={{ fontSize: 14, marginLeft: 'auto' }}>{streetHousesCompleted}/{streetTotalHouses} Houses</Typography>
                  </div>
                  <LinearProgress
                    classes={{ root: classes.barRoot, colorPrimary: classes.colorPrimary, bar: classes.bar }}
                    className={classes.bar}
                    variant="determinate"
                    value={percentageCompleted} />
                </Fragment>
              )
            })
            }
          </div>
          <div className={classes.statistics}>
            <Typography align="left" style={{ fontSize: 24, fontWeight: "bold", width: '100%', padding: '1rem' }}>Statistics</Typography>
            <Box p={1}>
              <Box p={1} className={classes.borderGrid}>
                <Typography align="left" className={classes.cardMain}>{donationTotal}</Typography>
                <p className={classes.cardText}>Dollars raised</p>
              </Box>
            </Box>
            <Box p={1}>
              <Box p={1} className={classes.borderGrid}>
                <Typography align="left" className={classes.cardMain}>{pctInterest}</Typography>
                <p className={classes.cardText}>Percentage of residents interested in learning about Carolina for The Kids</p>
              </Box>
            </Box>
            <Box p={1}>
              <Box p={1} className={classes.borderGrid}>
                <Typography align="left" className={classes.cardMain}>{teamRank}</Typography>
                <p className={classes.cardText}>Team Rank out of {totalTeams}</p>
              </Box>
            </Box>
            <Box p={1}>
              <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Finish Route
              </Button>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{"Are you sure you are finished with this route?"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                     Your collection info will be saved and you will no longer be able to edit any house data.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Go Back
                  </Button>
                  <Button onClick={handleCloseFinish} color="primary" autoFocus>
                    I'm Finished!
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </div>

        </div>
        <VolunteerNavBar tab="progress" />
      </div>
    )
  } else {
    return (
      <div>
        <Typography align="center" style={{ fontSize: 32, fontWeight: "bold" }}>Performance</Typography>
        <p>
          You don't have a route assigned!
      </p>
        <VolunteerNavBar tab="progress" />
      </div>
    )
  }

};

export default App;