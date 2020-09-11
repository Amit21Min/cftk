import React, { useState } from 'react';

const EditRoutePanel = () => {
    const [routeName, setRouteName] = useState('');
    const [currStreet, setCurrStreet] = useState('');
    const [streetNames, setStreetNames] = useState([]);
    const [canningDate, setCanningDate] = useState('');
    const [numDonated, setNumDonated] = useState('');
    const [currNote, setCurrNote] = useState('');
    const [volNotes, setVolNotes] = useState([]);

    var street = "Hillsborough+Street"; // get from input box, dynamically update and re-render
    var houseNumber = "425"; // get from input box, dynamically update and re-render
    var source = getHouse(street, houseNumber);

    function getHouse(street, houseNumber) {
        var address = `${houseNumber}+${street}`;
        return `https://www.google.com/maps/embed/v1/search?key=${process.env.REACT_APP_MAPS_API_KEY}&q=${address}`;
    }

return(
    <div>
        <h1 className="title"> Edit Route</h1>
        <div className="columns">
            <div className="column">
                <form>
                    <div className="field">
                        <div className="control">
                            <input className="input" type="tecxt" placeholder="Name(Required)" value={routeName}/>
                        </div>
                    </div>
                    <h1>Street Name</h1>
                    <div>
                        {streetNames.map(street => (
                            <button className="button" key={street}>{street}</button>
                        ))}
                    </div>
                    <div className="field-is-grouped">
                        <div className="control">
                            <input className="input" type="text" placeholder="Street Name (Required)" value={currStreet}/>
                        </div>
                        <button className="button is-circle" >+</button>
                    </div>
                    <h1> Last Canning Data</h1>
                    <div className="field">
                        <div className="control">
                            <input className="input" type="text" placeholder="Date (Optional)" value={canningDate} />
                        </div>
                        <label className="label">MM/DD/YY</label>
                    </div>
                    <div className="field">
                        <div className="control">
                            <input className="input" type="number" placeholder="Donations (Optional)" value={numDonated} />
                        </div>
                        <label className="label">MM/DD/YY</label>
                    </div>
                    <h1> Volunteer notes</h1>
                    <div>
                        {volNotes.map (note => (
                            <button className="button" key={note}>{note}</button>
                        ))}
                    </div>
                    <div className="field is-grouped">
                        <div className="control">
                            <input className="input" type="text" placeholder="Note" value={currNote} />
                        </div>
                        <button className="button" >+</button>
                    </div>
                </form>
            </div>
            <div className="column">
                <div>
                    <iframe title="viewHouse"
                        width="600"
                        height="450"
                        frameBorder="0" styles="border:0"
                        src={source}
                        allowFullScreen>
                    </iframe>
                </div>
            </div>
        </div>
        <input className="button" type="submit"/>
    </div>
);
};
export default EditRoutePanel;