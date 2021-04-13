import React, { useEffect, useState } from 'react';
// import db from '../Firebase/firebase.js';
import { storeEditRouteData } from '../ReusableComponents/RouteModels/routes';
import { Link, useLocation } from 'react-router-dom'
import { Typography, Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import GroupedTextField from '../../ReusableComponents/GroupedTextField';
import DualGroupedTextField from '../../ReusableComponents/GroupedTextField/DualGroupedTextField';
import ChipList from '../../ReusableComponents/ChipList';
import PillButton from '../../ReusableComponents/PillButton';
import AlertSnackbar from '../../ReusableComponents/AlertSnackbar';
import { useGoogleMaps } from "react-hook-google-maps";
import { getMapAddresses } from '../ReusableComponents/RouteModels/routes';

import * as ROUTES from '../../../constants/routes';

import Map from '../Map/';

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

function useFirebaseStreetInfo(routeName) {
    // Custom hook that splits the addresses object into 3 lists, the new ones that were added, the ones that were removed, and the currently existing ones
    const [streetInfo, setStreetInfo] = useState({});

    useEffect(() => {
        getMapAddresses(routeName).then(newInfo => {
            // for (const [key, value] of Object.entries(simplifiedStreet)) {
            //     if (key === 'city') {
            //     } else if (key !== 'completed' && value.coordinates && value.coordinates.lng && value.coordinates.lat) {
            //         simplifiedStreet.addresses[key] = value.coordinates
            //     }
            // }
            setStreetInfo({
                routeName,
                ...newInfo
            })
        })
    }, [routeName]);

    return streetInfo
}

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const EditRoutePanel = () => {

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
    // const [validForm, setValidForm] = useState(true);
    const [snackBarState, setSnackBarState] = useState({
        open: false,
        severity: "",
        message: ""
    })

    const routeID = useQuery().get("route");
    const streetInfo = useFirebaseStreetInfo(routeID);

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

    async function geocodeAddresses(addressList, streetName, cityName) {

        function geocodePromise(geocoder, address) {
            return new Promise((resolve) => {
                geocoder.geocode({ address: address }, (results, status) => {
                    resolve({ results, status })
                });
            })
        }

        const geocoder = new google.maps.Geocoder();
        let withCoordinates = {};

        const len = addressList.length;
        let overLimitCount = 0;
        for (let i = 0; i < len; i++) {
            const addrNumber = addressList.pop();
            if (addrNumber && houseNumbers[streetName] && houseNumbers[streetName][addrNumber]) {
                // Check to see if this address has already been geocoded before. Makes the remove address process much much faster
                withCoordinates[addrNumber] = houseNumbers[streetName][addrNumber];
            } else if (addrNumber) {
                // Can only move to the next address once the current one is completed
                const { results, status } = await geocodePromise(geocoder, `${addrNumber} ${streetName} ${cityName}`);
                if (status === "OK" && results.length > 0) {
                    withCoordinates[addrNumber] = results[0].geometry.location.toJSON()
                } else if (status === "OVER_QUERY_LIMIT") {
                    // If over the query limit, try again after waiting 2 seconds
                    console.log(`Over Query Limit @ ${i}`);
                    // Very sketchy recreation of sleep from Java
                    await new Promise(r => setTimeout(r, 2000));
                    // Pushes address back into the loop and the loop back
                    addressList.push(addrNumber);
                    i--;
                    // Increments number of times it tries again
                    overLimitCount++;
                } else {
                    // Exit the loop if there is an error not related to the query limit
                    alert("Geocode was not successful for the following reason: " + status);
                    return;
                }
            }
            if (overLimitCount > 20) {
                // If the amount of times it tries again exceeds 20 times or if there are no more addresses left. Return the values it has already gained
                alert("Geocoder Query Limit Exceeded 20+ times, please wait a while before trying again");
                return withCoordinates;
            }
            if (addressList.length === 0) {
                return withCoordinates;
            }
        }
        return withCoordinates;

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
            if (newAddresses) {
                setHouseNumbers(prevState => ({
                    ...prevState,
                    [parsedStreet]: newAddresses
                }));
            }
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
            let newState = { ...prevState }
            delete newState[streetName]
            return newState;
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
        // setRouteName({
        //     routeName: e.target.value,
        //     isValidName: e.target.value.length > 0
        // });
    }

    const handleCity = (e) => {
        setCityName({
            cityName: e.target.value,
            isValidCity: e.target.value.length > 0
        });
    }

    const handleStreet = (e) => {
        // setCurrStreet(e.target.value.replace(/[^A-Za-z]/g, ''))
        setCurrStreet(e.target.value.replace('_', ''))
    }

    const handleAddress = (e) => {
        setCurrHouses(e.target.value.replace(/[^0-9,]/g, ''))
    }

    const handleDonated = (e) => {
        setNumDonated(e.target.value.replace(/[^0-9.]/g, ''))
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

    function handleSnackBarClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBarState(prevState => ({
            ...prevState,
            open: false
        }));
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
        storeEditRouteData(routeName, houseNumbers, volNotes, cityName, canningDate, numDonated, streetInfo).then(msg => {
            setSnackBarState({
                open: true,
                severity: msg.state.toLowerCase(),
                message: msg.message
            })
        });
    }

    const houseKeys = Object.keys(houseNumbers)
    useEffect(validateForm, [routeName, cityName, houseNumbers, houseKeys]);
    useEffect(() => {
        // Filling in data from firebase
        if (Object.keys(streetInfo).length === 0) return;
        setRouteName({
            routeName: routeID,
            isValidName: routeID.length > 0
        });
        const cityName = streetInfo.streetData[0]?.city || "";
        setCityName({
            cityName: cityName,
            isValidCity: cityName.length > 0
        });
        setVolNotes(streetInfo.comments ?? []);
        let tempInfo = {}
        for (let street of streetInfo.streetData) {
            let addresses = {}
            for (let key in street) {
                if (street[key].coordinates && street[key].coordinates.lat && street[key].coordinates.lng) {
                    addresses[key] = street[key].coordinates;
                }
            }
            tempInfo[street.name.substring(0, street.name.indexOf("_"))] = addresses
        }
        setHouseNumbers(tempInfo)

    }, [streetInfo, routeID])

    const classes = useStyles();

    return (
        <div className={classes.pageContainer}>
            <div><Typography style={{ fontSize: 32, fontWeight: "bold" }}>Edit Route</Typography></div>
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
            <AlertSnackbar
                open={snackBarState.open}
                severity={snackBarState.severity}
                autoHideDuration={6000}
                onClose={handleSnackBarClose}>
                {snackBarState.message}
            </AlertSnackbar>

        </div>

    );
};

export default EditRoutePanel;
