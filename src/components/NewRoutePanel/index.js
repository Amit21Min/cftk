import React, { useState } from 'react';
// import db from '../Firebase/firebase.js';
import { storeRouteData } from '../RouteModels/routes';
import { Typography, Grid, TextField, Button } from '@material-ui/core';
import GroupedTextField from '../GroupedTextField';
import ChipList from '../ChipList';

const NewRoutePanel = () => {

  // TODO 1: Implement donation, route, and house metrics
  // TODO 2: Implement revision history and modified by
  // TODO 3: Deal with google map implementation
  // TODO 4: Deal with donation amount not necessarily being a number value
  // TODO 5: Figure out required functionalityInput

  // variables used in the state
  const [routeName, setRouteName] = useState('');
  const [townCity, setTownCity] = useState('');
  const [currStreet, setCurrStreet] = useState('');
  const [streetNames, setStreetNames] = useState([]);
  const [canningDate, setCanningDate] = useState('');
  const [numDonated, setNumDonated] = useState('');
  const [currNote, setCurrNote] = useState('');
  const [volNotes, setVolNotes] = useState([]);

  const [validForm, setValidForm] = useState(false)

  const updateStreetList = e => {
    // Adds street to list as long as street not already included or input is not empty
    // preventDefault() prevents the page from reloading whenever a button is pressed
    e.preventDefault()
    if (streetNames.includes(currStreet)) {
      alert("Please don't repeat a street name");
      return;
    } else if (currStreet === '') {
      alert("Please enter a street name");
      return;
    }

    // Revalidates form
    if (routeName.length === 0) setValidForm(false);
    else if (townCity.length === 0) setValidForm(false);
    else setValidForm(true);

    setStreetNames([...streetNames, currStreet]);
    setCurrStreet('');
  }

  const removeStreet = street => {
    // Removes specified street
    setStreetNames(streetNames.filter(name => name !== street));

    // Revalidates form
    if (routeName.length === 0) setValidForm(false);
    else if (townCity.length === 0) setValidForm(false);
    else if (streetNames.length === 1) setValidForm(false);
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

    setVolNotes([...volNotes, currNote]);
    setCurrNote('');
  }

  const removeNote = note => {
    // Removes the specified volunteer note
    setVolNotes(volNotes.filter(text => text !== note))
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
    return `https://www.google.com/maps/embed/v1/search?key=${process.env.REACT_APP_MAPS_API_KEY}&q=${address}`;
  }

  const saveForm = _ => {
    // Executes when save button is clicked.
    // Alerts and doesn't save if required inputs are not filled (Placeholder)
    if (routeName === '') {
      alert('Please enter a route name');
      return;
    } else if (streetNames.length === 0) {
      alert('Please enter/add a street name');
      return;
    }

    storeRouteData(new Date().getTime().toString(), routeName, streetNames, volNotes, townCity);

  }

  const validateRequired = _ => {
    if (routeName.length === 0) setValidForm(false);
    else if (townCity.length === 0) setValidForm(false);
    else if (streetNames.length === 0) setValidForm(false);
    else setValidForm(true);
  }

  // Google map implementation is a placeholder from ViewHouseProperties
  let street = "Hillsborough+Street";
  let houseNumber = "425";
  let source = getHouse(street, houseNumber);

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}><Typography style={{ fontSize: 32, fontWeight: "bold" }}>New Route</Typography></Grid>
        <Grid item xs={6}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField fullWidth variant="filled"
                // Validates form on blur
                value={routeName} onChange={(e) => setRouteName(e.target.value)} onBlur={validateRequired}
                label="Name*" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth variant="filled"
                value={townCity} onChange={(e) => setTownCity(e.target.value)} onBlur={validateRequired}
                label="Town/City*" />
            </Grid>
            <Grid item xs={12}>
              <GroupedTextField label="Streets*" buttonLabel="ADD" buttonColor="primary"
                fieldValue={currStreet} onFieldChange={setCurrStreet} onButtonClick={updateStreetList}
              />
              {streetNames.length > 0 ? <ChipList color="primary" list={streetNames} onDelete={removeStreet} /> : null}
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
                fieldValue={currNote} onFieldChange={setCurrNote} onButtonClick={updateNoteList}
              />
              {volNotes.length > 0 ? <ChipList color="default" list={volNotes} onDelete={removeNote} /> : null}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <iframe title="viewRoute"
            width="700"
            height="700"
            frameBorder="0" styles="border:0;"
            src={source}
            allowFullScreen>
          </iframe>
        </Grid>
        <Grid item xs={10} />
        <Grid item xs={1}><Button style={{ height: "100%", width: "100%", borderRadius: '5em' }}>Cancel</Button></Grid>
        <Grid item xs={1}><Button style={{ height: "100%", width: "100%", borderRadius: '5em' }} variant="contained" color="primary"
          onClick={saveForm} disabled={!validForm}>Save</Button></Grid>
      </Grid>
    </div>

  );
};

export default NewRoutePanel;
