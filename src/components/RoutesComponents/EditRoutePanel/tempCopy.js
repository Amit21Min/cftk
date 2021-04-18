import React, { useState, useReducer } from 'react';
import { getCity, editRouteData } from '../ReusableComponents/RouteModels/routes.js';
import * as ROUTES from '../../../constants/routes';
import { Link } from 'react-router-dom';
import { Typography, Grid, Chip, TextField, Button, InputLabel, InputAdornment} from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import GroupedTextField from '../../ReusableComponents/GroupedTextField';
import ChipList from '../../ReusableComponents/ChipList';
import AlertDialogue from '../../ReusableComponents/AlertDialogue';
import MoveStreet from '../MoveStreet';
import db from '../../FirebaseComponents/Firebase/firebase.js';


const EditRoutePanel = () => {

    const [routeName, setRouteName] = useState('');
    const [isValidName, setIsValidName] = useState(true);
    const [townCity, setTownCity] = useState('');
    const [isValidCity, setIsValidCity] = useState(true)
    const [currStreet, setCurrStreet] = useState('');
    const [isValidStreet, setIsValidStreet] = useState(true);
    const [streetNames, setStreetNames] = useState([]);
    const [canningDate, setCanningDate] = useState('');
    const [numDonated, setNumDonated] = useState('');
    const [currNote, setCurrNote] = useState('');
    const [volNotes, setVolNotes] = useState([]);
    const[validForm, setValidForm] = useState(false);

    const theme = createMuiTheme({
        palette: {
          primary: {
            main: '#0075A3',
          },
        },
      });

    const updateStreetList = e => {
    //adds street to list as long as street is not a;ready included in the list
    //preventDefault() prevents the page from reoading every time a button is clicked
        e.preventDefault();
        if (streetNames.includes(currStreet)) {
            setIsValidStreet(false);
            return;
        }

        //Revalidates form
        if (routeName.length === 0) {
            setValidForm(false);
        } else if (townCity.length === 0) {
            setValidForm(false);
        } else  {
            setValidForm(true);
        }

        setStreetNames([...streetNames, currStreet]);
        setCurrStreet('');
    }

    const removeStreet = street => {
        //Removes specified street
        setStreetNames(streetNames.filter(name => name != street));
        setIsValidStreet(true);

        //Revalidates form
        if (routeName.length === 0) {
            setValidForm(false);
        } else if (townCity.length === 0) {
            setValidForm(false);
        } else  {
            setValidForm(true);
        }
    }

    const updateNoteList = e => {
        e.preventDefault();
        if (volNotes.includes(currNote)) {
            alert("Please don't repeat an existing note");
            return;
        } else if (currNote === '') {
            alert("Please enter some text");
            return;
        }
        setVolNotes([...volNotes, currNote]);
        setCurrNote('');
    }

    const removeNote = note => {
        //Removes the specified volunteer note
        setVolNotes(volNotes.filter(text => text != note));
    }

    const handleDateFocus = e => {
        // When clicking on input, switches input type to date. Allows for placeholder text
        e.currentTarget.type = 'date';
    }

    const handleDateBlur = e => {
        // Changes input back to text if it is empty so placeholder text can still be shown
        if (canningDate === '' || canningDate === 'mm/d//yy') {
            e.currentTarget.type = 'text';
        }
    }

    const saveForm = e => {
        // Executes when save button is clicked.
        // Alerts and doesn't save if required inputs are not filled (Placeholder)
        if (routeName === '') {
            alert('Please enter a route name');
            return;
        } else if (streetNames.length === 0 && currStreet === '') {
            alert('Please enter/add a street name');
            return;
        }
        // storeRouteData(new Date().getTime().toString(), routeName, streetNames, volNotes, townCity);

        //const dataFound = retrieveData(routeName);
        //console.log(dataFound);

        editRouteData(routeName, streetNames, volNotes, townCity);

        /*
        console.log({
            name: routeName,
            streets: streetNames,
            date: canningDate,
            donations: numDonated,
            notes: volNotes,
            created: new Date()
        })
        */
    }

    const validateRequired = _ => {
        if (routeName.length === 0) {
            setValidForm(false);
        } else if (townCity.length === 0) {
            setValidForm(false);
        } else if (streetNames.length === 0) {
            setValidForm(false);
        } else {
            setValidForm(true);
        }
    }

    // update the fields upon the routename entered
    const updateFields = async () => {
        if (routeName.length !== 0) {
            db.collection("Routes").doc(routeName).get().then(function (doc) {
                if (doc.exists) {
                    setTownCity(doc.get('city'));
                    setStreetNames(doc.get('streets'));
                    setVolNotes(doc.get('comments'));
                    // temp (arbitrary) date for the canning and amount
                    setCanningDate("09/01/2020");
                    setNumDonated(0);
                } else {
                    setTownCity('');
                    setStreetNames('');
                    setCanningDate("");
                    setVolNotes('');
                    setNumDonated("");
                }
            }).catch(function (error) {
                console.log("Error getting document:", error);
                setTownCity('');
                setStreetNames((''));
                setCanningDate("");
                setVolNotes('');
                setNumDonated("");
            });
        }
    }

    const getHouse = (street, houseNumber) => {
        //Returns link for Google Mpas iframe
        var address = `${houseNumber}+${street}`;
        return `https://www.google.com/maps/embed/v1/search?key=${process.env.REACT_APP_MAPS_API_KEY}&q=${address}`;
    }
    
    var street = "Hillsborough+Street"; // get from input box, dynamically update and re-render
    var houseNumber = "425"; // get from input box, dynamically update and re-render
    var source = getHouse(street, houseNumber);
    

    const townLabel = <p>Town/City <span style={{ color: "#B00020" }}>*</span></p>
    const nameLabel = <p>Name <span style={{ color: "#B00020" }}>*</span></p>
    const streetsLabel = <p>Streets <span style={{ color: "#B00020" }}>*</span></p>
    const dateLabel = <p>Date <span style={{ color: "#B00020" }}>*</span></p>

    //fetch number of houses from firebase for this
    const housesLabel = <p>Total number of houses: <span style={{ fontWeight: "bold"}}>52</span></p>

    return (
        <ThemeProvider theme={theme}>
            <Grid container spacing={3}>
                <Grid item xs={12}> <Typography style = {{ fontSize: 32, fontWeight: "bold"}}>Edit Route</Typography></Grid>
                <Grid item xs={6}> 
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <TextField fullWidth variant="filled" error={!isValidName}
                                //validates form on blur
                                value={routeName} onChange={(e) => { setRouteName(e.target.value); setIsValidName(true); }} onBlur={validateRequired, updateFields}
                                label={nameLabel}
                                />
                        </Grid>
                        <Grid item xs={6}> 
                        <TextField style={{borderBottomWidth: "10px"}} fullWidth variant="filled" error={!isValidName}
                            //validates form on blur
                            value={townCity} onChange={(e) => { setTownCity(e.target.value); setIsValidCity(true)}} onBlur={validateRequired}
                            label={townLabel} />
                        </Grid>
                        <Grid item xs={12}>
                            <GroupedTextField label={streetsLabel} buttonLabel="ADD" buttonColor="primary" error={!isValidStreet}
                                fieldValue={currStreet} onButtonClick={updateStreetList} onChange= {(e) => {setCurrStreet(e.target.value); setIsValidStreet(true)}}
                            />
                            <Grid item xs={12}>
                                <span class="help-block" style={{fontSize: 12}}>Tap or press ADD to add a street </span>
                            </Grid>
                            {streetNames.length >0 ? <ChipList color="primary" list={streetNames} onDelete={removeStreet} /> : null}
                            <Chip label={housesLabel} variant="outlined"></Chip>
                        </Grid>
                        <Grid item xs={4}>
                            <AlertDialogue buttonName="Move Street Alert" message="The street **street name** has already been assigned 
                            to the volunteer group **group name**. If you move this route, this group will no longer be assigned this street."
                            primaryButtonName="Move"/>
                        </Grid>
                        <Grid item xs={4}>
                            <AlertDialogue buttonName="Unable to Edit" message="The user **user name** is currently editing this route. 
                            You cannot edit a route another user is currently editing."
                            primaryButtonName="OK"/>
                        </Grid>
                        <Grid item xs={4}>
                            <MoveStreet/>
                        </Grid>
                        <Grid item xs={12}> <Typography style = {{ fontSize: 24, fontWeight: "bold"}}>Previous Canning Data</Typography></Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth variant="filled"
                                value={canningDate} onFocus={handleDateFocus} onBlur={handleDateBlur} 
                                onChange = {(e) => setCanningDate(e.target.value)} label={dateLabel}/>
                            <span class="help-block"  style={{fontSize: 12}}>MM/DD/YYYY </span>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth variant="filled" 
                                value={numDonated} onChange = {(e) => setNumDonated(e.target.value)}
                                label="$ Donations "/>
                        </Grid> 
                        <Grid item xs={12}>
                            <GroupedTextField label="Volunteer notes " buttonLabel="ADD" buttonColor="primary"
                            fieldValue={currNote} onChange={(e) => setCurrNote(e.target.value)} onButtonClick={updateNoteList}
                            />
                            <span class="help-block"  style={{fontSize: 12}}>Eg. Very nice people</span>
                            {volNotes.length > 0 ? <ChipList color="default" list={volNotes} onDelete={removeNote} /> : null}                        
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <iframe title="viewHouse"
                        width="600"
                        height="450"
                        frameBorder="0" styles="border:0"
                        src={source}
                        allowFullScreen>
                    </iframe>
                </Grid>
                <Grid item xs={10} />
                <Grid item xs={1}  >
                    <Button variant="contained" style={{ height: "100%", width: "100%", borderRadius: '5em' }} ><Link to={ROUTES.ADMIN_ROUTES}>CANCEL</Link></Button>
                </Grid>
                <Grid item xs={1}>
                    <Button variant="contained" color="primary" style={{ height: "100%", width: "100%", borderRadius: '5em' }} onClick={saveForm} disabled={!validForm}>SAVE</Button>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};
export default EditRoutePanel;