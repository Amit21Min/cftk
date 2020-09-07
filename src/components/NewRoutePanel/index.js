import React, { useState } from 'react';

const NewRoutePanel = () => {

  const [routeName, setRouteName] = useState('');
  const [currStreet, setCurrStreet] = useState('');
  const [streetNames, setStreetNames] = useState([]);
  const [canningDate, setCanningDate] = useState('');
  const [numDonated, setNumDonated] = useState('');
  const [currNote, setCurrNote] = useState('');
  const [volNotes, setVolNotes] = useState([]);

  const updateInput = (event, setter) => {
    setter(event.target.value)
    console.log(event.target.value)
  }

  const updateStreetList = event => {
    event.preventDefault()
    setStreetNames([...streetNames, currStreet]);
    setCurrStreet('');
  }

  const updateNoteList = event => {
    event.preventDefault()
    setVolNotes([...volNotes, currNote]);
    setCurrNote('');
  }

  const handleDateFocus = event => {
    event.currentTarget.type = 'date';
  }

  const handleDateBlur = event => {
    event.currentTarget.type = 'text'
  }

  const getHouse = (street, houseNumber) => {
    var address = `${houseNumber}+${street}`;
    return `https://www.google.com/maps/embed/v1/search?key=${process.env.REACT_APP_MAPS_API_KEY}&q=${address}`;
  }

  let street = "Hillsborough+Street"; // get from input box, dynamically update and re-render
  let houseNumber = "425"; // get from input box, dynamically update and re-render
  let source = getHouse(street, houseNumber);

  return (
    <div>
      <h1 className="title">New Route</h1>
      <div className="columns">
        <div className="column">
          <form>
            <div className="field">
              <div className="control">
                <input className="input" type="text" placeholder="Name (Required)" value={routeName} onChange={(event) => updateInput(event, setRouteName)} />
              </div>
            </div>
            <h1>Street Name</h1>
            <div>
              {streetNames.map(street => (
                <div>{street}</div>
              ))}
            </div>
            <div className="field is-grouped">
              <div className="control">
                <input className="input" type="text" placeholder="Street Name (Required)" value={currStreet} onChange={(event) => updateInput(event, setCurrStreet)} />
              </div>
              <button className="button" onClick={updateStreetList}>Add</button>
            </div>
            <h1>Last Canning Data</h1>
            <div className="field">
              <div className="control">
                <input className="input" type="text" placeholder="Date (optional)" onFocus={handleDateFocus} onBlur={handleDateBlur} value={canningDate} onChange={(event) => updateInput(event, setCanningDate)} />
              </div>
              <label className="label">MM/DD/YY</label>
            </div>
            <div className="field">
              <div className="control">
                <input className="input" type="number" placeholder="Donations (optional)" value={numDonated} onChange={(event) => updateInput(event, setNumDonated)} />
              </div>
            </div>
            <h1>Volunteer Notes</h1>
            <div>
              {volNotes.map(note => (
                <div>{note}</div>
              ))}
            </div>
            <div className="field is-grouped">
              <div className="control">
                <input className="input" type="text" placeholder="Note" value={currNote} onChange={(event) => updateInput(event, setCurrNote)} />
              </div>
              <button className="button" onClick={updateNoteList}>Add</button>
            </div>
          </form>
        </div>
        <div className="column">
          <div className="google_map">
            <iframe title="viewRoute"
              width="100"
              height="450"
              frameBorder="0" styles="border:0"
              src={source}
              allowFullScreen>
            </iframe>
          </div>
        </div>

      </div>
    </div>

  );
};

export default NewRoutePanel;
