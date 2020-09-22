import React, { useState } from 'react';
import { TextField, FormControl, FormGroup, Chip, Button } from '@material-ui/core';


const NewRoutePanel = () => {

  // TODO 1: Implement donation, route, and house metrics
  // TODO 2: Implement revision history and modified by
  // TODO 3: Deal with google map implementation
  // TODO 4: Deal with donation amount not necessarily being a number value
  // TODO 5: Figure out required functionality


  // variables used in the state
  const [routeName, setRouteName] = useState('');
  const [currStreet, setCurrStreet] = useState('');
  const [streetNames, setStreetNames] = useState([]);
  const [canningDate, setCanningDate] = useState('');
  const [numDonated, setNumDonated] = useState('');
  const [currNote, setCurrNote] = useState('');
  const [volNotes, setVolNotes] = useState([]);


  const defaultQuery = 'University+of+North+Carolina+Chapel+Hill';
  const defaultOrigin = 'University+of+North+Carolina+Chapel+Hill';
  const [mapURL, setMapURL] = useState(parseQuery(defaultQuery));




  function updateInput(e, setter) {
    // Executes the passed in setter, allows for additional functionality afterwards as well
    setter(e.target.value)
    console.log(e.target.value)
  }

  function addToStreetList(e) {
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

    setStreetNames([...streetNames, currStreet]);
    setCurrStreet('');
    mapRoute([...streetNames, currStreet]);
  }

  function removeFromStreetList(e, toRemove) {
    e.preventDefault();
    let newStreets = streetNames.filter(name => name !== toRemove);
    setStreetNames(newStreets);
    if (newStreets.length > 0) {
      mapRoute(newStreets);
    } else {
      setMapURL(parseQuery(defaultQuery))
    }
  }

  function addToNoteList(e) {
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

  function removeFromNoteList(e, toRemove) {
    e.preventDefault();
    setVolNotes(volNotes.filter(note => note !== toRemove));
  }

  function handleDateFocus(e) {
    // When clicking on input, switches input type to date. Allows for placeholder text
    e.currentTarget.type = 'date';
  }

  function handleDateBlur(e) {
    // Changes input back to text if it is empty so placeholder text can still be shown
    if (canningDate === '' || canningDate === 'mm/dd/yy') e.currentTarget.type = 'text';
  }

  function saveForm() {
    // Executes when save button is clicked.
    // Alerts and doesn't save if required inputs are not filled (Placeholder)
    if (routeName === '') {
      alert('Please enter a route name');
      return;
    } else if (streetNames.length === 0 && currStreet === '') {
      alert('Please enter/add a street name');
      return;
    }

    // Currently only logs form information to console
    console.log({
      name: routeName,
      streets: streetNames,
      date: canningDate,
      donations: numDonated,
      notes: volNotes,
      created: new Date().toString()
    })
  }



  // Map Sandbox

  function searchMap(e) {
    // generates and sets a new map url for map
    if (e.target.value.length > 0) {
      let query = parseQuery(e.target.value)
      setMapURL(query);
    } else if (streetNames.length > 0) {
      mapRoute(streetNames);
    } else {
      setMapURL(parseQuery(defaultQuery))
    }
  }

  function parseQuery(query) {
    query.replace(' ', '+');
    return `https://www.google.com/maps/embed/v1/search?key=${process.env.REACT_APP_MAPS_API_KEY}&q=${query}`;
  }

  function mapRoute(streets) {
    let waypoints = '';
    streets.forEach(street => {
      waypoints += `${street.replace(' ', '+')}|`
    })
    setMapURL(`https://www.google.com/maps/embed/v1/directions?key=${process.env.REACT_APP_MAPS_API_KEY}
    &origin=${defaultOrigin}
    &destination=${defaultOrigin}
    &waypoints=${waypoints.substring(0, waypoints.length - 1)}`);
  }

  return (
    <div>
      <h1 className="title">New Route</h1>
      <div className="columns">
        <div className="column">
          <FormControl>
            <FormGroup>
              <TextField label="Name" variant="filled" value={routeName} onChange={(e) => updateInput(e, setRouteName)} />
              <div className="new-route-grouped-input">
                <TextField label="Streets" variant="filled" value={currStreet} onChange={(e) => { updateInput(e, setCurrStreet); searchMap(e); }} />
                <Button color="primary" disabled={currStreet.length === 0} onClick={addToStreetList}>Add</Button>
              </div>
              <div>
                {
                  streetNames.map(street => (
                    <Chip color="default" key={street} label={street} onDelete={(e) => removeFromStreetList(e, street)} />
                  ))
                }
              </div>
            </FormGroup>
          </FormControl>
          <h1 className="title">Previous Canning Data</h1>
          <FormControl>
            <FormGroup>
              <TextField label="Date" variant="filled" value={canningDate} onChange={(e) => { updateInput(e, setCanningDate) }} onFocus={handleDateFocus} onBlur={handleDateBlur} />
              <TextField label="$ Donations" variant="filled" type="number" value={numDonated} onChange={(e) => { updateInput(e, setNumDonated) }} />
              <div className="new-route-grouped-input">
                <TextField label="Volunteer notes" variant="filled" value={currNote} onChange={(e) => { updateInput(e, setCurrNote) }} />
                <Button color="primary" disabled={currNote.length === 0} onClick={addToNoteList}>Add</Button>
              </div>
              <div>
                {
                  volNotes.map(note => (
                    <Chip color="default" key={note} label={note} onDelete={(e) => removeFromNoteList(e, note)} />
                  ))
                }
              </div>
            </FormGroup>
          </FormControl>
        </div>
        <div className="column">
          {/* Placeholder google map */}
          <div>
            <iframe title="viewRoute"
              width="600"
              height="450"
              frameBorder="0" styles="border:0"
              src={mapURL}
              allowFullScreen>
            </iframe>
          </div>
        </div>
      </div>
      {/* Figuring out submit button, might put into form */}
      <Button type="submit" color="primary" onClick={saveForm}>Save</Button>
    </div>


  );
};

export default NewRoutePanel;
