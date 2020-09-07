import React, { useState } from 'react';

const NewRoutePanel = () => {

  // TODO 1: Implement donation, route, and house metrics
  // TODO 2: Implement revision history and modified by
  // TODO 3: Deal with google map implementation
  // TODO 4: Deal with donation amount not necessarily being a number value

  const [routeName, setRouteName] = useState('');
  const [currStreet, setCurrStreet] = useState('');
  const [streetNames, setStreetNames] = useState([]);
  const [canningDate, setCanningDate] = useState('');
  const [numDonated, setNumDonated] = useState('');
  const [currNote, setCurrNote] = useState('');
  const [volNotes, setVolNotes] = useState([]);

  const updateInput = (e, setter) => {
    setter(e.target.value)
    console.log(e.target.value)
  }

  const updateStreetList = e => {
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
  }

  const updateNoteList = e => {
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

  const handleDateFocus = e => {
    e.currentTarget.type = 'date';
  }

  const handleDateBlur = e => {
    if (canningDate === '' || canningDate === 'mm/dd/yy') e.currentTarget.type = 'text';
  }

  const getHouse = (street, houseNumber) => {
    var address = `${houseNumber}+${street}`;
    return `https://www.google.com/maps/embed/v1/search?key=${process.env.REACT_APP_MAPS_API_KEY}&q=${address}`;
  }

  const saveForm = e => {
    if (routeName === '') {
      alert('Please enter a route name');
      return;
    } else if (streetNames.length === 0 && currStreet === '') {
      alert('Please enter/add a street name');
      return;
    }

    console.log({
      name: routeName,
      streets: streetNames,
      date: canningDate,
      donations: numDonated,
      notes: volNotes,
      created: new Date()
    })
  }

  // Google map implementation is a placeholder from ViewHouseProperties
  let street = "Hillsborough+Street";
  let houseNumber = "425";
  let source = getHouse(street, houseNumber);

  return (
    <div>
      <h1 className="title">New Route</h1>
      <div className="columns">
        <div className="column">
          <form>
            <div className="field">
              <div className="control">
                <input className="input" type="text" placeholder="Name (Required)" value={routeName} onChange={(e) => updateInput(e, setRouteName)} />
              </div>
            </div>
            <h1>Street Name</h1>
            <div>
              {streetNames.map(street => (
                <div key={street}>{street}</div>
              ))}
            </div>
            <div className="field is-grouped">
              <div className="control">
                <input className="input" type="text" placeholder="Street Name (Required)" value={currStreet} onChange={(e) => updateInput(e, setCurrStreet)} />
              </div>
              <button className="button" onClick={updateStreetList}>Add</button>
            </div>
            <h1>Last Canning Data</h1>
            <div className="field">
              <div className="control">
                <input className="input" type="text" placeholder="Date (optional)" onFocus={handleDateFocus} onBlur={handleDateBlur} value={canningDate} onChange={(e) => updateInput(e, setCanningDate)} />
              </div>
              <label className="label">MM/DD/YY</label>
            </div>
            <div className="field">
              <div className="control">
                <input className="input" type="number" placeholder="Donations (optional)" value={numDonated} onChange={(e) => updateInput(e, setNumDonated)} />
              </div>
            </div>
            <h1>Volunteer Notes</h1>
            <div>
              {volNotes.map(note => (
                <div key={note}>{note}</div>
              ))}
            </div>
            <div className="field is-grouped">
              <div className="control">
                <input className="input" type="text" placeholder="Note" value={currNote} onChange={(e) => updateInput(e, setCurrNote)} />
              </div>
              <button className="button" onClick={updateNoteList}>Add</button>
            </div>
          </form>
        </div>
        <div className="column">
          <div>
            <iframe title="viewRoute"
              width="600"
              height="450"
              frameBorder="0" styles="border:0"
              src={source}
              allowFullScreen>
            </iframe>
          </div>
        </div>
      </div>
      <button className="button" onClick={saveForm}>Save</button>
    </div>

  );
};

export default NewRoutePanel;
