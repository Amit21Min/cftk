import React, { useEffect, useState } from 'react';
// import db from '../Firebase/firebase.js';
import { storeRouteData } from '../ReusableComponents/RouteModels/routes';
import { Link } from 'react-router-dom'
import { Typography, Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import GroupedTextField from '../../ReusableComponents/GroupedTextField';
import DualGroupedTextField from '../../ReusableComponents/GroupedTextField/DualGroupedTextField';
import ChipList from '../../ReusableComponents/ChipList';
import PillButton from '../../ReusableComponents/PillButton';
import { useGoogleMaps } from "react-hook-google-maps";

import * as ROUTES from '../../../constants/routes';

import Map from '../Map';

// TODO: Implement revision history and modified by (Feature from figma, but rather weird for creating a route)
// TODO: Deal with google map implementation (the map doesn't update properly after the inital adding of addresses)
// TODO: Figure out chiplist input (currently just using a chiplist underneath the input)
// TODO: Validate Route Name, their shouldn't be a repeated name in Firebase. Needs more Firebase integration
// TODO: Fix vertical overflow with smaller screens. There seems to be extra whitespace somewhere

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    margin: '4rem',
    height: 'calc(100% - 8rem)',
    width: 'calc(100% - 8rem)',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {
      margin: '0px',
      marginLeft: '160px'
    },
  },
  formButton: {
    width: '160px',
    [theme.breakpoints.down('md')]: {
      width: '50%',
    },
  },
  buttonContainer: {
    // width: '100%',
    marginTop: '3rem',
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      marginLeft: 'auto',
    },
  },
  gridContainer: {
    display: 'block',
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr 1fr',
    }
  },
  gridRequired: {
    marginTop: '1rem',
    [theme.breakpoints.up('md')]: {
      gridColumn: '1',
      gridRow: '1',
      margin: '1rem',
      marginLeft: '0px',
    }
  },
  gridOld: {
    marginTop: '1rem',
    [theme.breakpoints.up('md')]: {
      gridColumn: '1',
      gridRow: '2',
      margin: '1rem',
      marginLeft: '0px',
    }
  },
  gridMap: {
    marginTop: '1rem',
    [theme.breakpoints.up('md')]: {
      gridColumn: '2',
      gridRow: '1/3',
      margin: '1rem',
      marginLeft: '0px',
    }
  }
}));

const NewRoutePanel = () => {

  // Final TODOS for now. Rewrite geocoder as recursion for speed optimization
  // Figure out how to load data into Firestore

  // variables used in the state
  const [{ routeName, isValidName }, setRouteName] = useState({
    routeName: "",
    isValidName: true
  });
  const [{ cityName, isValidCity }, setCityName] = useState({
    cityName: "",
    isValidCity: true
  });
  const [currStreet, setCurrStreet] = useState('');
  const [currHouses, setCurrHouses] = useState('');
  const [houseNumbers, setHouseNumbers] = useState({});
  const [canningDate, setCanningDate] = useState('');
  const [numDonated, setNumDonated] = useState('');
  const [currNote, setCurrNote] = useState('');
  const [volNotes, setVolNotes] = useState([]);

  const [validForm, setValidForm] = useState(false);

  const defaultLoc = { lat: 35.9132, lng: -79.0558 }
  const { ref, google } = useGoogleMaps(
    process.env.REACT_APP_MAPS_API_KEY,
    {
      zoom: 18,
      center: defaultLoc
    },
  );

  const validateForm = () => {
    setValidForm(Object.keys(houseNumbers).length > 0 && routeName.length > 0 && cityName.length > 0)
  }

  useEffect(validateForm, [routeName, cityName, Object.keys(houseNumbers)])

  async function geocodeAddresses(addressList, streetName, cityName) {
    return await new Promise((resolve, reject) => {
      let withCoordinates = {};
      if (addressList.length === 0) {
        resolve(withCoordinates)
      };
      const geocoder = new google.maps.Geocoder();
      let counter = 0;
      let geocodingProcess = setInterval(() => {
        if (addressList.length === 0) {
          counter++;
          if (counter > 5) clearInterval(geocodingProcess);
        }
        const addrNumber = addressList.pop();
        if (addrNumber && houseNumbers[streetName] && houseNumbers[streetName][addrNumber]) {
          console.log('already existed', addrNumber);
          withCoordinates[addrNumber] = houseNumbers[streetName][addrNumber];
          if (addressList.length === 0) {
            clearInterval(geocodingProcess);
            resolve(withCoordinates);
          }
        } else if (addrNumber) {
          geocoder.geocode({ address: `${addrNumber} ${streetName} ${cityName}` }, (results, status) => {
            if (status === "OK") {
              withCoordinates[addrNumber] = results[0].geometry.location.toJSON()
              if (addressList.length === 0) {
                clearInterval(geocodingProcess);
                resolve(withCoordinates);
              }
            } else {
              if (status === "OVER_QUERY_LIMIT") {
                counter = 0;
                addressList.push(addrNumber)
                console.log('trying to geocode again')
              } else {
                clearInterval(geocodingProcess);
                reject("Geocode was not successful for the following reason: " + status);
              }
            }
          });
        }
        // For whatever reason, the balance is once ever 500ms. I don't know why, but it just is
      }, 500);
    })
  }

  const updateStreetList = e => {
    // preventDefault() prevents the page from reloading whenever a button is pressed
    e.preventDefault();

    // Turns comma seperated list into array
    let numbers = currHouses.trim().split(",");
    // Removes duplicates
    numbers = numbers.filter((num, index) => numbers.indexOf(num) === index);
    // Changes current street into Title Case
    let parsedStreet = currStreet.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );

    geocodeAddresses([...numbers], parsedStreet, cityName).then(newAddresses => {
      console.log(newAddresses)
      setHouseNumbers(prevState => ({
        ...prevState,
        [parsedStreet]: newAddresses
      }));
    })

    // stores houseNumbers as {street1: [122,123,145], street2: [122,123,124]}


    setCurrStreet('');
    setCurrHouses('');
  }


  const removeStreet = street => {
    // Removes specified street
    let streetName = street.replace(
      // Simplifies Street to Title Case
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );

    setHouseNumbers(prevState => {
      delete prevState[streetName];
      return prevState;
    });
  }

  const updateNoteList = e => {
    // Adds note to list as long as the note is not already included or the input is not empty
    // preventDefault() prevents the page from reloading whenever a button is pressed
    e.preventDefault()
    if (volNotes.includes(currNote)) {
      alert("Please don't repeat a existing note");
      return;
    } else if (currNote === '') {
      alert("Please enter some text");
      return;
    }

    setVolNotes(prevState => [...prevState, currNote]);
    setCurrNote('');
  }

  const removeNote = note => {
    // Removes the specified volunteer note
    setVolNotes(prevState => prevState.filter(text => text !== note))
  }

  const handleDateFocus = e => {
    // When clicking on input, switches input type to date. Allows for placeholder text
    e.currentTarget.type = 'date';
  }

  const handleDateBlur = e => {
    // Changes input back to text if it is empty so placeholder text can still be shown
    if (canningDate === '' || canningDate === 'mm/dd/yy') e.currentTarget.type = 'text';
  }

  const handleRoute = (e) => {
    setRouteName({
      routeName: e.target.value,
      isValidName: e.target.value.length > 0
    });
  }

  const handleCity = (e) => {
    setCityName({
      cityName: e.target.value,
      isValidCity: e.target.value.length > 0
    });
  }

  const handleStreet = (e) => {
    // setCurrStreet(e.target.value.replace(/[^A-Za-z]/g, ''))
    setCurrStreet(e.target.value)
  }

  const handleAddress = (e) => {
    setCurrHouses(e.target.value.replace(/[^0-9,]/g, ''))
  }

  const handleDonated = (e) => {
    setNumDonated(e.target.value.replace(/[^0-9]/g, ''))
  }

  const handleDates = (e) => {
    setCanningDate(e.target.value)
  }

  const handleNotes = (e) => {
    setCurrNote(e.target.value)
  }

  const openStreet = (street) => {
    const streetAddresses = houseNumbers[street];
    const asString = streetAddresses ? Object.keys(streetAddresses).join(",") : "";
    setCurrStreet(street);
    setCurrHouses(asString);
  }

  const saveForm = _ => {
    // Executes when save button is clicked.
    // Alerts and doesn't save if required inputs are not filled (Placeholder)
    if (routeName === '') {
      alert('Please enter a route name');
      return;
    } else if (Object.keys(houseNumbers).length === 0) {
      alert('Please enter/add a street name');
      return;
    }
    storeRouteData(routeName, houseNumbers, volNotes, cityName);
  }

  const classes = useStyles();

  return (
    <div className={classes.pageContainer}>
      <div><Typography style={{ fontSize: 32, fontWeight: "bold" }}>New Route</Typography></div>
      <div className={classes.gridContainer}>
        <div className={classes.gridRequired}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField fullWidth variant="filled" error={!isValidName}
                value={routeName} onChange={handleRoute}
                label={<span>Name<span style={{ color: '#AA0000' }}>*</span></span>} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth variant="filled" error={!isValidCity}
                value={cityName} onChange={handleCity}
                label={<span>Town/City<span style={{ color: '#AA0000' }}>*</span></span>} />
            </Grid>
            <Grid item xs={12}>
              <DualGroupedTextField buttonLabel="ADD" buttonColor="primary"
                label1={<span>Street Name<span style={{ color: '#AA0000' }}>*</span></span>} value1={currStreet} onChange1={handleStreet}
                label2={<span>House Number<span style={{ color: '#AA0000' }}>*</span></span>} value2={currHouses} onChange2={handleAddress}
                helperText1="Street Name Only"
                helperText2="Comma Seperated"
                onButtonClick={updateStreetList}
              />
              {Object.keys(houseNumbers).length > 0 ? <ChipList color="primary" list={Object.keys(houseNumbers)} onClick={openStreet} onDelete={removeStreet} /> : null}
            </Grid>
          </Grid>
        </div>
        <div className={classes.gridMap}>
          <Map addresses={houseNumbers} width={'100%'} height={'500px'} cityState={`${cityName}, NC`} />
        </div>
        <div className={classes.gridOld}>
          <Grid container spacing={3}>
            <Grid item xs={12}><h1>Previous Canning Data</h1></Grid>
            <Grid item xs={6}>
              <TextField fullWidth variant="filled"
                value={canningDate} onChange={handleDates}
                onBlur={handleDateBlur} onFocus={handleDateFocus}
                label="Date" helperText="MM/DD/YY" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth variant="filled"
                value={numDonated} onChange={handleDonated}
                label="$ Donations"
              />
            </Grid>
            <Grid item xs={12}>
              <GroupedTextField label="Volunteer Notes" buttonLabel="ADD" buttonColor="primary"
                fieldValue={currNote} onChange={handleNotes} onButtonClick={updateNoteList}
              />
              {volNotes.length > 0 ? <ChipList color="default" list={volNotes} onDelete={removeNote} /> : null}
            </Grid>
          </Grid>
        </div>
      </div>
      <div className={classes.buttonContainer}>
        <div className={classes.formButton}><Link to={ROUTES.ADMIN_ROUTES} component={PillButton}>Cancel</Link></div>
        <div className={classes.formButton}>
          <PillButton variant="contained" color="primary" onClick={saveForm} disabled={!validForm}>
            Save
          </PillButton>
        </div>
        {/* This is a dummy object, it's supposed to hold an invisible map */}
        <div ref={ref} style={{ display: 'none' }}></div>
      </div>
    </div>

  );
};

export default NewRoutePanel;
