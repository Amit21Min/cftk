import React, { useState } from 'react';
// import db from '../Firebase/firebase.js';
import { storeRouteData } from '../RouteModels/routes';
import { Link } from 'react-router-dom'
import { Typography, Grid, TextField, Button } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import GroupedTextField from '../GroupedTextField';
import DualGroupedTextField from '../GroupedTextField/streetGroupedTextField';
import ChipList from '../ChipList';

import * as ROUTES from '../../constants/routes';

import { Map } from '../Map';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0075A3',
    },
  },
});

const NewRoutePanel = () => {
  // TODO 1: Implement donation, route, and house metrics
  // TODO 2: Implement revision history and modified by
  // TODO 3: Deal with google map implementation
  // TODO 4: Deal with donation amount not necessarily being a number value
  // TODO 5: Figure out required functionalityInput

  // variables used in the state
  const [routeName, setRouteName] = useState('');
  const [isValidName, setIsValidName] = useState(true);
  const [townCity, setTownCity] = useState('');
  const [isValidCity, setIsValidCity] = useState(true);
  const [currStreet, setCurrStreet] = useState('');
  const [currHouses, setCurrHouses] = useState('');
  const [isValidStreet, setIsValidStreet] = useState(true);
  const [addressList, setAddressList] = useState([]);
  const [houseNumbers, setHouseNumbers] = useState({});
  const [canningDate, setCanningDate] = useState('');
  const [numDonated, setNumDonated] = useState('');
  const [currNote, setCurrNote] = useState('');
  const [volNotes, setVolNotes] = useState([]);

  const [validForm, setValidForm] = useState(false)

  const updateStreetList = e => {
    // Adds street to list as long as street not already included or input is not empty
    // preventDefault() prevents the page from reloading whenever a button is pressed
    e.preventDefault()
    if (addressList.includes(currStreet) || currHouses.length === 0) {
      setIsValidStreet(false);
      return;
    }

    // Revalidates form
    if (routeName.length === 0) setValidForm(false);
    else if (townCity.length === 0) setValidForm(false);
    else setValidForm(true);

    // STILL NEED TO IMPLEMENT - SHOWING THE HOUSE NUMBERS + STREET (CURRENTLY ONLY SHOWS STREET WHEN ADDED)
    // BARE FUNCTIONALITY, PROBABLY MANY BUGS

    let numbers = currHouses.trim().split(",");
    // var newHouse = {};
    // newHouse[currStreet] = numbers;
    let parsedStreet = currStreet.replace(/\W/g, '')

    let newAddresses = numbers.map(number => `${number} ${parsedStreet}`)
    let totalAddresses = [...addressList, ...newAddresses].filter((c, index) => {
      return [...addressList, ...newAddresses].indexOf(c) === index;
    });

    setAddressList(totalAddresses);
    // stores houseNumbers as {street1: [122,123,145], street2: [122,123,124]}
    setHouseNumbers(prevState => {
      if (prevState[parsedStreet] != null) {
        let totalNumbers = [...prevState[parsedStreet], ...numbers].filter((c, index) => {
          return [...prevState[parsedStreet], ...numbers].indexOf(c) === index;
        });
        return { ...houseNumbers, [parsedStreet]: totalNumbers }
      }
      else return { ...houseNumbers, [parsedStreet]: numbers }
    });

    setCurrStreet('');
    setCurrHouses('');
  }


  const removeStreet = street => {
    // Removes specified street

    let streetName = street.replace(/\W/g, '').replace(/[0-9]/g, '');
    let streetNum = parseInt(street).toString();

    setAddressList(prevState => prevState.filter(name => name !== street));
    setHouseNumbers(prevState => {
      prevState[streetName] = prevState[streetName].filter(number => number !== streetNum)
      if (prevState[streetName].length === 0) delete prevState[streetName];
      return prevState;
    });

    setIsValidStreet(true);

    // Revalidates form
    if (routeName.length === 0) setValidForm(false);
    else if (townCity.length === 0) setValidForm(false);
    else if (addressList.length === 1) setValidForm(false);
    else setValidForm(true);
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

  const getHouse = (street, houseNumber) => {
    // Returns link for google maps iframe
    var address = `${houseNumber}+${street}`;
    return `https://www.google.com/maps/embed/v1/search?key=${process.env.REACT_APP_MAPS_API_KEY}&q=${address}&q=112+Campbell+Ln`;
  }

  const saveForm = _ => {
    // Executes when save button is clicked.
    // Alerts and doesn't save if required inputs are not filled (Placeholder)
    if (routeName === '') {
      alert('Please enter a route name');
      return;
    } else if (addressList.length === 0) {
      alert('Please enter/add a street name');
      return;
    }
    storeRouteData(routeName, houseNumbers, volNotes, townCity);

  }

  const validateRequired = _ => {
    if (routeName.length === 0) setValidForm(false);
    else if (townCity.length === 0) setValidForm(false);
    else if (addressList.length === 0) setValidForm(false);
    else setValidForm(true);
  }

  // Google map implementation is a placeholder from ViewHouseProperties
  let street = "Campbell+Ln";
  let houseNumber = "108";
  let source = getHouse(street, houseNumber);
  let streets = ["Rose+Ln", "N+Boundary+St", "Campbell+Ln", "N+Boundary+St"]
  // let source = getRoute(streets);

  console.log(houseNumbers)

  return (
    <ThemeProvider theme={theme}>
      <Grid container spacing={3}>
        <Grid item xs={12}><Typography style={{ fontSize: 32, fontWeight: "bold" }}>New Route</Typography></Grid>
        <Grid item xs={6}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField fullWidth variant="filled" error={!isValidName}
                // Validates form on blur
                value={routeName} onChange={(e) => { setRouteName(e.target.value); setIsValidName(true) }} onBlur={validateRequired}
                label="Name*" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth variant="filled" error={!isValidCity}
                value={townCity} onChange={(e) => { setTownCity(e.target.value) }} onBlur={validateRequired}
                label="Town/City*" />
            </Grid>
            <Grid item xs={12}>
              <DualGroupedTextField buttonLabel="ADD" buttonColor="primary" error={!isValidStreet}
                label1="Street Name*" value1={currStreet} onChange1={(e) => { setCurrStreet(e.target.value); setIsValidStreet(true) }}
                label2="House Numbers*" value2={currHouses} onChange2={(e) => { setCurrHouses(e.target.value) }} list={addressList}
                onButtonClick={updateStreetList}
              />
              {addressList.length > 0 ? <ChipList color="primary" list={addressList} onDelete={removeStreet} /> : null}
            </Grid>
            <Grid item xs={12}><h1>Previous Canning Data</h1></Grid>
            <Grid item xs={6}>
              <TextField fullWidth variant="filled"
                value={canningDate} onChange={(e) => setCanningDate(e.target.value)}
                onBlur={handleDateBlur} onFocus={handleDateFocus}
                label="Date" helperText="MM/DD/YY" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth variant="filled"
                value={numDonated} onChange={(e) => setNumDonated(e.target.value)}
                label="$ Donations"
              />
            </Grid>
            <Grid item xs={12}>
              <GroupedTextField label="Volunteer Notes" buttonLabel="ADD" buttonColor="primary"
                fieldValue={currNote} onChange={(e) => setCurrNote(e.target.value)} onButtonClick={updateNoteList}
              />
              {volNotes.length > 0 ? <ChipList color="default" list={volNotes} onDelete={removeNote} /> : null}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Map address={houseNumbers} cityState={["Chapel Hill, NC"]} />
        </Grid>
        <Grid item xs={10} />
        <Grid item xs={1}><Link to={ROUTES.ADMIN_ROUTES} component={Button} style={{ height: "100%", width: "100%", borderRadius: '5em' }}>Cancel</Link></Grid>
        <Grid item xs={1}>
          <Button style={{ height: "100%", width: "100%", borderRadius: '5em' }} variant="contained" color="primary" onClick={saveForm} disabled={!validForm}>
            Save
          </Button>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default NewRoutePanel;
